/**
 * @contributors #whaleman-99 #PioneerRedwood
 */

import axios from "axios";
import fs from "fs";
import path from "path";
const __dirname = path.resolve(); // need to resolve the __dirname from path

const KOBIS_API_KEY = "";

// search movie list from KOBIS
async function searchMovieList(curPage) {
  if (KOBIS_API_KEY.length === 0) {
    console.error("API key is empty!!");
    return null;
  }

  const res = await axios({
    method: "GET",
    url: `https://kobis.or.kr/kobisopenapi/webservice/rest/movie/searchMovieList.json`,
    params: {
      key: KOBIS_API_KEY,
      curPage: curPage,
      itemPerPage: 100, // 최대 100개
      openStartDt: 2018,
      openEndDt: 2021,
    },
  });

  console.log(res.data);
  if(res.data === undefined || res.data === null) {
    return null;
  }
  console.log(`searchMovieList has done! Total count of movie: ${res.data.movieListResult.totCnt}`);
  return res.data.movieListResult.movieList;
}

function sleep(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

async function searchMovieInfo(movies) {
  if (KOBIS_API_KEY.length === 0) {
    console.error("API key is empty!!");
    return null;
  }
  const movieInfos = [];
  try {
    const movieCodeList = movies.map((movie) => movie.movieCd);
    // 영화 코드 바탕으로 검색
    for (let movieCode of movieCodeList) {
      sleep(10);
      const res = await axios({
        method: "GET",
        url: "https://kobis.or.kr/kobisopenapi/webservice/rest/movie/searchMovieInfo.json",
        params: {
          key: KOBIS_API_KEY,
          movieCd: movieCode,
        },
      });
      
      if(res.data === undefined || res.data === null) {
        continue;
      }
      
      let movieInfo = res.data.movieInfoResult.movieInfo;

      let movie = {
        name: movieInfo.movieNm,
        englishName: movieInfo.movieNmEn,
        productionYear: movieInfo.prdtYear,
        showTime: movieInfo.showTm,
        movieCd: movieInfo.movieCd,
        genres: [],
        nations: [],
        watchGrade: "",
        directors: movieInfo.directors,
        actors: [],
      };

      let pushThis = true;
      for (let genre of movieInfo.genres) {
        if (genre.genreNm.includes("에로")) {
          pushThis = false;
          break;
        } else {
          movie.genres.push(genre.genreNm);
        }
      }

      if (movieInfo.audits.length > 0) {
        movie.watchGrade = movieInfo.audits[0].watchGradeNm;
        if (movie.watchGrade.includes("청소년관람불가")) {
          pushThis = false;
        }
      }

      if (!pushThis) {
        continue;
      }

      let actorCount = 10;
      for (let actor of movieInfo.actors) {
        if (actorCount-- < 0) {
          break;
        } else {
          movie.actors.push({
            name: actor.peopleNm,
            englishName: actor.peopleNmEn,
          });
        }
      }

      for (let nation of movieInfo.nations) {
        movie.nations.push(nation.nationNm);
      }

      console.log(`${movie.name} saved!`);
      movieInfos.push(movie);
    }
  } catch (err) {
    console.error(err);
    return null;
  }

  console.log(`searchMovieInfo has done! count of result ${movieInfos.length}`);
  if(movieInfos.length === 0) return null; else return movieInfos;
}

async function requestNaverMovie(movieList) {
  const result = [];
  try {
    const clientId = "";
    const clientSecret = "";
    if (clientId.length == 0 || clientSecret.length == 0) {
      console.log("NAVER Movie clientId or clientSecret is empty!");
      return null;
    }

    for (let i = 0; i < movieList.length; ++i) {
      const movie = movieList[i];
      if(movie === undefined || movie === null) {
        continue;
      }
      const movieName = movie.name;
      await sleep(200); // sleep for 0.2s

      const res = await axios({
        method: "GET",
        url: `https://openapi.naver.com/v1/search/movie.json`,
        params: {
          query: movie.name,
          yearfrom: 2015,
          yearto: 2021,
        },
        headers: {
          "X-Naver-Client-Id": clientId,
          "X-Naver-Client-Secret": clientSecret,
        },
      });
      // console.log(`Naver Movie API result: res.data: ${res.data}`);
      if(res.data == undefined || res.data == null) {
        console.log(`Naver Movie API res.data is undefined or null`);
        continue;
      }
      const items = res.data.items;

      for (const movie of items) {
        let title = movie.title.replace("<b>", "");
        title = title.replace("</b>", "");

        if (title == movieName) {
          const add = {
            link: movie.link,
            image: movie.image,
          };

          // find movie object
          const found = movieList.find((elem) => elem.name === title);
          console.log(`KOBIS + Naver Movie API success to merge! title is ${title}`);
          result.push(Object.assign(found, add));
          break;
        }
      }
    }
    return result;
  } catch (error) {
    console.log(error);
    return null;
  }
}

try {
  // #1: 1 - 23 #2: 23 - 46 #3: 46 - 76
  let start = 46;
  const end = 76; // 2022-10-03 total movie count 7584, default is 76
  const movieList = [];

  for (let page = start; page < end; ++page) {
    console.log(`Search movie page: ${page} / ${end - 1}`);
    
    const tempList = await searchMovieList(page);
    if(tempList == null) {
      console.log(`searchMovieList failed!`);
      break;
    }

    const movieInfo = await searchMovieInfo(tempList);
    if(movieInfo == null) {
      console.log(`searchMovieInfo failed!`);
      break;
    }
    movieList.push(...movieInfo);
  }
  fs.writeFileSync(`${__dirname}/open_api/movies/20221008_KOBIS3.json`, JSON.stringify(movieList));
  
  if(movieList.length === 0) {
    console.log(`movieList is empty! exit`);
  } else {
    // 네이버 영화 가져오기
    const mergedList = await requestNaverMovie(movieList);
    
    if(mergedList != null) {
      // 파일에 JSON 형식으로 쓰기
      console.log(`KOBIS + Naver Movie API merged! size: ${mergedList.length}`);
      fs.writeFileSync(`${__dirname}/open_api/movies/20221008_merged3.json`, JSON.stringify(mergedList));
    } else {
      console.log(`Naver Movie API failed!`);
    }
  }
} catch (err) {
  console.error(err);
}
