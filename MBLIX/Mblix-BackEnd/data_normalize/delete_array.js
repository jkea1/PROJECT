/**
 * @contributros #PioneerRedwood
 */

import path from "path";
const __dirname = path.resolve();
import fs from "fs";
 
function ReadMergedJsonFile() {
  let movies = [];
  const result = [];
  
  function readMovieList() {
    for(let i = 1; i < 2; ++i) {
      const filename = `${__dirname}/../movies/KOBIS/merged.json`;
      try {
        movies = JSON.parse(fs.readFileSync(filename));
        console.log(`The count of title from ${filename}: ${movies.length}`);
      } catch (error) {
        console.error(error);
      }
    }
  }
  readMovieList();
  
  for(let movie of movies) {
    /**
     * single properties
     *  name, englishName, productionYear, showTime, watchGrade, link, image
     * array properties
     *  genres, nations, directors, actors
     */
    let changed = {
      name: movie.name,
      englishName: movie.englishName,
      prodYear: movie.productionYear,
      showTime: movie.showTime,
      watchGrade: movie.watchGrade,
      naverURL: movie.link,
      imageURL: movie.image,
      genre: movie.genres[0],
      nation: movie.nations[0],
      director: "",
      actors: []
    };
  
    if(movie.directors.length > 0 
      && movie.directors[0] !== undefined
      && movie.directors[0].peopleNm !== undefined) {
      changed.director = movie.directors[0].peopleNm;
    }
  
    const actors = new Set();
    for(let actor of movie.actors) {
      actors.add(actor.name);
    }
    changed.actors = [...actors];
  
    result.push(changed);
  }

  return result;
}
