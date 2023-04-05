/**
 * @contributros #PioneerRedwood
 */

import axios from "axios";
import path from "path";
const __dirname = path.resolve();
import fs from "fs";

const dir = `${__dirname}/movies/KOBIS/20220804/`;
const movies = [];
function readMovieList() {
  try {
    const files = fs.readdirSync(dir);
    files.forEach(file => {
      const data = JSON.parse(fs.readFileSync(dir + file, {
        encoding: "utf-8",
        flag: "r"
      }));
  
      // console.log(`The count of title from ${file}: ${data.length}`);
      // for(let movie of data) {
      //   // console.log(movie.name);
      //   movies.push(movie);
      // }
      movies.push(...data);
      
    });
  } catch(err) {
    console.log(err);
  }
}
// readMovieList();

console.log(`The length of movie list ${movies.length}`);
// fs.writeFileSync(`${dir}/total.json`, JSON.stringify(movies));

const KOBIS_API_KEY = "";
async function getWeeklyBoxOfficeList() {
  if(KOBIS_API_KEY.length == 0) {
    console.log("getWeeklyBoxOfficeList() KOBIS_API_KEY is empty!");
    return;
  }
  let maxStoredSize = 3;
  try {
    // delete all data in table ?
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
    const update_date = getLastWeek();
    console.log(`update_date ${update_date}`);

    function sleep(ms) {
      return new Promise((resolve) => {
        setTimeout(resolve, ms);
      });
    }
    
    const resultOfKobis = await axios({
      method: "GET",
      url: "http://www.kobis.or.kr/kobisopenapi/webservice/rest/boxoffice/searchWeeklyBoxOfficeList.json",
      params: {
        key: KOBIS_API_KEY,
        targetDt: update_date,
        weekGb: "0",
        itemPerPage: "5",
      },
    });
    console.log(resultOfKobis.data)
    const movies = resultOfKobis.data.boxOfficeResult.weeklyBoxOfficeList;
    const result = [];
    const year = new Date().getFullYear();

    for (const movie of movies) {
      const detailMovie = await axios({
        method: "GET",
        url: "",
        params: {
          key: KOBIS_API_KEY,
          movieCd: movie.movieCd
        }
      });
      

      await sleep(100); // sleep for 0.1s
      const movieName = movie.movieNm.replace(/\s+/g, "");
      // console.log(`movieName ${movieName}`);

      const resultOfNaver = await axios({
        method: "GET",
        url: "https://openapi.naver.com/v1/search/movie.json",
        params: {
          query: movieName,
          yearfrom: year - 3,
          yearto: year,
        },
        headers: {
          "X-Naver-Client-Id": "sZiKXpihvQDigy9xtYNC",
          "X-Naver-Client-Secret": "f4MMLYZbDt",
        },
      }); // naver

      if (resultOfNaver.data.items.length == 0) {
        console.log(`can't find ${movieName} from the result of NAVER API!`);
        continue;
      }

      for (const item of resultOfNaver.data.items) {
        let title = item.title.replace("<b>", "");
        title = title.replace("</b>", "");
        title = title.replace(/\s+/g, "");

        let found = null;
        if (title === movieName) {
          movies.forEach((elem) => {
            const movieNm = elem.movieNm.replace(/\s+/g, "");
            if (movieNm == title) {
              found = elem;
              return false;
            }
          });
          if (found != null) {
            if(result.length === maxStoredSize) {
              break;
            }
            result.push({
              update_date: update_date,
              movie_name: found.movieNm,
              weekly_rank: found.rank,
              naver_movie_url: item.link,
              poster_url: item.image,
            });
            break;
          } else {
            console.log(`can't found in movie list ${movieName}`);
            return;
          }
        } else {
          console.log("title and movieName is not same", title, movieName);
        }
      }
    }
    let query = `DELETE FROM ${weeklyMovieTable} WHERE weekly_rank < ${maxStoredSize + 1}`;
    let [rows, _] = await connection.query(query);
    console.log(`${query} ${rows.affectedRows} row(s) affected`);

    for (const data of result) {
      query =
      `REPLACE INTO ${weeklyMovieTable}(update_date, weekly_rank, movie_name, naver_movie_url, poster_url) VALUES(` +
      `"${data.update_date}", ${Number(data.weekly_rank)}, "${data.movie_name}", "${data.naver_movie_url}", "${data.poster_url}");`;
      [rows, _] = await connection.query(query);
      console.log(`${data.movie_name} inserted`);
    }
  } catch (error) {
    console.error(error);
  }
}
// setInterval(getWeeklyBoxOfficeList, 1000 * 60 * 60 * 24 * 7); // 1000*60*60*24*7
getWeeklyBoxOfficeList();