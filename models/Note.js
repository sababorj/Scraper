const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const NoteSchema = new Schema({
    msg: {
        type: String,
        required: true
    }
});

const Note = mongoose.model('Note', NoteSchema);

module.exports = Note;