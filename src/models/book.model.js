const mongoose = require("mongoose");

//Esquema de los libros.
const bookSchema = new mongoose.Schema({
  title: String,
  author: String,
  genre: String,
  publication_date: String,
});

//Importacion de un modelo de mongoose.
module.exports = mongoose.model("Book", bookSchema);
