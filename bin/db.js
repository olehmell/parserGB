const mysql = require('mysql');
const fs = require('fs');
const conn = mysql.createConnection({
    database: 'n2ovimf1jzve94ea',
    host: "r6ze0q02l4me77k3.chr7pe7iynqr.eu-west-1.rds.amazonaws.com",
    user: "t7oq2hbkkg3z1h6f",
    password: "xxm0eeqo5gfi7pn1"
});
/*
/*
    database: 'n2ovimf1jzve94ea',
    host: "r6ze0q02l4me77k3.chr7pe7iynqr.eu-west-1.rds.amazonaws.com",
    user: "t7oq2hbkkg3z1h6f",
    password: "xxm0eeqo5gfi7pn1"
    */

conn.connect(function(err) {
    if (err) {
        throw err;
    }
    console.log("Connected!");

    //console.log(table);

    //const delet = "drop table projects;"
    //const show = "select * from projects;"
    //conn.query(delet,(err,result) => console.log(result))
    const sql0 = "SHOW TABLES LIKE 'projects';"
    function createTable()
    {
        const data = JSON.parse(fs.readFileSync('views/test.json'));
        let table = "";
        data.forEach(function (value1,index) {
            table +=  `pr${value1.number} INT not null DEFAULT 0,`;
        });
        const sql2 = "CREATE TABLE projects" +
            " (Id INT not null AUTO_INCREMENT, " + table + "time DATETIME DEFAULT CURRENT_TIMESTAMP," +
            " PRIMARY KEY (Id) )";
        conn.query(sql2, function(err, results) {
            if (err) throw err;
            console.log("Table projects created");
        });
    }
    conn.query(sql0, function(err, results) {
        if (err) throw err;
            if(results.length == 0)
            {
                console.log("empty");
                createTable();
            }
            else
                console.log("table created last");
    });
});
module.exports = conn;