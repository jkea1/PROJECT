/**
 * @contributros #PioneerRedwood
 */

import path from "path";
const __dirname = path.resolve();
import fs from "fs";
import mysql from "mysql2/promise";
import { exit } from "process";

const movieTable = "movie",
  userTable = "user",
  mbtiTable = "movie_mbti";

function sleep(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

function readMovieData() {
  let movies = [];
  const result = [];

  function readMovieList() {
    for (let i = 1; i < 2; ++i) {
      // const filename = `${__dirname}\\movies\\KOBIS\\merged.json`;
      const filename = `${__dirname}/../open_api/movies/merged.json`; // for mac book
      // const filename = `${__dirname}/open_api/movies/merged.json`;
      try {
        movies = JSON.parse(fs.readFileSync(filename));
        console.log(`The count of title from ${filename}: ${movies.length}`);
      } catch (error) {
        console.error(error);
      }
    }
  }
  readMovieList();

  for (let movie of movies) {
    /**
     * single properties
     *  name, englishName, productionYear, showTime, watchGrade, link, image
     * array properties
     *  genres, nations, directors, actors
     */
    let changed = {
      name: movie.name,
      english_name: movie.englishName,
      prod_year: movie.productionYear,
      show_time: movie.showTime,
      watch_grade: movie.watchGrade,
      genre: movie.genres[0],
      nation: movie.nations[0],
      director: "",
      actors: [],
      naver_movie_url: movie.link,
      poster_url: movie.image,
    };

    if (
      movie.directors.length > 0 &&
      movie.directors[0] !== undefined &&
      movie.directors[0].peopleNm !== undefined
    ) {
      changed.director = movie.directors[0].peopleNm;
    }

    const actors = new Set();
    for (let actor of movie.actors) {
      actors.add(actor.name);
    }
    changed.actors = [...actors];

    result.push(changed);
  }

  return result;
}

const data = readMovieData();
if(data.length == 0) {
  console.log(`Can't open movie data file!`);
  exit();
} else {
  console.log(`Data length: ${data.length}`);
}
let connection = null;
try {
  connection = await mysql.createConnection({
    host: "127.0.0.1",
    user: "redwood",
    password: "1234",
    database: "mblix",
  });
} catch (error) {
  console.log(error);
  exit();
}

async function dropTables() {
  try {
    // drop movie
    let [rows, _] = await connection.query(`DELETE FROM ${movieTable}`);
    console.log(
      `DELETE TABLE ${movieTable} .. ${rows.affectedRows} row(s) affected.`
    );

    // drop user
    [rows, _] = await connection.query(`DELETE FROM ${userTable}`);
    console.log(
      `DELETE TABLE ${userTable} .. ${rows.affectedRows} row(s) affected.`
    );

    // drop movie_mbti
    [rows, _] = await connection.query(`DELETE FROM ${mbtiTable}`);
    console.log(
      `DELETE TABLE ${mbtiTable} .. ${rows.affectedRows} row(s) affected.`
    );
  } catch (error) {
    console.error(error);
    return;
  }
}

async function createTables() {
  try {
    let query = "";
    // create movie
    query = 
      `CREATE TABLE ${movieTable}(id INTEGER AUTO_INCREMENT NOT NULL PRIMARY KEY, name VARCHAR(128) NOT NULL, english_name VARCHAR(128) NOT NULL, prod_year VARCHAR(16) NOT NULL, show_time SMALLINT NOT NULL, watch_grade VARCHAR(16) NOT NULL, genre VARCHAR(32) NOT NULL, nation VARCHAR(32) NOT NULL, director VARCHAR(64) NOT NULL, naver_movie_url VARCHAR(256) NOT NULL, poster_url VARCHAR(256) NOT NULL, actors JSON NOT NULL);`;
    let [rows, _] = await connection.query(query);

    // create user
    query =
      `CREATE TABLE ${userTable}(id INTEGER AUTO_INCREMENT NOT NULL PRIMARY KEY, nickname VARCHAR(256) NOT NULL, mail VARCHAR(256), auth_type VARCHAR(8) NOT NULL, profile_id VARCHAR(8) NOT NULL, mbti VARCHAR(8) NOT NULL, liked_movie_list JSON NOT NULL);`;
    [rows, _] = await connection.query(query);
    
    // create movie_mbti
    query = 
      `CREATE TABLE ${mbtiTable}(movie_id INTEGER NOT NULL PRIMARY KEY, movie_name VARCHAR(128) NOT NULL, ENFJ MEDIUMINT UNSIGNED, ENFP MEDIUMINT UNSIGNED, ENTJ MEDIUMINT UNSIGNED, ENTP MEDIUMINT UNSIGNED, ESFJ MEDIUMINT UNSIGNED, ESFP MEDIUMINT UNSIGNED, ESTJ MEDIUMINT UNSIGNED, ESTP MEDIUMINT UNSIGNED, INFJ MEDIUMINT UNSIGNED, INFP MEDIUMINT UNSIGNED, INTJ MEDIUMINT UNSIGNED, INTP MEDIUMINT UNSIGNED, ISFJ MEDIUMINT UNSIGNED, ISFP MEDIUMINT UNSIGNED, ISTJ MEDIUMINT UNSIGNED, ISTP MEDIUMINT UNSIGNED);`;
    [rows, _] = await connection.query(query);
  } catch (error) {
    console.error(error);
    return;
  }
}

async function insertMovieData() {
  try {
    let query = `DELETE FROM ${movieTable};`;
    let [rows, _] = await connection.query(query);
    console.log(`${query} result: ${rows.affectedRows}`);

    for (let i = 1; i < data.length; ++i) {
      const movie = data[i];
      sleep(50);

      query = `SELECT * FROM ${movieTable} WHERE name LIKE "%${movie.name}%"`;
      [rows, _] = await connection.query(query);
      if (rows.length > 0) {
        console.log("already inserted movie!");
      }

      let actors = JSON.stringify(movie.actors);
      actors = actors.replace("[", "").replace("]", "");

      query = 
        `INSERT IGNORE INTO ${movieTable}(id, name, english_name, prod_year, show_time, watch_grade, genre, nation, director, naver_movie_url, poster_url, actors) VALUES` +
        `(${i}, "${movie.name}", "${movie.english_name}", "${movie.prod_year}","${movie.show_time}", "${movie.watch_grade}", "${movie.genre}", ` +
        `"${movie.nation}", "${movie.director}", "${movie.naver_movie_url}", "${movie.poster_url}", JSON_ARRAY(${actors}) );`;
      [rows, _] = await connection.query(query);

      if (rows.length < 1) {
        console.log("Failed insert movie");
      } else {
        console.log(`INSERT Movie ${movie.name}`);
      }
    }
  } catch (err) {
    console.error(err);
  }
}

async function insertMovieMBTI() {
  try {
    let query = `DELETE FROM ${mbtiTable};`;
    let [rows, _] = await connection.query(query);
    console.log(`${query} result: ${rows}`);

    console.log(`INSERT INTO ${mbtiTable}`);

    // select movie table
    [rows, _] = await connection.query(
      `SELECT id, name FROM ${movieTable}`
    );
    if (rows.length === 0) {
      console.log(`Movie Table Is Empty! return`);
      return;
    }
    function getRandom(max, min) {
      // return Math.floor(Math.random() * (max - min)) + min;
      return Math.floor(Math.random() * (50 - 10)) + 10;
    }

    // insert random values
    for (const movie of rows) {
      console.log(movie);
      query =
        `INSERT IGNORE INTO ${mbtiTable}(movie_id, movie_name, ENFJ, ENFP, ENTJ, ENTP, ESFJ, ESFP, ESTJ, ESTP, INFJ, INFP, INTJ, INTP, ISFJ, ISFP, ISTJ, ISTP) ` +
        `VALUES(${movie.id}, '${movie.name}',` +
        `${getRandom()}, ${getRandom()}, ${getRandom()}, ${getRandom()}, ` +
        `${getRandom()}, ${getRandom()}, ${getRandom()}, ${getRandom()}, ` +
        `${getRandom()}, ${getRandom()}, ${getRandom()}, ${getRandom()}, ` +
        `${getRandom()}, ${getRandom()}, ${getRandom()}, ${getRandom()})`;
      [rows, _] = await connection.query(query);
      console.log(
        `${rows.affectedRows} rows affected. insertId: ${rows.insertId}`
      );
    }
  } catch (error) {
    console.log(error);
    return;
  }
}

insertMovieData().then(()=>{
  insertMovieMBTI();
});
