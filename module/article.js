var mongoose = require("mongoose");


var Schema = mongoose.Schema;


var Articles = new Schema({
    title: {
        type: String,

    },
    summary: {
        type: String,

    },
    notes: [{
        type: Schema.Types.ObjectId,
        ref: "AddNotes"
    }]

});

var Articles = mongoose.model("Article", Articles);


module.exports = Articles;