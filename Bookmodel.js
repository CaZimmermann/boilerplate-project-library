// Bookmodel.js
const mongoose = require('mongoose');
const { Schema } = mongoose;

// Define the schema for issues
const BookSchema = new Schema({
  title: { type: String, required: true },
  commentcount: { type: Number, default: 0 },
  comments: { type: [String], default: [] }
});

const Book = mongoose.model("Book", BookSchema);


module.exports = { Book };