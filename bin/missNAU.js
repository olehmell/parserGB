let request = require("request"),
    cheerio = require("cheerio"), fs = require('fs'), conn = require('./db'),
    data = JSON.parse(fs.readFileSync('views/test.json'));

function parse()
{
    let options = {
        uri: "https://gurin.com.ua/rating.php",
        transform: function (body) {
            return cheerio.load(body);
        }
    };
    request(options).then(function ($) {
        data.forEach(function (value,index) {
            const proj = $($(`.proj_num:contains("${value.number}")`)).parent();
            let suffrage = proj.find(".vote").html();
            suffrage = suffrage.split(' ');
            if(suffrage.length > 1)
            {
                suffrage = suffrage[0] + suffrage[1].toString();
            }
            //console.log(suffrage);
            if (Number(suffrage) >= value.suffrage)
                value.suffrage = suffrage;
        })
    });
}

module.exports.data = data;
module.exports.start = function () {
    console.log("MISS NAU");
    parse();
};
