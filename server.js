//Requiring express and mongoose for mongodb
const axios = require('axios');
const cheerio = require("cheerio");
const mongoose = require("mongoose");
const express = require("express");
const bodyParser = require('body-parser');
const exphbs = require('express-handlebars'); 
const db = require("./models/index");


let PORT = process.env.PORT || 3000;


let app = express();



app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));

app.set('views', './views')
app.engine(
  "handlebars",
  exphbs({
    defaultLayout: "main"
  })
);
app.set("view engine", "handlebars");

let MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/mongoNews";
mongoose.connect(MONGODB_URI, { useNewUrlParser: true });


    app.get('/', function (req, res) {
        db.Article.find({ saved: false }, function (err, data) {
            res.render('index', { home: true, article: data });
        })
    });

   
    app.get("/api/fetch", function (req, res) {
      
        axios.get("https://www.nytimes.com/").then(function (response) {
            const $ = cheerio.load(response.data);

            $("article").each(function (i, element) {

                let result = {};
                result.headline = $(element).find("h2").text().trim();
                result.url = 'https://www.nytimes.com/' + $(element).find("a").attr("href");
                result.summary = $(element).find("p").text().trim();

                if (result.headline !== '' && result.summary !== '') {
                    db.Article.findOne({ headline: result.headline }, function (err, data) {
                        if (err) {
                            console.log(err)
                        } else {
                            if (data === null) {
                                db.Article.create(result)
                                    .then(function (dbArticle) {
                                        console.log(dbArticle)
                                    })
                                    .catch(function (err) {
                                        console.log(err)
                                    });
                            }
                            console.log(data)
                        }
                    });
                }

            });

            res.send("The deed is done!");
        });
    });

    app.get('/saved', function (req, res) {
        db.Article.find({ saved: true }, function (err, data) {
            res.render('savedArticles', { home: false, article: data });
        })
    });

    app.put("/api/save/:id", function (req, res) {
        console.log(req.params.id);
        db.Article.updateOne({ _id: req.params.id }, { $set: { saved: true } }, function (err, result) {
            if (err) {
                console.log(err)
            } else {
                return res.send(true)
            }
        });
    });

    app.post("/api/notes", function (req, res) {
        console.log("inside /api/notes/ " + req.body.noteText)
        db.Note.create({ noteText: req.body.noteText })
            .then(function (dbNote) {
                console.log('dbNote:' + dbNote)
                  return db.Article.findOneAndUpdate({ _id: req.body._headlineId },
                    { $push: { note: dbNote._id } },
                    { new: true })
            })
            .then(function (dbArticle) {
                console.log('dbArticle:' + dbArticle)
                res.json(dbArticle)
            })
            .catch(function (err) {
                res.json(err);
            })
    });

    app.get("/api/notes/:id", function (req, res) {
        db.Article.findOne({ _id: req.params.id })
            .populate("note")
            .then(function (dbArticle) {
                console.log(dbArticle.note)
                res.json(dbArticle.note);
            })
            .catch(function (err) {
                res.json(err);
            })
    });

    app.delete("/api/notes/:id", function (req, res) {
        console.log('reqbody:' + JSON.stringify(req.params.id))
        db.Note.deleteOne({ _id: req.params.id }, function (err, result) {
            if (err) {
                console.log(err)
            } else {
                return res.send(true)
            }
        });
    });

    app.get("/api/deleteSaved/:id", function (req, res) {
        db.Article.deleteOne({ _id: req.params.id }, function (err, result) {
            if (err) {
                console.log(err)
            } else {
                console.log(result)
                res.send(true)
            }
        })
    });

    app.get("/api/clear", function (req, res) {
        db.Article.deleteMany({ saved: false }, function (err, result) {
            if (err) {
                console.log(err)
            } else {
                console.log(result)
                res.send(true)
            }
        })
    });

    app.get("/api/clear/saved", function (req, res) {
        db.Article.deleteMany({ saved: true }, function (err, result) {
            if (err) {
                console.log(err)
            } else {
                console.log(result)
                res.send(true)
            }
        })
    });
//}


app.listen(PORT, function () {
  console.log("Server listening on: http://localhost:" + PORT);
});