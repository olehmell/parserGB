const mysql = require("mysql");
const fs = require("fs");
/* let conn = mysql.createPool({
  connectionLimit: 10,
  host: "eu-cdbr-west-03.cleardb.net",
  user: "badf4fb9382e0c",
  password: "657e7e1e",
  database: "heroku_0799cb07ca52401",
  reconnect: true
}); */
let conn = mysql.createPool({
  connectionLimit: 10,
  host: "eu-cdbr-west-03.cleardb.net",
  user: "b6f0316e1ff69d",
  password: "ef4627abc83df7f",
  database: "heroku_06ed86d53ec2941",
  reconnect: true
});

/* let conn = mysql.createPool({
  connectionLimit: 10,
  host: "db4free.net",
  user: "parser2021",
  password: "PHWJEm982iGm",
  database: "naugb2021",
  reconnect: true
}); */

const data = JSON.parse(fs.readFileSync(`views/project.json`));

function createTable() {
  return new Promise((res, rej) => {
    let table = "";
    data.forEach(function (value1, index) {
      table += `pr${value1.number} INT null DEFAULT 0,`;
    });
  
    const sql2 =
      "CREATE TABLE IF NOT EXISTS projects" +
      " (Id INT not null AUTO_INCREMENT, " +
      table +
      "time DATETIME DEFAULT CURRENT_TIMESTAMP," +
      " PRIMARY KEY (Id) )";
  
    conn.query(sql2, function (err, results) {
      if (err) rej(err);
      console.log("Table checked");
      res(results)
  });
  })
}

const initDb = async () => {
  //console.log(table);
  // const sql = "drop table projects;"
  //const sql = "create table projects;"
  //const sql = "select * from projects;"
  //const sql = "alter table projects add time DATETIME DEFAULT CURRENT_TIMESTAMP;";
  // await conn.query(sql, (err, result) => console.log(result))

  const res = await createTable();
  console.log('createTable', res)

  return conn
};

module.exports = initDb;
