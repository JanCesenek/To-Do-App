const mongoose = require("mongoose");

const newItem = new mongoose.Schema({
  _id: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  date: {
    type: String,
    required: true,
  },
  difficulty: {
    type: String,
    lowercase: true,
    required: true,
    enum: ["easy", "medium", "hard"],
  },
  importance: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
});

const Item = mongoose.model("Item", newItem);

module.exports = Item;
