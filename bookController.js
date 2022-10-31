var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var bookSchema = new Schema({
  title: String,
  category: String,
});

module.exports = mongoose.model("Book", bookSchema);
