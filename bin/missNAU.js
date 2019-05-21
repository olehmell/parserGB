let request = require("request-promise"),
    cheerio = require("cheerio"), fs = require('fs'), conn = require('./db'),
    data = JSON.parse(fs.readFileSync('views/test.json'));

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
            }

        }).catch(function (err) {
            if (i == data.length) {
                console.log("finish" + indexD);
            }
            console.log("Произошла ошибка: " + err);
        })
    })
}

module.exports.data = data;
module.exports.start = function () {
    console.log("MISS NAU");
    parse();
};
