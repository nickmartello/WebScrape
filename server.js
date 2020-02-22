const express = require("express");
const exphbs = require("express-handlebars");
const logger = require("morgan");
const mongoose = require("mongoose");

const db = require("./models");

const PORT = process.env.PORT || 3000;
const app = express();

app.use(logger("dev"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));

app.engine(
  "handlebars",
  exphbs({
    defaultLayout: "main"
  })
);
app.set("view engine", "handlebars");

// Routes

require("./routes/apiRoutes")(app);
require("./routes/htmlRoutes")(app);

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/articledb";

mongoose.connect(MONGODB_URI);

// Start the server
app.listen(PORT, function() {
  console.log("App running on port " + PORT + "!");
});

module.exports = app;