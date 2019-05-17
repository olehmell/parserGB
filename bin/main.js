var request = require("request-promise"),
    cheerio = require("cheerio"), fs = require('fs'), conn = require('./db');
;
var data = JSON.parse(fs.readFileSync('views/project.json'));
let chartData = [];
//console.log(data);

function parserHTML() {
    console.log(Date());
    let arr = "", vall = "";
    data.forEach(function (value1, index) {
        if (index == data.length - 1)
            arr += `pr${data[index].number}`;
        else
            arr += `pr${data[index].number},`;
    });

    function insert() {

        const insertSql = `INSERT INTO projects(${arr})VALUES(${vall})`;
        console.log(insertSql);
        conn.query(insertSql, function (err, results) {
            if (err) throw err;
            console.log("insert to finish");
        });
        const time = [3, 18, 54, 108, 216, 432];
        time.forEach(function (value, index) {
            const sumSQL = `SELECT * FROM (SELECT * FROM projects ORDER BY id DESC LIMIT 0 , ${value}) t ORDER BY id ASC;`
            //console.log(sumSQL);
            conn.query(sumSQL, function (err, results) {
                if (err) throw err;
                //console.log(results);
                //console.log(results[results.length-1]);
                //console.log(row);
                switch (value) {
                    case 3:
                        data.forEach(function (value1, index1) {
                            value1.ten = (results[results.length - 1][`pr${value1.number}`] - results[0][`pr${value1.number}`]);
                            //console.log(value1.ten);
                        });
                        break;
                    case 18:
                        data.forEach(function (value1, index1) {
                            value1.hour1 = (results[results.length - 1][`pr${value1.number}`] - results[0][`pr${value1.number}`]);
                        });
                        break;
                    case 54:
                        data.forEach(function (value1, index1) {
                            value1.hour3 = (results[results.length - 1][`pr${value1.number}`] - results[0][`pr${value1.number}`]);
                        });
                        break;
                    case 108:
                        data.forEach(function (value1, index1) {
                            value1.hour6 = (results[results.length - 1][`pr${value1.number}`] - results[0][`pr${value1.number}`]);
                        });
                        break;
                    case 216:
                        data.forEach(function (value1, index1) {
                            value1.hour12 = (results[results.length - 1][`pr${value1.number}`] - results[0][`pr${value1.number}`]);
                        });
                        break;
                    case 432:
                        data.forEach(function (value1, index1) {
                            value1.hour24 = (results[results.length - 1][`pr${value1.number}`] - results[0][`pr${value1.number}`]);
                        });
                        break;
                }
                //console.log(data);
            });
        });
        const sqlSelect = `SELECT * from projects`;
        conn.query(sqlSelect, function (err, result) {
            data.forEach(function (valueD, indexD) {
                let mass = [], massSUM = [], massRg = [];
                for (let index = 0; index < result.length; index +=18)
                {
                    massSUM.push(result[index][`pr${valueD.number}`]);
                    //assRg.push(result[index][`pr${valueD.number}`]);
                    //console.log(massRg);
                }
                for (let index = 0; index < result.length; index +=18)
                {
                    massRg.push(Math.round(result[index][`pr${valueD.number}`]/valueD.amount*10000000));
                    //console.log(massRg);
                }

                for (let time = 1; time < result.length; time += 3)
                {
                    mass.push(result[time][`pr${valueD.number}`] - result[time - 1][`pr${valueD.number}`]);
                }
                data[indexD].data = mass;
                data[indexD].dataSUM = massSUM;
                data[indexD].dataRg = massRg;
                //mass.shift();
                //console.log("-------------");
            })

            //console.log(data);
        })
    }

    let index = 0;
    let options = {
        uri: data[index].link,
        transform: function (body) {
            return cheerio.load(body);
        }
    }

    function parse($) {
        let suffrage = $(".votes-count").find("strong").html();
        if(Number(suffrage) >= data[index].suffrage)
            data[index].suffrage = suffrage;
        console.log("finish" + index);
        if (index == (data.length - 1)) {
            vall += `'${data[index].suffrage}'`;
            console.log("insert start");
            insert();
        } else {
            vall += `'${data[index].suffrage}',`;
            options.uri = data[++index].link;
            request(options).then(parse).catch(function (err) {
                if (index == (data.length - 1))
                    vall += `'${data[index].suffrage}'`;
                else
                    vall += `'${data[index].suffrage}',`;
                console.log("Произошла ошибка: " + err)
            });
        }

    }

    request(options).then(parse).catch(function (err) {
            vall += `'${data[index].suffrage}'`;
        console.log("Произошла ошибка: " + err);
    })
};

parserHTML();
setInterval(parserHTML, 360000);
module.exports = data;
