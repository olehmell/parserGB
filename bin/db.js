const mysql = require('mysql');
const fs = require('fs');
let conn = mysql.createPool({
    connectionLimit : 10,
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

    //console.log(table);
    const sql = "drop table projects;"
    //const sql = "select * from projects;"
    //const sql = "alter table projects add time DATETIME DEFAULT CURRENT_TIMESTAMP;";
    conn.query(sql, (err, result) => console.log(result))
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
       // conn.getConnection(function (err, conn) {
            conn.query(sql2, function (err, results) {
                //conn.destroy();
                if (err) throw err;
                console.log("Table projects created");
            });
       // });
    }
//conn.getConnection(function (err, conn) {
    conn.query(sql0, function (err, results) {
        //conn.destroy();
        if (err) throw err;
        if (results.length == 0) {
            console.log("empty");
            createTable();
        } else
            console.log("table created last");
    //});
});
    //conn.end();

module.exports = conn;