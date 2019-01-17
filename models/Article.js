const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const ArticleSchema = new Schema({
    title: {
        type: String,
        required: true
    }, 
    link: {
        type: String,
        required: true
    },
    sum: {
        type: String
    }, 
    
    save: {
        type: Boolean,
        default: false
    },

    note : {
        type: Schema.Types.ObjectId,
        ref: "Note"
    }
})

const Article = mongoos.model('Article', ArticleSchema)

module.exports = Article;