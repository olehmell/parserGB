let request = require("request-promise"),
    cheerio = require("cheerio"), fs = require('fs'), conn = require('./db'),
    data = JSON.parse(fs.readFileSync('views/project.json'));


function insert() {
    let vall = [], arr = [];
    data.forEach(function (valueD, index) {
            if (index == (data.length - 1)) {
                vall += `'${valueD.suffrage}'`;
                arr += `pr${data[index].number}`;
            } else {
                arr += `pr${data[index].number},`;
                vall += `'${valueD.suffrage}',`;
            }
        }
    );
    console.log("insert");
    const insertSql = `INSERT INTO projects (${arr}) VALUES(${vall});`;
    //console.log(insertSql);
    conn.query(insertSql, function (err, results) {
        if (err) throw err;
        else
            console.log("insert to finish");
    });
    const time = [3, 12, 36, 72, 144, 288];
    time.forEach(function (value, index) {
        //console.log("run");
        //const sumSQL = `select ${summ} from projects where time between DATE_SUB(NOW(),INTERVAL ${value} MINUTE) and NOW();`
        const sumSQL = `SELECT * FROM (SELECT * FROM projects ORDER BY id DESC LIMIT 0 , ${value}) t ORDER BY id ASC;`
        //console.log(sumSQL);
        conn.query(sumSQL, function (err, results) {
            if (err) throw err;
            else {
                switch (value) {
                    case 3:
                        data.forEach(function (value1, index1) {
                            value1.ten = (results[results.length - 1][`pr${value1.number}`] - results[0][`pr${value1.number}`]);
                            //console.log(value1.ten);
                        });
                        break;
                    case 12:
                        data.forEach(function (value1, index1) {
                            value1.hour1 = (results[results.length - 1][`pr${value1.number}`] - results[0][`pr${value1.number}`]);
                        });
                        break;
                    case 36:
                        data.forEach(function (value1, index1) {
                            value1.hour3 = (results[results.length - 1][`pr${value1.number}`] - results[0][`pr${value1.number}`]);
                        });
                        break;
                    case 72:
                        data.forEach(function (value1, index1) {
                            value1.hour6 = (results[results.length - 1][`pr${value1.number}`] - results[0][`pr${value1.number}`]);
                        });
                        break;
                    case 144:
                        data.forEach(function (value1, index1) {
                            value1.hour12 = (results[results.length - 1][`pr${value1.number}`] - results[0][`pr${value1.number}`]);
                        });
                        break;
                    case 288:
                        data.forEach(function (value1, index1) {
                            value1.hour24 = (results[results.length - 1][`pr${value1.number}`] - results[0][`pr${value1.number}`]);
                        });
                        break;
                }
            }
        });
    });

    const sqlSelect = `SELECT * from projects`;
    conn.query(sqlSelect, function (err, result) {
        if (err) throw err;
        else {
            data.forEach(function (valueD, indexD) {
                let mass = [], massSUM = [], massRg = [];
                for (let index = 0; index < result.length; index += 12) {
                    massSUM.push(result[index][`pr${valueD.number}`]);
                    //assRg.push(result[index][`pr${valueD.number}`]);
                    //console.log(massRg);
                }
                for (let index = 0; index < result.length; index += 12) {
                    massRg.push(Math.round(result[index][`pr${valueD.number}`] / valueD.amount * 10000000));
                    //console.log(massRg);
                }

                for (let time = 1; time < result.length; time += 2) {
                    mass.push(result[time][`pr${valueD.number}`] - result[time - 1][`pr${valueD.number}`]);
                }
                data[indexD].data = mass;
                data[indexD].dataSUM = massSUM;
                data[indexD].dataRg = massRg;
            });
        }
    });
}

function parse() {
    let options = {
        uri: "",
        transform: function (body) {
            return cheerio.load(body);
        }
    };
    let i = 0;
    data.forEach(function (valueD, indexD) {
        options.uri = valueD.link;
        request(options).then(function ($) {
            i++;
            let suffrage = $(".votes-count").find("strong").html();
            if (Number(suffrage) >= valueD.suffrage)
                valueD.suffrage = suffrage;

            if (i == data.length) {
                console.log("finish" + indexD);
                insert();
            }

        }).catch(function (err) {
            if (i == data.length) {
                console.log("finish" + indexD);
                insert();
            }
            console.log("Произошла ошибка: " + err);
        })
    })
}

module.exports.data = data;
module.exports.start = function () {
    console.log("parse start");
    parse();
};
