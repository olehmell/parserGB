const mysql = require("mysql");
const fs = require("fs");
let conn = mysql.createPool({
  connectionLimit: 10,
  host: "eu-cdbr-west-03.cleardb.net",
  user: "badf4fb9382e0c",
  password: "657e7e1e",
  database: "heroku_0799cb07ca52401",
  reconnect: true
});
/*
/*
mysql://badf4fb9382e0c:657e7e1e@eu-cdbr-west-03.cleardb.net/heroku_0799cb07ca52401?reconnect=true

database: 'dbForGB',
    host: "localhost",
    user: "root",
    password: "admin"
    host     : 'eu-cdbr-west-02.cleardb.net',
    user     : 'b077bcc556224b',
    password : '9b98f6a3',
    database : 'heroku_48ee6185f3d9445'
    database: 'bym1onf7s6lbdh4v',
    host     : 'eu-cdbr-west-02.cleardb.net',
    user     : 'b00300329a8eb3',
    password : '88e479ab',
    database : 'heroku_66b709597cff373'
 */
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
