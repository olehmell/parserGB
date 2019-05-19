const mysql = require('mysql');
const fs = require('fs');
let conn = mysql.createPool({
    connectionLimit : 5,
    host     : 'eu-cdbr-west-02.cleardb.net',
    user     : 'b077bcc556224b',
    password : '9b98f6a3',
    database : 'heroku_48ee6185f3d9445'
});
/*
/*
database: 'dbForGB',
    host: "localhost",
    user: "root",
    password: "admin"
    database: 'bym1onf7s6lbdh4v',
    host: "sabaik6fx8he7pua.chr7pe7iynqr.eu-west-1.rds.amazonaws.com",
    user: "z6wyzx8uf6w1ynqb",
    password: "kwcvgb973luqjqae"
database: 'zcaj2nq68420bkec',
    host: "lt80glfe2gj8p5n2.chr7pe7iynqr.eu-west-1.rds.amazonaws.com",
    user: "ljbyzr3bxwkhl203",
    password: "dcjm126j417bn8b5"
database: 'mag6fchr4qon9rwk',
    host: "irkm0xtlo2pcmvvz.chr7pe7iynqr.eu-west-1.rds.amazonaws.com",
    user: "p89znwt5dr9w2k6x",
    password: "qfoepz8xcvsv4qme"
 */
const data = JSON.parse(fs.readFileSync(`views/project.json`));

    //console.log(table);
    //const sql = "drop table projects;"
    //const sql = "select * from projects;"
    //const sql = "alter table projects add time DATETIME DEFAULT CURRENT_TIMESTAMP;";
    //conn.query(sql, (err, result) => console.log(result))
    const sql0 = "SHOW TABLES LIKE 'projects';"

    function createTable() {
        let table = "";
        data.forEach(function (value1, index) {
            table += `pr${value1.number} INT null DEFAULT 0,`;
        });
        console.log(table);

        const sql2 = "CREATE TABLE projects" +
            " (Id INT not null AUTO_INCREMENT, " + table + "time DATETIME DEFAULT CURRENT_TIMESTAMP,"+
            " PRIMARY KEY (Id) )";
        conn.query(sql2, function (err, results) {
            if (err) throw err;
            console.log("Table projects created");
        });
    }

    conn.query(sql0, function (err, results) {
        if (err) throw err;
        if (results.length == 0) {
            console.log("empty");
            createTable();
        } else
            console.log("table created last");
    });
    //conn.end();

module.exports = conn;