let request = require("request-promise"),
  cheerio = require("cheerio"),
  fs = require("fs"),
  initDb = require("./db"),
  data = JSON.parse(fs.readFileSync("views/project.json"));

let conn;

function insert() {
  let vall = [],
    arr = [];
  data.forEach(function (valueD, index) {
    if (index == data.length - 1) {
      vall += `'${valueD.suffrage}'`;
      arr += `pr${data[index].number}`;
    } else {
      arr += `pr${data[index].number},`;
      vall += `'${valueD.suffrage}',`;
    }
  });
  const insertSql = `INSERT INTO projects (${arr}) VALUES(${vall});`;
  console.log("Insert to db");
  conn.query(insertSql, function (err, results) {
    if (err) throw err;
    else console.log("Insert success");
    //});
  });

  const time = [3, 12, 36, 72, 144, 288];
  time.forEach(function (timeLimit, index) {
    const sumSQL = `SELECT * FROM (SELECT * FROM projects ORDER BY id DESC LIMIT 0 , 288) t ORDER BY id ASC;`;
    conn.query(sumSQL, function (err, results) {
      if (err) throw err;
      else {
        const pushData = (key) => {
          for (let i = 0; i < timeLimit; i++) {
            const value = results[i]
            if (results.length > 1) {
              value[key] =
                results[results.length - 1][`pr${value.number}`] -
                results[0][`pr${value.number}`];
            } else {
              value[key] = results ? results[0][`pr${value.number}`] : 0;
            }
          };
        };

        switch (timeLimit) {
          case 3:
            return pushData("ten");
          case 12:
            return pushData("hour1");
          case 36:
            return pushData("hour3");
          case 72:
            return pushData("hour6");
          case 144:
            return pushData("hour12");
          case 288:
            return pushData("hour24");
        }
      }
    });
  });
  // });

  const sqlSelect = `SELECT * from projects`;
  conn.query(sqlSelect, function (err, result) {
    if (err) throw err;
    else {
      data.forEach(function (valueD, indexD) {
        let mass = [],
          massSUM = [],
          massRg = [];
        for (let index = 0; index < result.length; index += 12) {
          massSUM.push(result[index][`pr${valueD.number}`]);
        }
        for (let index = 0; index < result.length; index += 12) {
          massRg.push(
            Math.round(
              (result[index][`pr${valueD.number}`] / valueD.amount) * 10000000
            )
          );
        }

        for (let time = 1; time < result.length; time += 2) {
          mass.push(
            result[time][`pr${valueD.number}`] -
              result[time - 1][`pr${valueD.number}`]
          );
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
    },
  };
  let i = 0;
  data.forEach(function (valueD, indexD) {
    options.uri = valueD.link;
    request(options)
      .then(function ($) {
        i++;
        let suffrage = $(".votes-count").find("strong").html();
        suffrage = suffrage ? suffrage.split(" ") : 0;
        if (suffrage.length > 1) {
          suffrage = suffrage[0] + suffrage[1].toString();
        }

        console.log(suffrage);
        if (Number(suffrage) >= valueD.suffrage) valueD.suffrage = suffrage;

        if (i == data.length) {
          console.log("finish" + indexD);
          insert();
        }
      })
      .catch(function (err) {
        if (i == data.length) {
          console.log("finish" + indexD);
          insert();
        }
        console.log("Произошла ошибка: " + err);
      });
  });
}
// function parse()
// {
//     let options = {
//         uri: "https://gurin.com.ua/rating.php",
//         headers:
//             {
//                 'Connection': 'Keep-Alive'
//             },
//         transform: function (body) {
//             return cheerio.load(body);
//         }
//     };
//     request(options).then(function ($) {
//         data.forEach(function (value,index) {
//             let proj;
//             if (value.name == "Radioday")
//                 proj = $($(`.name:contains("${value.name}")`)).parent();
//             else
//                 proj = $($(`.proj_num:contains("${value.number}")`)).parent();
//             let retng = proj.find(".sort");
//             value.retng = retng.html();
//             let suffrage = proj.find(".vote").html();
//             if(retng.hasClass("win") && (suffrage > value.min))
//                 value.win = "win";
//             else if(retng.hasClass("win"))
//                 value.win = "nowin";
//             else
//                 value.win = "closed";
//             suffrage = suffrage.split(' ');
//             if(suffrage.length > 1)
//             {
//                 suffrage = suffrage[0] + suffrage[1].toString();
//             }
//             //console.log(suffrage);
//             if (Number(suffrage) >= value.suffrage)
//                 value.suffrage = suffrage;
//             //console.log(retng.html());
//         })
//         insert();
//     }).catch(function (err) {
//             insert();
//         console.log("Произошла ошибка: " + err);});
// }
module.exports.data = data;
module.exports.start = function () {
  console.log("parse start");
  initDb()
    .then((_conn) => {
      conn = _conn;
      parse();
    })
    .catch((err) => console.error("Failde init db", err));
};
