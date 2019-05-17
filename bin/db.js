const mysql = require('mysql');
const fs = require('fs');
let conn = mysql.createConnection({
    database: 'zcaj2nq68420bkec',
    host: "lt80glfe2gj8p5n2.chr7pe7iynqr.eu-west-1.rds.amazonaws.com",
    user: "ljbyzr3bxwkhl203",
    password: "dcjm126j417bn8b5"
});
/*
/*

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
conn.connect(function (err) {
    if (err) {
        throw err;
    }
    console.log("Connected!");
    //console.log(table);
    //const sql = "drop table projects;"



    //const sql = "select * from projects;"
    //const sql = "ALTER TABLE projects ADD pr3333 INT NULL default 0;";
    //conn.query(sql, (err, result) => console.log(result))
    const sql0 = "SHOW TABLES LIKE 'projects';"

    function createTable() {
        let table = "";
        data.forEach(function (value1, index) {
            table += `pr${value1.number} INT not null DEFAULT 0,`;
        });
        console.log(table);

        const sql2 = "CREATE TABLE projects" +
            " (Id INT not null AUTO_INCREMENT, " + table + "result int not null default 0," +
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

});
module.exports = conn;