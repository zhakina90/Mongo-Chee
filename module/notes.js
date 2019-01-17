var mongoose = require("mongoose");


var Schema = mongoose.Schema;


var NoteSchema = new Schema({

    body: String,
});

// This creates our model from the above schema, using mongoose's model method
var Notes = mongoose.model("Notes", NoteSchema);

// Export the Note model
module.exports = Notes;
