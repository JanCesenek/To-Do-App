const mongoose = require("mongoose");

const newField = new mongoose.Schema({
  _id: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    required: true,
  },
});

const Field = mongoose.model("Field", newField);

module.exports = Field;
