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
    const data = JSON.parse(fs.readFileSync('views/project.json'));
    let table = "";
    data.forEach(function (value1,index) {
         table +=  `pr${value1.number} INT not null,`;
    });
    //console.log(table);
    const sql2 = "CREATE TABLE projects" +
        " (Id INT not null AUTO_INCREMENT, " + table +
        " PRIMARY KEY (Id) )";
    const sql0 = "SHOW TABLES LIKE 'projects';"
    function createTable()
    {
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



 /*   // Insert Datas to EMPLOYEES.
    for (var i = 0; i < empNos.length; i++) {
        var sql3 = "Insert into Employees (Emp_No, Full_Name, Hire_Date)" //
            +
            " Values ('" + empNos[i] + "', '" + fullNames[i] + "', STR_TO_DATE('" + hireDates[i] + "', '%d/%m/%Y') )";

        conn.query(sql3, function(err, results) {
            if (err) throw err;
            console.log("Insert a record!");
        });
    }
*/
});
module.exports = conn;