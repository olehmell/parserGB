const mysql = require('mysql');
const fs = require('fs');
const conn = mysql.createConnection({
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
 */

const dataPages = ["project.json"]
conn.connect(function (err) {
    if (err) {
        throw err;
    }
    console.log("Connected!");
    //console.log(table);
    //const sql = "drop table projects;"
    //const sql = "select * from projects;"
    //const sql = "ALTER TABLE projects ADD pr3333 INT NULL default 0;";
    //conn.query(sql,(err,result) => console.log(result))
    const sql0 = "SHOW TABLES LIKE 'projects';"
    function createTable() {
        let table = "";
        dataPages.forEach(function(value1, index) {

            const data = [];
            data[index] = JSON.parse(fs.readFileSync(`views/${value1}`));

            data[index].forEach(function (value1, index) {
                table += `pr${value1.number} INT not null DEFAULT 0,pr${value1.number}rage INT NOT NULL DEFAULT 0,`;
            });
        });
        console.log(table);

        const sql2 = "CREATE TABLE projects" +
            " (Id INT not null AUTO_INCREMENT, " + table + "time DATETIME DEFAULT NOW()," +
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