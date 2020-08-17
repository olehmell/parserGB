let request = require("request-promise"),
  cheerio = require("cheerio"),
  fs = require("fs"),
  conn = require("./db"),
  data = JSON.parse(fs.readFileSync("views/test.json"));

function parse() {
  let options = {
    uri: "",
    transform: function (body) {
      return cheerio.load(body);
    },
  };
  data.forEach(function (valueD) {
    options.uri = valueD.link;
    data.forEach(function (value) {
      const proj = $($(`.proj_num:contains("${value.number}")`)).parent();
      let suffrage = proj.find(".vote").html();
      suffrage = suffrage.split(" ");
      if (suffrage.length > 1) {
        suffrage = suffrage[0] + suffrage[1].toString();
      }
      //console.log(suffrage);
      if (Number(suffrage) >= value.suffrage) value.suffrage = suffrage;
    });
  });
}

module.exports.data = data;
module.exports.start = function () {
  console.log("MISS NAU");
  // parse();
};
