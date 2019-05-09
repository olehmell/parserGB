var request = require("request-promise"),
    cheerio = require("cheerio"), fs = require('fs'), conn = require('./db');
;
var data = JSON.parse(fs.readFileSync('views/test.json'));

//console.log(data);


function parserHTML() {

    let arr = "";
    let vall = "";
    let summ = "";
    function insert() {

        const insertSql = `INSERT INTO projects(${arr})VALUES(${vall})`;
        console.log(insertSql);
        conn.query(insertSql, function (err, results) {
            if (err) throw err;
            console.log("insert to finish");
        });
        const time = [2,12,36,72,144,288];
        time.forEach(function(value, index){
            const sumSQL = `SELECT ${summ} FROM (SELECT * FROM projects ORDER BY id DESC LIMIT 0 , ${value}) t ORDER BY id ASC;`
            conn.query(sumSQL,function (err, results) {
                if (err) throw err;
                /*results.forEach(function (value1,index1) {
                    data[index1].timefilter[index] = value1;
                })*/
                //results = JSON.parse(results);
                console.log(results[`${data[4].number}`]);
            });
        } )
        //console.log(data);

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
        console.log("finish" + index);
        //console.log(data.length);
        if(index == (data.length-1))
        {
            vall += `'${data[index].suffrage}'`;
            arr += `pr${data[index].number}`;
            summ += `SUM(pr${data[index].number}) as '${data[index].number}'`;
            console.log("insert start");
            insert();
        }
        else
        {
            arr += `pr${data[index].number}, `;
            vall += `'${data[index].suffrage}',`;
            summ += `SUM(pr${data[index].number}) as '${data[index].number}',`;
            console.log("rekurs")
            options.uri = data[++index].link;
            request(options).then(parse);
        }

    }
    request(options).then(parse).catch(function (err) {
        console.log("Произошла ошибка: " + err);
    })
};

parserHTML();
setInterval(parserHTML,10000);
module.exports = data;

//value1.suffrage = __$(".status").text();
/*SELECT SUM(pr732),SUM(pr2095)
   FROM (SELECT *
      FROM `projects` ORDER BY id DESC LIMIT 0 , 6) t
ORDER BY id ASC;

 switch (value) {
                        case 2:
                            data[index].ten = value1;
                            break;
                        case 12:
                            data[index].hour1 = value1;
                            break;
                        case 36:
                            data[index].hour3 = value1;
                            break;
                        case 72:
                            data[index].hour6 = value1;
                            break;
                        case 144:
                            data[index].hour = value1;
                            break;
                        case 288:
                            data[index].ten = value1;
                            break;
                    }

                     SELECT SUM(pr732) as '732',SUM(pr2095)
     FROM (SELECT *
         FROM `projects` ORDER BY id DESC LIMIT 0 , 6) t
    ORDER BY id ASC;*/