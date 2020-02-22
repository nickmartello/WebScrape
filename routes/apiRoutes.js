var db = require("../models");
const axios = require("axios");
const cheerio = require("cheerio");

module.exports = function(app) {
  
  app.get("/api/scrape", function(req, res) {
    axios.get("https://www.capecodtimes.com/news/").then(function(response) {
      var $ = cheerio.load(response.data);

      $("div.media-body").each(function(i, element) {
        var result = {};

        result.title = $(element)
          .children("h3")
          .text();
        result.blurb = $(element)
          .children("p.media-deck")
          .text()
          .replace(/(?:\r\n|\r|\n)/g, "");


        db.Article.create(result)
          .then(function(dbArticle) {
            console.log(dbArticle);
          })
          .catch(function(err) {
            console.log(err);
          });
      });
    });
  });

  app.get("/api/articles", function(req, res) {
    db.Article.find({})
      .then(function(dbArticle) {
        res.json(dbArticle);
      })
      .catch(function(err) {
        res.json(err);
      });
  });

  app.put("/api/articles/:id", function(req, res) {
    let saved;

    switch (req.body.saved) {
      case "false":
        saved = true;
        break;
      case "true":
        saved = false;
        break;
      default:
        break;
    }

    db.Article.update({ _id: req.params.id }, { $set: { saved: saved } })
      .then(function(dbArticle) {
        res.json(dbArticle);
      })
      .catch(function(err) {
        res.json(err);
      });
  });

  app.get("/api/articles/:id", function(req, res) {
    console.log("note connected");
    console.log(req.params.id);
    db.Article.findOne({ _id: req.params.id })
      .populate("note")
      .then(function(dbArticle) {
        res.json(dbArticle);
      })
      .catch(function(err) {
        res.json(err);
      });
  });

  app.post("/api/articles/:id", function(req, res) {
    db.Note.create(req.body)
      .then(function(dbNote) {
        return db.Article.findOneAndUpdate(
          { _id: req.params.id },
          { note: dbNote._id },
          { new: true }
        );
      })
      .then(function(dbArticle) {
        res.json(dbArticle);
      })
      .catch(function(err) {
        res.json(err);
      });
  });

  app.get("/api/saved", function(req, res) {
    db.Article.find({ saved: true})
      .then(function(dbArticle) {
        res.json(dbArticle);
      })
      .catch(function(err) {
        res.json(err);
      });
  });
  
};