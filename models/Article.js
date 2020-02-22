const mongoose = require("mongoose");

let Schema = mongoose.Schema;
let ArticleSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  blurb: {
    type: String,
    required: true
  },
  saved: {
    type: Boolean,
    default: false
  },
  note: {
    type: Schema.Types.ObjectId,
    ref: "Note"
  }
});

let Article = mongoose.model("Article", ArticleSchema);

module.exports = Article;