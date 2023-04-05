//Importing mysql and csvtojson packages
//Requiring module

import csvtojson from "csvtojson";
import mysql from "mysql2/promise";

//Establish connection to the database
let connection = await mysql.createConnection({
  host: "localhost",
  user: "redwood",
  password: "1234",
  database: "mblix",
});

//CSV file name
const fileName = process.cwd() + "/data_normalize/processed_data.csv";
console.log(fileName)
csvtojson()
  .fromFile(fileName)
  .then(async (source) => {
    //Fetching the data from each row
    //and inserting to the table "processed data"
    for (var i = 0; i < source.length; i++) {
      const insertStatement =
        `INSERT INTO MBTI(id, name, ENFJ, ENFP, ENTJ, ENTP, ESFJ, ESFP, ESTJ, ESTP, INFJ, INFP, INTJ, INTP, ISFJ, ISFP, ISTJ, ISTP) ` +
        `VALUES(${source[i]["id"]}, '${source[i]["name"]}',` +
        `${source[i]["ENFJ"]}, ${source[i]["ENFP"]}, ${source[i]["ENTJ"]}, ${source[i]["ENTP"]},` +
        `${source[i]["ESFJ"]}, ${source[i]["ESFP"]}, ${source[i]["ESTJ"]}, ${source[i]["ESTP"]},` +
        `${source[i]["INFJ"]}, ${source[i]["INFP"]}, ${source[i]["INTJ"]}, ${source[i]["INTP"]},` +
        `${source[i]["ISFJ"]}, ${source[i]["ISFP"]}, ${source[i]["ISTJ"]}, ${source[i]["ISTP"]})`;

      console.log(insertStatement);

      try {
        let [rows, _] = await connection.query(insertStatement);
        console.log(`${rows.affectedRows} affected`);
      } catch (err) {
        console.error(err);
        return;
      }
    }
    console.log("All items stored into database successfully");
  });
