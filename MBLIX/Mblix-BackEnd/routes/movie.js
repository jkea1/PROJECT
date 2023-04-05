import express from "express";
const router = express.Router();
import mysql from "mysql2/promise";
import axios from "axios";

const connection = await mysql.createConnection({
  host: "127.0.0.1", // localhost
  user: "redwood",
  password: "1234",
  database: "mblix",
});

function check(target) {
  return target !== undefined && target !== null;
}

const movieTable = "movie",
  mbtiTable = "movie_mbti",
  userTable = "user",
  weeklyMovieTable = "weekly_movie";

router.get("/", function (req, res, next) {
  res.send("Movie basic route, not supporting");
});

router.get("/list", async function (req, res, next) {
  let type = "";
  let count = 0;
  try {
    if (!check(req.query.type)) {
      res.status(422).send("Missing param: 'type'");
      return;
    }
    if (!check(req.query.count)) {
      res.status(422).send("Missing param: 'count'");
      return;
    }
    type = req.query.type;
    count = req.query.count;
  } catch (err) {
    res.status(500).send(`Internal server error ${err}`);
    return;
  }

  if (type === "random") {
    const query =
      `SELECT id, name, poster_url FROM ${movieTable}` +
      ` ORDER BY RAND() LIMIT ${count};`;
    let [rows, _] = await connection.query(query);
    console.log(
      `Select ${count} Movies ${type} ${rows.length} row(s) returned.`
    );
    res.json(rows);
  } else if (type === "normal") {
    if (!check(req.query.mbti)) {
      res.status(422).send("Missing param: 'mbti'");
      return;
    }
    const mbti = req.query.mbti;
    const query =
      `SELECT *, movies.${mbti} FROM ${movieTable}, ` +
      `(SELECT movie_id, ${mbti} FROM ${mbtiTable} ORDER BY ${mbti} DESC LIMIT ${count}) as movies ` +
      `WHERE id = movies.movie_id;`;
    let [rows, _] = await connection.query(query);
    console.log(
      `Select ${mbti} prefers Movies ${type} ${rows.length} row(s) returned.`
    );
    res.json(rows);
  } else {
    res.send("Not implemented yet");
  }
});

router.get("/search/name/:name", async function (req, res, next) {
  let name = "";
  try {
    if (!check(req.params.name)) {
      res.status(422).send("Missing param: 'name'");
      return;
    }
    name = req.params.name;
    let [rows, _] = await connection.query(
      `SELECT DISTINCT * FROM ${movieTable} WHERE name LIKE "%${name}%" OR actors LIKE "%${name}%";`
    );
    console.log(`Search Movie ${rows.length} row(s) returned.`);
    res.json(rows);
  } catch (err) {
    res.status(500).send(`Internal server error! ${err}`);
    return;
  }
});

router.get("/search/id/:id", async function (req, res, next) {
  let id = -1;
  try {
    if (!check(req.params.id)) {
      res.status(422).send("Invalid request: can't read 'id'");
      return;
    }
    id = req.params.id;
    let query = `SELECT * FROM ${movieTable} WHERE id=${id}`;
    let [rows, _] = await connection.query(query);
    // console.log(`${query} ${rows.length} row(s) returned`);

    // 해당 영화를 좋아하는 MBTI 상위 3개 계산해서 건네주기
    query =
      `SELECT ENFJ, ENFP, ENTJ, ENTP, ESFJ, ESFP, ESTJ, ESTP, ` +
      `INFJ, INFP, INTJ, INTP, ISFJ, ISFP, ISTJ, ISTP ` +
      `FROM ${mbtiTable} WHERE movie_id=${id}`;
    [rows, _] = await connection.query(query);

    const row = rows[0];
    if (row != null || row != undefined) {
      const array = Object.entries(row)
        .sort(([, a], [, b]) => b - a)
        .reduce((r, [k, v]) => ({ ...r, [k]: v }), {});

      const mbtis = [];
      for (let i = 0; i < 3; ++i) {
        mbtis.push(Object.keys(array)[i]);
      }

      // console.log(mbtis);
      // data.mbti_leaderboard = mbtis;
      res.json(mbtis);
    } else {
      res.status(500).send("Internal server error! data doesn't exist.");
    }
    return;
  } catch (err) {
    res.status(500).send(`Internal server error! ${err}`);
    return;
  }
});

router.post("/like", async function (req, res) {
  // user id, movie id
  console.log(req.url, req.params, req.body, req.query);

  let user_id = null,
    movie_id = null;
  if (!check(req.query.user_id)) {
    res.status(422).send("Missing param: user_id");
    return;
  }
  if (!check(req.query.movie_id)) {
    res.status(422).send("Missing param: movie_id");
    return;
  }
  user_id = req.query.user_id;
  movie_id = req.query.movie_id;

  let query = `SELECT mbti, liked_movie_list FROM ${userTable} WHERE id=${user_id}`;
  let [rows, _] = await connection.query(query);
  if (rows.length != 1) {
    res.status(422).send(`Can't find id=${user_id} user`);
    return;
  }
  console.log(
    `${query} ${rows.length} row(s) returned  row#0: ${rows[0].liked_movie_list}`
  );
  const mbti = rows[0].mbti;

  try {
    let movies = rows[0].liked_movie_list;
    for (const id of movies) {
      if (id == movie_id) {
        res.status(409).send(`You already liked this movie!`);
        return;
      }
    }
    movies.push(movie_id);
    movies.sort();

    let array = "";
    for (let i = 0; i < movies.length; ++i) {
      array += movies[i];
      if (i + 1 != movies.length) {
        array += ",";
      }
    }
    query = `UPDATE ${userTable} SET liked_movie_list = JSON_ARRAY(${array}) WHERE id=${user_id}`;
    [rows, _] = await connection.query(query);
    console.log(`${query} ${rows.affectedRows} row(s) affected`);

    if (rows.affectedRows != 1) {
      res.status(500).send(`UPDATE liked_movie_list failed!`);
    } else {
      query = `SELECT liked_movie_list FROM ${userTable} WHERE id=${user_id}`;
      [rows, _] = await connection.query(query);
      console.log(`${query} ${rows.length} row(s) returned`);

      if (rows.length == 1) {
        movies = rows[0].liked_movie_list.sort();
        let where = "WHERE ";
        for (let i = 0; i < movies.length; ++i) {
          where += ` id = ${movies[i]} `;
          if (i + 1 != movies.length) {
            where += "OR";
          }
        }
        query = `SELECT * FROM ${movieTable} ${where}`;
        [rows, _] = await connection.query(query);
        console.log(`${query} ${rows.length} row(s) returned}`);

        if (rows.length >= 0) {
          res.json(rows);
        } else {
          res.status(500).send(`SELECT MOVIE INFO failed!`);
        }
      } else {
        res.status(500).send(`SELECT USER INFO failed!`);
      }

      query = `UPDATE ${mbtiTable} SET ${mbti} = ${mbti} + 1 WHERE movie_id = ${movie_id}`;
      [rows, _] = await connection.query(query);
      console.log(`${query} ${rows.affectedRows} row(s) affected`);
    }
  } catch (error) {
    console.error(error);
    res.status(500).send(`Internal server error: ${error}`);
  }
});

router.post("/unlike", async function (req, res) {
  // user id, movie id
  console.log(req.url, req.params, req.body, req.query);

  let user_id = null,
    movie_id = null;
  if (!check(req.query.user_id)) {
    res.status(422).send("Missing param: user_id");
    return;
  }
  if (!check(req.query.movie_id)) {
    res.status(422).send("Missing param: movie_id");
    return;
  }
  user_id = Number(req.query.user_id);
  movie_id = Number(req.query.movie_id);

  let query = `SELECT MBTI, liked_movie_list FROM ${userTable} WHERE id=${user_id}`;
  let [rows, _] = await connection.query(query);
  if (rows.length != 1) {
    res.status(422).send(`Can't find id=${user_id} user`);
    return;
  }
  console.log(
    `${query} ${rows.length} row(s) returned  row#0: ${rows[0].liked_movie_list}`
  );
  const mbti = rows[0].mbti;

  try {
    let movies = rows[0].liked_movie_list.sort();
    console.log(movies);
    const idx = movies.indexOf(movie_id);
    if (idx > -1) {
      movies.splice(idx, 1);
    } else {
      res.status(409).send("You don't like this movie");
      return;
    }

    let array = "";
    for (let i = 1; i < movies.length; ++i) {
      array += movies[i];
      if (i + 1 != movies.length) {
        array += ",";
      }
    }
    query = `UPDATE ${userTable} SET liked_movie_list = JSON_ARRAY(${array}) WHERE id=${user_id}`;
    [rows, _] = await connection.query(query);
    console.log(`${query} ${rows.affectedRows} row(s) affected`);

    if (rows.affectedRows != 1) {
      res.status(500).send(`UPDATE liked_movie_list failed!`);
    } else {
      query = `SELECT liked_movie_list FROM ${userTable} WHERE id=${user_id}`;
      [rows, _] = await connection.query(query);
      console.log(
        `${query} ${rows.length} row(s) returned \nrow#0: ${JSON.stringify(
          rows[0]
        )}`
      );

      if (rows.length == 1) {
        movies = rows[0].liked_movie_list.sort();
        let where = "WHERE ";
        for (let i = 0; i < movies.length; ++i) {
          where += ` id = ${movies[i]} `;
          if (i + 1 != movies.length) {
            where += "OR";
          }
        }
        query = `SELECT * FROM ${movieTable} ${where}`;
        [rows, _] = await connection.query(query);
        console.log(`${query} ${rows.length} row(s) returned`);
        if (rows.length >= 0) {
          res.json(rows);
        } else {
          res.status(500).send(`SELECT MOVIE INFO failed!`);
        }
      } else {
        res.status(500).send(`SELECT USER INFO failed!`);
      }

      query = `UPDATE ${mbtiTable} SET ${mbti} = ${mbti} - 1 WHERE movie_id = ${movie_id}`;
      [rows, _] = await connection.query(query);
      console.log(`${query} ${rows.affectedRows} row(s) affected`);
    }
  } catch (error) {
    console.error(error);
    res.status(500).send(`Internal server error: ${error}`);
  }
});

router.get("/weekly", async function (req, res) {
  try {
    let query = `SELECT * FROM ${weeklyMovieTable}`;
    let [rows, _] = await connection.query(query);
    if(rows.length > 0) {
      console.log(`${query} ${rows.length} row(s) returned`);
      res.json(rows);
    } else {
      console.log(`Empty table!`);
      res.status(500).send(`Internal server error! table is empty..`);
    }
  } catch (error) {
    console.log(error);
  }
});

//////////////////////////////////////////////////////////////// update weekly box office
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
        itemPerPage: 10,
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

updateWeeklyBoxOffice(); // update at the backend starting
setInterval(updateWeeklyBoxOffice, 1000 * 10); // for test 30 seconds
// setInterval(updateWeeklyBoxOffice, 1000 * 60 * 60 * 24 * 7); // update every week

export default router;
