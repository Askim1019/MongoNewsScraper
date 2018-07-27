// Scraping tools
var request = require("request");
var cheerio = require("cheerio");
var axios = require("axios");
// Requiring our Comment and Article models
/* var Comment = require("../models/Comment.js");
var Article = require("../models/Article.js"); */
var db = require('../models/index.js');
module.exports = function (app) {

  //Routes
  app.get("/", function(req, res) {
    db.Article.find({
     /*  saved: false */
    })
    .then(function (dbArticle) {
      var hbsObject = {
        articles: dbArticle
      }
      res.render("index", hbsObject);
    })
    .catch(function(err) {
      res.json(err);
    });
    
  });

  app.get("/scrape", function(req, res) {

    db.Article.find({}, function(err, dbArticles) {

      axios.get("http://www.chicagotribune.com/").then(function(response) {
        var $ = cheerio.load(response.data);
        var counter = 0;

        $("article").each(function(i, element) {
          var result = {};

          result.headline = $(this).children("h2").text();
          result.summary = $(this).children("p").text();
          result.url = "http://chicagotribune.com/" + $(this).children("h2").children("a").attr("href");
          

          var repeat = false;

          for(var i =0; i< dbArticles.length; i++) {
            if (dbArticles[i].headline === result.headline) {
              repeat = true;
              break;
            }
          }

          if(!repeat && result.headline && result.summary && result.url) {
            db.Article.create(result);
            counter++;
          }

            console.log(result);
        });

        res.json({
          count: counter
        });
        
      });
    });
  });

  app.post("/savearticle/:id", function(req, res) {
    db.Article.findByIdAndUpdate({
      _id: req.params.id
    }, {
      saved: true
    })
    .then(function(dbArticle) {
      res.json(dbArticle);
    })
    .catch(function(err) {
      res.json(err);
    })
  });

};