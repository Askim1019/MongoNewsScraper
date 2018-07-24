// Scraping tools
var request = require("request");
var cheerio = require("cheerio");
var axios = require("axios");
// Requiring our Comment and Article models
var Comment = require("../models/Comment.js");
var Article = require("../models/Article.js");

module.exports = function (app) {

  //Routes
  app.get("/scrape", function(req, res) {
    axios.get("http://www.chicagotribune.com/").then(function(response) {
      var $ = cheerio.load(response.data);

      $("article").each(function(i, element) {
        var result = {};

        result.headline = $(this)
          .children("h2")
          .text();
        result.summary = $(this)
          .children("p")
          .text();
        result.url = $(this)
          .children("h2")
          .children("a")
          .attr("href");

          console.log(result);
      });

      res.send("Scrape Completed");
    });
  });

};