let request = require("request-promise"),
    cheerio = require("cheerio"), fs = require('fs'), conn = require('./db'),
    data = JSON.parse(fs.readFileSync('views/project.json'));

function retung() {
    let options = {
        uri: "https://gurin.com.ua/rating.php",
        timeout: 10000,
        transform: function (body) {
            return cheerio.load(body);
        }
    };
    request(options).then(function ($) {
        data.forEach(function (value, index) {
            let proj;
            if (value.name == "Radioday")
                proj = $($(`.name:contains("${value.name}")`)).parent();
            else
                proj = $($(`.proj_num:contains("${value.number}")`)).parent();
            let retng = proj.find(".sort");
            value.retng = retng.html();
            if (retng.hasClass("win") && (value.suffrage > value.min))
                value.win = "win";
            else if (retng.hasClass("win"))
                value.win = "nowin";
            else
                value.win = "closed";

            console.log("ret" + value.retng);
        });
    }).catch(function (err) {
        //insert();
        console.log("Произошла ошибка gorin: " + err);});
}


function insert() {
    retung();
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
    //conn.getConnection(function (err, conn) {
        conn.query(insertSql, function (err, results) {
            //conn.destroy();
            if (err)
                throw err;
            else
                console.log("insert to finish");
        });
   //});
    const time = [3, 12, 36, 72, 144, 288];
    time.forEach(function (value, index) {
        //console.log("run");
        //const sumSQL = `select ${summ} from projects where time between DATE_SUB(NOW(),INTERVAL ${value} MINUTE) and NOW();`
        const sumSQL = `SELECT * FROM (SELECT * FROM projects ORDER BY id DESC LIMIT 0 , ${value}) t ORDER BY id ASC;`
        //console.log(sumSQL);
        //conn.getConnection(function (err, conn) {
            conn.query(sumSQL, function (err, results) {
                //conn.destroy();
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
   // });

    const sqlSelect = `SELECT * from projects`;
    //conn.getConnection(function (err, conn) {
        conn.query(sqlSelect, function (err, result) {
            //conn.destroy();
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
   // });
}
function parse() {
    let options = {
        uri: "https://gurin.com.ua/rating.php",
        transform: function (body) {
            return cheerio.load(body);
        }
    };
    console.log("run1");
    let i = 0;
    data.forEach(function (valueD, indexD) {
        options.uri = valueD.link;
        request(options).then(function ($) {
            i++;
            let suffrage = $(".votes-count").find("strong").html();
            suffrage = suffrage.split(' ');
            if(suffrage.length > 1)
            {
                suffrage = suffrage[0] + suffrage[1].toString();
            }
            if (Number(suffrage) >= valueD.suffrage)
                valueD.suffrage = suffrage;

            if (i == data.length) {
                console.log("finish" + indexD);
                insert();
            }

        }).catch(function (err) {
            console.log("Произошла ошибка: " + err);
        })
    })
}
/*function parse()
{
    let options = {
        uri: "https://gurin.com.ua/rating.php",
        transform: function (body) {
            return cheerio.load(body);
        }
    };
    request(options).then(function ($) {
        data.forEach(function (value,index) {
            let proj;
            if (value.name == "Radioday")
                proj = $($(`.name:contains("${value.name}")`)).parent();
            else
                 proj = $($(`.proj_num:contains("${value.number}")`)).parent();
            let retng = proj.find(".sort");
            value.retng = retng.html();
            let suffrage = proj.find(".vote").html();
            if(retng.hasClass("win") && (suffrage > value.min))
                value.win = "win";
            else if(retng.hasClass("win"))
                value.win = "nowin";
            else
                value.win = "closed";
            suffrage = suffrage.split(' ');
            if(suffrage.length > 1)
            {
                suffrage = suffrage[0] + suffrage[1].toString();
            }
            //console.log(suffrage);
            if (Number(suffrage) >= value.suffrage)
                value.suffrage = suffrage;
            //console.log(retng.html());
        })
        insert();
    }).catch(function (err) {
            insert();
        console.log("Произошла ошибка: " + err);});
}*/
module.exports.data = data;
module.exports.start = function () {
    console.log("parse start");
    parse();
};
