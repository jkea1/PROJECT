/**
 * @contributros #PioneerRedwood
 */

import fetch from "node-fetch";
import path from "path";
const __dirname = path.resolve();
import fs from "fs";


const APIKey = "";

const movieTitleList = [];
function readMovieList() {
  for(let i = 1; i < 2; ++i) { // KOBIS file
    const filename = `${__dirname}/movies/KOBIS/${i}.json`;
    try {
      const data = JSON.parse(fs.readFileSync(filename, {
        encoding: "utf-8",
        flag: "r"
      }));
  
      console.log(`The count of title from ${filename}: ${data.length}`);
      for(let movie of data) {
        // console.log(movie.name);
        movieTitleList.push(movie.name);
      }
    } catch (error) {
      console.error(error);
    }
  }
}
readMovieList();

async function searchMovie(query) {
  if(APIKey.length === 0) {
    console.error("API key is empty!!");
    exit();
  }

  const searchMovieList = [];
  const kmdbBaseUrl = 'http://api.koreafilm.or.kr/openapi-data2/wisenut/search_api/search_json2.jsp?collection=kmdb_new2';
  const startCount = 10;
  const listCount = 10;
  const createDts = 2015;
  const createDte = 2021;
  const sort = "RANK,1"; 

  const url = 
    `${kmdbBaseUrl}&ServiceKey=${APIKey}&listCount=${listCount}&startCount=${startCount}&detail=Y&query=${query}`;
    //  + `&createDts=${createDts}&createDte=${createDte}&sort=${sort}`;

  try {
    let res = await fetch(url);
    let data = await res.json();

    if(data.TotalCount != 0 && data.Data[0].Result.length > 0) {
      console.log(`"query=${query}" succeed! size: ${data.Data[0].Result.length}`);
      
      for(let movieInfo  of data.Data[0].Result) {
        // genre
        if(movieInfo.genre.includes("에로")) {
          // console.log(`This genre must be skipped .. ${movieInfo.title}`);
          continue;
        }

        let movie = {
          title: movieInfo.title.trim(),
          titleEng: movieInfo.titleEng,
          prodYear: movieInfo.prodYear,
          runtime: movieInfo.runtime,
          genre: movieInfo.genre,
          nation: movieInfo.nation,
          watchGrade: movieInfo.rating,
          posters: movieInfo.posters,
          kmdbUrl: movieInfo.kmdbUrl,
          actors: [],
          directors: [],
          plot: ""
        }

        // title
        movie.title = movie.title.replace("!HS ", "");
        movie.title = movie.title.replace(" !HE", "");
        movie.title = movie.title.replace("  ", " ");

        // actors
        let actorCount = 10;
        for(let actor of movieInfo.actors.actor) {
          if(--actorCount < 0) {
            break;
          }
          movie.actors.push({
            actorNm: actor.actorNm,
            actorEnNm: actor.actorEnNm
          });
        }

        // directors
        for(let director of movieInfo.directors.director) {
          movie.directors.push({
            directorNm: director.directorNm,
            directorEnNm: director.directorEnNm
          });
        }

        // plot
        for(let plot of movieInfo.plots.plot) {
          if(plot.plotLang.includes("한국어")) {
            movie.plot = plot.plotText;
            break;
          }
        }

        if(movie.genre.length === 0 
        || movie.plot.length === 0
        || movie.watchGrade.length === 0) {
          continue;
        }
        
        console.log(`add movie ${movie.title}`);
        searchMovieList.push(movie);
      }
    }
  } catch (error) {
    console.error(error);
  }

  return searchMovieList;
}

const data = [];
for(let title of movieTitleList) {
  const result = await searchMovie(title);
  if(result.length > 0) {
    // console.log(`push searched movie list (size:${result.length})`);
    data.push(...result);
  }
}
console.log(`Done ${data.length}`);
fs.writeFileSync(`${__dirname}/movies/KMDB/2022_07_30/${1}.json`, JSON.stringify(data));
