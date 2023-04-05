import express from "express";
import axios from "axios";
const router = express.Router();
import mysql from "mysql2/promise";
// body-parser examples from https://github.com/expressjs/body-parser
import bodyParser from "body-parser";
// cors examples from https://github.com/expressjs/cors
import cors from "cors";

class QueryResult {
  constructor(data, error) {
    this.data = data;
    this.error = error;
  }

  success() {
    return this.data !== null && this.error === null;
  }
}

const connection = await mysql.createConnection({
  host: "127.0.0.1", // localhost
  user: "redwood",
  password: "1234",
  database: "mblix",
});

const userTable = "user", movieTable = "movie", mbtiTable = "movie_mbti";

function check(target) {
  return target !== undefined && target !== null;
}

/**
 * DB에 저장된 계정 정보를 가져옵니다.
 * @param {auth_type, nickname} account 
 * @returns 쿼리 요청 결과 QueryResult
 */
async function selectAccount(account) {
  const result = new QueryResult(null, null);
  const query = `SELECT * FROM ${userTable} where auth_type='${account.auth_type}' AND nickname='${account.nickname}'`;
  try {
    let [rows, _] = await connection.query(query);
    console.log(`${query} success! ${rows.length} rows returned`);
    result.data = rows;
  } catch (error) {
    console.log(error);
    result.error = error;
  }
  return result;
}

/**
 * DB에 계정을 추가합니다. 
 * @param { nickname, email(optional), auth_type, profile_id, mbti, liked_movie_list } account 
 * @returns DB에 들어간 결과; QueryResult 인스턴스
 */
async function insertAccount(account) {
  console.log("insertAccount", account);
  const result = new QueryResult(null, null);
  let query = "";
  if (check(account.email)) {
    query =
      `INSERT IGNORE INTO ${userTable}(nickname, mail, auth_type, profile_id, mbti, liked_movie_list) ` +
      `VALUES("${account.nickname}", "${account.email}", "${account.auth_type}", "${account.profile_id}", "${account.mbti}", "${account.liked_movie_list}");`;
  } else {
    query =
      `INSERT IGNORE INTO ${userTable}(nickname, auth_type, profile_id, mbti, liked_movie_list) ` +
      `VALUES("${account.nickname}", "${account.auth_type}", "${account.profile_id}", "${account.mbti}", "${account.liked_movie_list}");`;
  }
  try {
    let [rows, _] = await connection.query(query);
    console.log(`${query} success! affected ${rows.length} rows`);
    result.data = rows;
  } catch (error) {
    console.log(error);
    result.error = error;
  }
  return result;
}

/**
 * 카카오 REST API를 사용해 카카오 계정 정보를 가져옵니다.
 * auth_type: "kakao"로 고정
 * access_token: 프론트엔드로부터 수신한 액세스 토큰
 * @param {auth_type, access_token} data 
 * @returns { email(optional), nickname, auth_type }
 */
async function getKakaoAccount(data) {
  // console.log("getKakaoUserInfo " + JSON.stringify(data));

  try {
    const response = await axios({
      method: "GET",
      url: "https://kapi.kakao.com/v2/user/me",
      headers: {
        Authorization: `Bearer ${data.access_token}`,
        "Content-auth_type": "application/x-www-form-urlencoded;charset=utf-8",
      },
      params: {
        property_keys: ["kakao_account.email", "kakao_account.nickname"],
      },
    });
    
    // console.log("getKakaoUserInfo ", response.status);

    const kakao_account = response.data["kakao_account"];
    return {
      email: kakao_account.email,
      nickname: kakao_account.profile.nickname,
      auth_type: data.auth_type
    };
  } catch(err) {
    // console.log(err);
    return {
      error: err
    };
  }
}

/**
 * 좋아요한 영화 리스트에 name, poster_url을 추가해 반환
 */
async function getLikedMovieList(userData) {
  const ids = userData.liked_movie_list;
  if(ids.length > 0) {
    let where = "WHERE";
    for (let i = 0; i < ids.length; ++i) {
      where += ` id = ${ids[i]} `;
      if (i + 1 != ids.length) where += "OR";
    }

    const query = `SELECT id, name, poster_url FROM ${movieTable} ${where}`;
    const [rows, _] = await connection.query(query);
    if(rows.length > 0) {
      userData.liked_movie_list = [];
      for(let i = 0; i < rows.length; ++i) {
        const movie = {
          id: rows[i].id,
          name: rows[i].name,
          poster_url: rows[i].poster_url
        };
        userData.liked_movie_list.push(movie);
      }
      // Object.assign(userData, )
      console.log(userData);
    }
  }
}

/**
 * DB에 저장된 카카오 계정 정보를 가져옵니다.
 * 성공 시 success, 실패 시 fail 콜백을 수행합니다.
 * @param {auth_type, access_token} data 
 * @param {callback} success 
 * @param {callback} fail 
 */
async function kakaoSignIn(data, success, fail) {
  console.log("kakaoSignIn " + JSON.stringify(data));

  const account = await getKakaoAccount(data);
  if(check(account.error)) {
    fail(account.error);
    return;
  }
  let result = await selectAccount(account);
  if (!result.success()) {
    fail(result.error);
    return;
  }
  console.log(result.data);
  
  // 좋아요한 영화 리스트 id, name, poster_url로 가져오기
  if (result.data.length == 1) {
    const userData = result.data[0];
    await getLikedMovieList(userData);
    success(userData);
  } else if(result.data.length == 0) {
    fail("You need to sign up first");
  } else {
    fail("It must be a single row!");
  }
}

/**
 * 카카오 계정으로 회원가입합니다.
 * 카카오 계정 정보 요청 후 DB에 데이터가 없다면 삽입하고 다시 저장된 계정 정보를 가져옵니다.
 * 성공 시 success, 실패 시 fail 콜백을 수행합니다.
 * @param {auth_type, access_token} data 
 * @param {callback} success 
 * @param {callback} fail 
 */
async function kakaoSignUp(data, success, fail) {
  console.log("kakaoSignUp " + JSON.stringify(data));
  
  const account = await getKakaoAccount(data); // it has email, nickname
  let result = await selectAccount(account);
  if (!result.success()) {
    fail(result.error);
    return;
  }

  if (result.data.length > 0) {
    fail("The account already exists!"); // already exists
  } else {
    data["email"] = account.email;
    data["nickname"] = account.nickname;

    result = await insertAccount(data);
    if (!result.success()) {
      fail(result.error);
      return;
    }

    result = await selectAccount(account);
    if (!result.success()) {
      fail(result.error);
      return;
    }

    const userData = result.data[0];
    await getLikedMovieList(userData);
    success(userData);
  }
}

router.post("/", async function(req, res) {
  console.log(req.url, req.body);

  if (!check(req.body.auth_type)) {
    res.status(422).send(`Missing param: 'auth_type'`);
    return;
  }
  if (!check(req.body.access_token)) {
    res.status(422).send(`Missing param: 'access_token'`);
    return;
  }
  const data = {
    auth_type: req.body.auth_type.toLowerCase(),
    access_token: req.body.access_token
  };
  const account = await getKakaoAccount(data);
  if(check(account.error)) {
    const response = account.error.response;
    console.log(response.data);
    res.status(response.status).send(`Internal server error ${response.statusText} data: ${JSON.stringify(response.data)}`);
    return;
  }
  let result = await selectAccount(account);
  if (!result.success()) {
    res.status(500).send(`Internal server error ${result.error}`);
    return;
  }
  console.log(result.data);

  if (result.data.length == 1) {
    res.status(200).send({
      next: "signin",
      data: result.data[0]
    });
  } else if(result.data.length == 0) {
    res.status(200).send({
      next: "signup",
      data: account
    });
  }
});

router.get("/:id", async function(req, res) {
  console.log(req.url, req.body, req.query, req.params);
  if(!check(req.params.id)) {
    res.status(422).send("Missing param: id");
    return;
  }
  const id = req.params.id;
  let query = `SELECT * FROM ${userTable} WHERE id=${id}`;
  let [rows, _] = await connection.query(query);
  console.log(`${query} ${rows.length} row(s) returned`);

  if(rows.length == 1) {
    res.status(200).json(rows[0]);
  } else {
    res.status(400).send("Internal server error! (duplicated or not found)");
  }
});

router.post("/signup", async function (req, res) {
  // req.body. auth_type access_token mbti profile_id liked_movie_list
  console.log(req.url, req.body);

  if (!check(req.body.auth_type)) {
    res.status(422).send(`Missing param: 'auth_type'`);
    return;
  }
  if (!check(req.body.access_token)) {
    res.status(422).send(`Missing param: 'access_token'`);
    return;
  }
  if (!check(req.body.mbti)) {
    res.status(422).send(`Missing param: 'mbti'`);
    return;
  }
  if (!check(req.body.profile_id)) {
    res.status(422).send(`Missing param: 'profile_id'`);
    return;
  }
  await kakaoSignUp(
    {
      auth_type: req.body.auth_type.toLowerCase(),
      access_token: req.body.access_token,
      mbti: req.body.mbti,
      profile_id: req.body.profile_id,
      liked_movie_list: req.body.liked_movie_list,
    },
    (result) => {
      res.status(200).send(result);
    },
    (msg) => {
      res.status(500).send(`Internal server error! ${msg}`);
    }
  );
});

router.post("/signin", async function (req, res) {
  console.log(req.url, req.body);

  if (!check(req.body.auth_type)) {
    res.status(422).send(`Missing param: 'auth_type'`);
    return;
  }
  if (!check(req.body.access_token)) {
    res.status(422).send(`Missing param: 'access_token'`);
    return;
  }

  await kakaoSignIn(
    {
      auth_type: req.body.auth_type.toLowerCase(),
      access_token: req.body.access_token,
    },
    (result) => {
      res.status(200).send(result);
    },
    (msg) => {
      res.status(500).send(`Internal server error! ${msg}`);
    }
  );
});

router.post("/signout", bodyParser.json(), function (req, res) {
  res.send(`signout is not implemented yet`);
});

router.post("/disconnect", async function(req, res) {
  res.send(`disconnect is not implemented yet`);
});

router.post("/edit-user", async function(req, res) {
  // user id, name, new_mbti, new_profile_id(url)
  let user_id = 0, new_mbti = "", new_profile_id;
  if(!check(req.body.user_id)) {
    res.status(422).send("Missing params: user_id");
    return;
  }
  if(!check(req.body.new_mbti)) {
    res.status(422).send("Missing params: new_mbti");
    return;
  }
  if(!check(req.body.new_profile_id)) {
    res.status(422).send("Missing params: new_profile_id");
    return;
  }

  user_id = Number(req.body.user_id);
  new_mbti = req.body.new_mbti.toUpperCase();
  new_profile_id = req.body.new_profile_id;

  try {
    let query = `SELECT mbti, profile_id, liked_movie_list FROM ${userTable} WHERE id=${user_id}`;
    let [rows, _]= await connection.query(query);
    if(rows.length !== 1) {
      res.status(400).send(`${user_id} is not found`);
    }
    else {
      const mbti = rows[0].mbti;
      const profile_id = rows[0].profile_id;
      let querySet = [];

      if(mbti === new_mbti && profile_id === new_profile_id) { 
        res.status(400).send(`there is no change`);
        return;
      }
      
      if(mbti !== new_mbti) { 
        querySet.push(`mbti = '${new_mbti}', liked_movie_list = JSON_ARRAY(${[]})`);
        // 영화 MBTI -1
        const liked_movie_list = rows[0].liked_movie_list;
        for(const movieId of liked_movie_list) {
          // console.log(movieId);
          query = `UPDATE ${mbtiTable} SET ${mbti} = ${mbti} - 1 WHERE movie_id = ${movieId};`;
          [rows, _] = await connection.query(query);
          console.log(`${query} succeed!`);          
        }
      }

      if(profile_id !== new_profile_id) {
        querySet.push(`profile_id = '${new_profile_id}'`);
      }

      query = `update ${userTable} SET ${querySet.join(', ')} WHERE id = ${user_id}`;
      [rows, _] = await connection.query(query);
      console.log(`${query}`);
      
      query = `SELECT * FROM ${userTable} WHERE id=${user_id}`;
      [rows, _] = await connection.query(query);
      res.status(200).send(`${JSON.stringify(rows[0])}`);
    }
  } catch (error) {
    console.log(error);
    res.status(500).send(`Internal server errro! ${error}`);
    return;
  }
});

export default router;
