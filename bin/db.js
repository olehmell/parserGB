const mysql = require('mysql');
const fs = require('fs');
const conn = mysql.createConnection({
    database: 'dbForGB',
    host: "localhost",
    user: "root",
    password: "admin"
});


conn.connect(function(err) {
    if (err) {
        throw err;
    }
    console.log("Connected!");

    //console.log(table);

    const sql0 = "SHOW TABLES LIKE 'projects';"
    function createTable()
    {
        const data = JSON.parse(fs.readFileSync('views/test.json'));
        let table = "";
        data.forEach(function (value1,index) {
            table +=  `pr${value1.number} INT not null DEFAULT 0,`;
        });
        const sql2 = "CREATE TABLE projects" +
            " (Id INT not null AUTO_INCREMENT, " + table +
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