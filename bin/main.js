var request = require("request"),
    cheerio = require("cheerio"),fs = require('fs'), conn = require('./db');;
var data;

function parseHTML()
{
   data = JSON.parse(fs.readFileSync('views/test.json'));
    //console.log(data);
    let arr = "";
    let vall = "";
    function insert()
    {
        const sql = `INSERT INTO projects(${arr})VALUES(${vall})`;
        console.log(sql);
            conn.query(sql, function(err, results) {
                if (err) throw err;
                console.log("insert to finish");
            });

    }
    data.forEach(function (value1, index) {
        request(value1.link, function (error, response, body) {
            if (!error) {
                var __$ = cheerio.load(body);
                value1.suffrage = __$(".votes-count").find("strong").html();
                if(index == (data.length-1))
                {
                    setTimeout(function () {
                        vall += `'${value1.suffrage}'`;
                        arr += `pr${value1.number}`;
                        console.log(vall);
                        console.log(arr);
                        insert();
                    },1000);
                    //insert();
                }
                else
                {
                    arr += `pr${value1.number}, `;
                    vall += `'${value1.suffrage}',`;
                }


                //value1.suffrage = __$(".status").text();
            } else {
                console.log("Произошла ошибка: " + error);
            }
        });
    });

}
parseHTML();
setInterval(parseHTML,10000);
module.exports = data;