var db = require("../models");
const path = require("path");

module.exports = function(app) {
  app.get("/", function(req, res) {
    res.render("scrape")
  });

  app.get("/scrape", function(req, res) {
    res.render("scrape");
  });

  app.get("/saved", function(req, res) {
    res.render("saved");
  });
  
};