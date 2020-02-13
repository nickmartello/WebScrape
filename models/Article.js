let mongoose = require("mongoose");

//refering to the schema instructor
let Schema = mongoose.Schema

//Creating new ariticle schema from the contructor 
let ArticleSchema = new Schema({
    headline: {
        type: String,
        required: true
    },
    // `url` is required and of type String
    url: {
        type: String,
        required: true
    },
    // `summary` is required and of type String
    summary: {
        type: String,
        required: true
    },
    // `save` is required and of type String
    saved: {
        type: Boolean,
        default: false
    },
    // `note` is an object that stores a Note id
    // The ref property links the ObjectId to the Note model
    // This allows us to populate the Article with an associated Note
    note: [{
        type: Schema.Types.ObjectId,
        ref: "Note"
    }]
});

//creates model
let Article = mongoose.model("Article", ArticleSchema);

//exports model
module.exports = Article;