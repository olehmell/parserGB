var request = require("request-promise"),
    cheerio = require("cheerio"), fs = require('fs'), conn = require('./db');
;
var data = JSON.parse(fs.readFileSync('views/project.json'));
//console.log(data);


function parserHTML() {
    let arr = "", vall = "", summ = "";
    let row = 0;
    function insert() {

        const insertSql = `INSERT INTO projects(${arr})VALUES(${vall})`;
        console.log(insertSql);
        conn.query(insertSql, function (err, results) {
            if (err) throw err;
            console.log("insert to finish");
        });
        const sqlSelect = `SELECT * from projects`;
        conn.query(sqlSelect,function (err,result) {

            data.forEach(function (valueD,indexD) {
                let mass = [];
                let massSUM = [];
                result.forEach(function (value,index)
                {
                    //console.log(value[`pr${valueD.number}`]);
                    massSUM.push(value[`pr${valueD.number}rage`])
                    mass.push(value[`pr${valueD.number}`]);
                });
                massSUM.shift();
                valueD.data = mass;
                valueD.dataSUM = massSUM;
                //console.log("-------------");
            })
            //console.log(data);
        })
        const time = [10, 60, 180, 360, 720, 1440];
        time.forEach(function (value, index) {
            //const sumSQL = `SELECT ${summ} FROM (SELECT * FROM projects ORDER BY id DESC LIMIT 0 , ${value}) t ORDER BY id ASC;`
            const sumSQL = `select ${summ} from projects where time between DATE_SUB(NOW(),INTERVAL ${value} MINUTE) and NOW();`
            conn.query(sumSQL, function (err, results) {
                if (err) throw err;
                /*results.forEach(function (value1,index1) {
                    data[index1].timefilter[index] = value1;
                })*/
                //results = JSON.parse(results);
                let row = "";
                Object.keys(results).forEach(function (key) {
                    row = results[key];
                });
                //console.log(row);
                switch (value) {
                    case 10:
                        data.forEach(function (value1, index1) {
                            value1.ten = row[`${value1.number}`];
                            //console.log(value1.ten);
                        });
                        break;
                    case 60:
                        data.forEach(function (value1, index1) {
                            value1.hour1 = row[`${value1.number}`];
                        });
                        break;
                    case 180:
                        data.forEach(function (value1, index1) {
                            value1.hour3 = row[`${value1.number}`];
                        });
                        break;
                    case 360:
                        data.forEach(function (value1, index1) {
                            value1.hour6 = row[`${value1.number}`];
                        });
                        break;
                    case 720:
                        data.forEach(function (value1, index1) {
                            value1.hour12 = row[`${value1.number}`];
                        });
                        break;
                    case 1440:
                        data.forEach(function (value1, index1) {
                            value1.hour24 = row[`${value1.number}`];
                        });
                        break;
                }
                //console.log(data);
            });
        });


    }

    let index = 0;
    let options = {
        uri: data[index].link,
        transform: function (body) {
            return cheerio.load(body);
        }
    }
    function parse($) {
        data[index].suffrage = $(".votes-count").find("strong").html();
        let amount = $(".amount").find("strong").text().split(" ");
        //console.log(amount);
        data[index].amount = amount;
        /*for (let i = 0; i < amount.length - 1;i++)
        {
            data[index].amount += amount[i];
        }*/
        //console.log(data[index].amount);
        //console.log(data[index].amount);
        console.log("finish" + index);
        let value = 0;
        //console.log(data[index].suffrage);
        console.log(row);
        if (row != 0) {
            //console.log(row[`pr${data[index].number}`]);
            value = data[index].suffrage - row[`pr${data[index].number}rage`];
            //console.log(data[index].suffrage);
        }
        else
        {
            value = data[index].suffrage;
        }

        console.log(value);
        if (index == (data.length - 1)) {
            vall += `'${value}','${data[index].suffrage}'`;
            arr += `pr${data[index].number},pr${data[index].number}rage`;
            summ += `SUM(pr${data[index].number}) as '${data[index].number}'`;
            console.log("insert start");
            insert();
        } else {
            arr += `pr${data[index].number},pr${data[index].number}rage,`;
            vall += `'${value}','${data[index].suffrage}',`;
            summ += `SUM(pr${data[index].number}) as '${data[index].number}',`;
            options.uri = data[++index].link;
            request(options).then(parse).catch(function (err) {
                console.log("Произошла ошибка: " + err)});
        }

    }

    request(options).then(parse).catch(function (err) {
        console.log("Произошла ошибка: " + err);
        index--;
        parse();
    })
    const sqlVal = "SELECT * FROM (SELECT * FROM `projects` ORDER BY id DESC LIMIT 0 , 1) t ORDER BY id ASC;";
    conn.query(sqlVal, function (err, results) {
        console.log(results);
        if (results.length != 0)
            Object.keys(results).forEach(function (key) {
                row = results[key];
            });
        else
            row = 0;
    });
};

parserHTML();
setInterval(parserHTML, 300000);
module.exports = data;
