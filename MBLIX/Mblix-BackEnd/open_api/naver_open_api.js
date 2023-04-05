import fs from "fs";
import path from "path";
import axios from "axios";

const __dirname = path.resolve(); // need to resolve the __dirname from path
let movieList = [];
const result = [];
const dir = `${__dirname}/movies/KOBIS/`;

function sleep(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

async function searchMovie()  {
  try {
    // movie.json file from KOBIS
    movieList = JSON.parse(fs.readFileSync(dir + "total3.json"));
    console.log(`The length of movie list ${movieList.length}`);
    
    for(const movie of movieList) {
      await sleep(100); // sleep for 0.1s

      const clientId = "";
      const clientSecret = "";
      const res = await axios({
        method: "GET",
        url: `https://openapi.naver.com/v1/search/movie.json`,
        params: {
          query: movie.name,
          yearfrom: 2015,
          yearto: 2021
        },
        headers: {
          "X-Naver-Client-Id": clientId,
          "X-Naver-Client-Secret": clientSecret
        }
      });
      console.log(res.data);
    
      for(const movie of data.items) {
        let title = movie.title.replace("<b>", "");
        title = title.replace("</b>", "");
        
        if(title === movieName) {
          const add = {
            link: movie.link,
            image: movie.image
          };
          
          // find movie object
          const found = movieList.find(movie => movie.name === title);
          result.push(Object.assign(found, add));
          break;
        }
      }
    }
  } catch (error) {
    console.log(error);
    return ;
  }
}

// await searchMovie();
// fs.writeFileSync(dir + "merged.json", JSON.stringify(result));
// console.log(`File write done. ${dir}/merged.json length: ${result.length}`);

async function getWeeklyBoxOfficeList() {
  try {
    // delete all data in table ?
    function getLastWeek() {
      const today = new Date();
      const year = today.getFullYear().toString();
      let month = today.getMonth() + 1;
      let day = today.getDate() - 7;
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
    // console.log(today);
    const resultOfKobis = await axios({
      method: "GET",
      url: "http://www.kobis.or.kr/kobisopenapi/webservice/rest/boxoffice/searchWeeklyBoxOfficeList.json",
      params: {
        key: "",
        targetDt: update_date,
        weekGb: "0",
        itemPerPage: "5",
      },
    });
    
    const movies = resultOfKobis.data.boxOfficeResult.weeklyBoxOfficeList;
    const result = [];
    const year = new Date().getFullYear();

    for (const movie of movies) {
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
          "X-Naver-Client-Id": "",      // client id
          "X-Naver-Client-Secret": "",  // client secret
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
    // console.log(result);
    for (const data of result) {
      // INSERT ERROR!!
      let query =
        `REPLACE INTO ${weeklyMovieTable}(update_date, weekly_rank, movie_name, naver_movie_url, poster_url) VALUES(` +
        `"${data.update_date}", ${Number(data.weekly_rank)}, "${
          data.movie_name
        }", "${data.naver_movie_url}", "${data.naver_movie_url}");`;
      let [rows, _] = await connection.query(query);
      console.log(`${query} ${rows.length} row(s) inserted`);
    }
  } catch (error) {
    console.error(error);
  }
}
// setInterval(getWeeklyBoxOfficeList, 1000 * 60 * 60 * 24 * 7); // 1000*60*60*24*7
// getWeeklyBoxOfficeList();
