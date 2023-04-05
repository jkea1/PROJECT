/**
 * @contributors #PioneerRedwood
 */

import axios from "axios";
import mysql from "mysql2/promise";

const weeklyMovieTable = "weekly_movie";

const connection = await mysql.createConnection({
  host: "127.0.0.1", // localhost
  user: "redwood",
  password: "1234",
  database: "mblix",
});

function check(target) {
  return target !== undefined && target !== null;
}
//////////////////////////////////////////////////////////////////////// Test Code started

const KOBIS_API_KEY = "";
function getLastWeek() {
  const today = new Date();
  today.setDate(today.getDate() - 7);
  const year = today.getFullYear().toString();
  let month = today.getMonth() + 1;
  let day = today.getDate();

  month = month < 10 ? "0" + month : month;
  day = day < 10 ? "0" + day : day;
  return year + month + day;
}

function sleep(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

async function requestNaverMovie(movie) {
  await sleep(100); // sleep for 0.1s
  try {
    // 네이버 영화 요청
    const movieName = movie.name;
    const clientId = "";
    const clientSecret = "";
    if (clientId.length == 0 || clientSecret.length == 0) {
      console.log("NAVER Movie clientId or clientSecret is empty!");
      return null;
    }

    const res = await axios({
      method: "GET",
      url: "https://openapi.naver.com/v1/search/movie.json",
      params: {
        query: movieName,
        yearfrom: 2015,
        yearto: 2022,
      },
      headers: {
        "X-Naver-Client-Id": clientId,
        "X-Naver-Client-Secret": clientSecret,
      },
    });
    if (!check(res.data)) {
      console.log(`Naver Movie API res.data is undefined or null`);
      return null;
    }

    if(res.data.items.length === 0) {
      // console.log(`Naver Movie API result items is empty`);
      return null;
    }

    for (const item of res.data.items) {
      let title = item.title.replace("<b>", "");
      title = title.replace("</b>", "");

      if (title === movieName) {
        const naver_movie_info = {
          naver_movie_url: item.link,
          poster_url: item.image,
        };
        Object.assign(movie, naver_movie_info);
        // console.log(`KOBIS + Naver Movie API success! ${movieName}`);
        return movie;
      }
    }
  } catch (error) {
    console.log(error);
    return null;
  }
}

let weekly_movie_update_date = null;

async function updateWeeklyBoxOffice() {
  const result = [];
  weekly_movie_update_date = getLastWeek();
  console.log(`updateWeeklyBoxOffice date: ${weekly_movie_update_date}`);

  if (KOBIS_API_KEY.length == 0) {
    console.log("updateWeeklyBoxOffice() KOBIS_API_KEY is empty!");
    return result;
  }
  try {
    const res = await axios({
      method: "GET",
      url: "http://www.kobis.or.kr/kobisopenapi/webservice/rest/boxoffice/searchWeeklyBoxOfficeList.json",
      params: {
        key: KOBIS_API_KEY,
        targetDt: weekly_movie_update_date,
        weekGb: "0",
        itemPerPage: 1,
      },
    });
    if (!check(res.data.boxOfficeResult) || !check(res.data.boxOfficeResult.weeklyBoxOfficeList)) {
      console.log(`searchWeeklyBoxOfficeList is not valid! ${JSON.stringify(res.data)}`);
      return null;
    }

    const movies = res.data.boxOfficeResult.weeklyBoxOfficeList;

    for (const movie of movies) {
      const res = await axios({
        method: "GET",
        url: "https://kobis.or.kr/kobisopenapi/webservice/rest/movie/searchMovieInfo.json",
        params: {
          key: KOBIS_API_KEY,
          movieCd: movie.movieCd,
        },
      });
      if (!check(res.data.movieInfoResult) || !check(res.data.movieInfoResult.movieInfo)) {
        console.log(`searchMovieInfo is not valid! ${res.data}`);
        continue;
      }
      const movieInfo = res.data.movieInfoResult.movieInfo;

      let movieElement = {
        // 영화 기본 속성
        name: movieInfo.movieNm,
        english_name: movieInfo.movieNmEn,
        prod_year: movieInfo.prdtYear,
        show_time: movieInfo.showTm,
        movie_code: movieInfo.movieCd,
        genre: "",
        nation: "",
        watch_grade: "",
        director: "",
        actors: [],
        // 영화 순위 관련 속성
        update_date: weekly_movie_update_date,
        weekly_rank: movie.rank,
      };

      if(movieInfo.genres.length > 0) {
        movieElement.genre = movieInfo.genres[0].genreNm;
      }

      if(movieInfo.audits.length > 0) {
        movieElement.watch_grade = movieInfo.audits[0].watchGradeNm;
      }

      if(movieInfo.nations.length > 0) {
        movieElement.nation = movieInfo.nations[0].nationNm;
      }

      if(movieInfo.directors.length > 0) {
        movieElement.director = movieInfo.directors[0].peopleNm;
      }

      let actorCount = 10;
      for (let actor of movieInfo.actors) {
        if (actorCount-- < 0) {
          break;
        } else {
          movieElement.actors.push(actor.peopleNm);
        }
      }

      movieElement = await requestNaverMovie(movieElement);
      if (movieElement != null) {
        console.log(`${movieElement.name} saved!`);
        result.push(movieElement);
      }
    }

    // console.log(`${JSON.stringify(result)}`);

    let query = `DELETE FROM ${weeklyMovieTable}`;
    let [rows, _] = await connection.query(query);
    console.log(`${query} ${rows.affectedRows} row(s) affected`);
    
    for(let i = 0; i < result.length; ++i) {
      const movie = result[i];
      let actors = JSON.stringify(movie.actors);
      actors = actors.replace("[", "").replace("]", "");

      query = 
        `INSERT INTO ${weeklyMovieTable}(id, name, english_name, prod_year, show_time, watch_grade, genre, nation, director, actors, naver_movie_url, poster_url, update_date, weekly_rank) VALUES(`
        + `${i}, "${movie.name}", "${movie.english_name}", "${movie.prod_year}","${movie.show_time}", "${movie.watch_grade}", "${movie.genre}", `
        + `"${movie.nation}", "${movie.director}", JSON_ARRAY(${actors}), `
        + `"${movie.naver_movie_url}", "${movie.poster_url}", "${movie.update_date}", ${Number(movie.weekly_rank)});`;
      console.log(`${query}`);
      [rows, _] = await connection.query(query);
      console.log(`${movie.name} ${rows.affectedRows}`);
    }

  } catch (error) {
    console.log(error);
  }
}

updateWeeklyBoxOffice();
setInterval(updateWeeklyBoxOffice, 1000 * 10); // for test 30 seconds
// setInterval(updateWeeklyBoxOffice, 1000 * 60 * 60 * 24 * 7); // 1000*60*60*24*7
