const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const mongoose = require("mongoose");

const Field = require("./models/field");
const Item = require("./models/item");
const User = require("./models/user");

mongoose
  .connect("mongodb://127.0.0.1:27017/toDoApp", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("MONGO CONNECTION OPEN!!!");
  })
  .catch((err) => {
    console.log("OH NO MONGO CONNECTION ERROR!!!!");
    console.log(err);
  });

const app = express();

const corsOptions = {
  origin: "*",
};

app.use(cors(corsOptions));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get("/", (req, res) => {
  res.json("WORKING :)");
});

app
  .route("/api/users")
  .get(async (req, res) => {
    const users = await User.find({});
    console.log(users);
    res.json(users);
  })
  .post(async (req, res) => {
    const newUser = new User(req.body);
    await newUser.save();
    console.log(req.body);
    console.log(newUser);
  });

app
  .route("/api/users/:username")
  .get(async (req, res) => {
    const username = req.params.username;
    const user = await User.findOne({ username });
    console.log(user);
    res.json(user);
  })
  .delete(async (req, res) => {
    const username = req.params.username;
    const deletedUser = await User.findOneAndDelete({ username });
    const deletedFields = await Field.deleteMany({ username });
    const deletedItems = await Item.deleteMany({ username });
    console.log(deletedUser);
    console.log(deletedFields);
    console.log(deletedItems);
  });

app
  .route("/api/users/:username/fields")
  .get(async (req, res) => {
    const username = req.params.username;
    const fields = await Field.find({ username });
    console.log(fields);
    res.json(fields);
  })
  .post(async (req, res) => {
    const newField = new Field(req.body);
    await newField.save();
    console.log(req.body);
    console.log(newField);
  });

app
  .route("/api/users/:username/fields/default/items")
  .get(async (req, res) => {
    const items = await Item.find({ category: "Default" });
    console.log(items);
    res.json(items);
  })
  .post(async (req, res) => {
    const newItem = new Item(req.body);
    await newItem.save();
    console.log(req.body);
    console.log(newItem);
  });

app
  .route("/api/users/:username/fields/default/items/:name")
  .get(async (req, res) => {
    const name = req.params.name;
    const item = await Item.findOne({ name });
    console.log(item);
    res.json(item);
  })
  .delete(async (req, res) => {
    const name = req.params.name;
    const deletedItem = await Item.findOneAndDelete({ name });
    console.log(deletedItem);
  });

app
  .route("/api/users/:username/fields/:category")
  .get(async (req, res) => {
    const category = req.params.category;
    const field = await Field.findOne({ category });
    console.log(field);
    res.json(field);
  })
  .put(async (req, res) => {
    const category = req.params.category;
    const updatedField = await Field.findOneAndUpdate({ category }, req.body);
    console.log(updatedField);
  })
  .delete(async (req, res) => {
    const category = req.params.category;
    const deletedField = await Field.findOneAndDelete({ category });
    const deletedItems = await Item.deleteMany({ category });
    console.log(deletedField);
    console.log(deletedItems);
  });

app
  .route("/api/users/:username/fields/:category/items")
  .get(async (req, res) => {
    const category = req.params.category;
    const items = await Item.find({ category });
    console.log(items);
    res.json(items);
  })
  .post(async (req, res) => {
    const newItem = new Item(req.body);
    await newItem.save();
    console.log(req.body);
    console.log(newItem);
  });

app
  .route("/api/users/:username/fields/:category/items/:name")
  .get(async (req, res) => {
    const name = req.params.name;
    const item = await Item.findOne({ name });
    console.log(item);
    res.json(item);
  })
  .delete(async (req, res) => {
    const name = req.params.name;
    const deletedItem = await Item.findOneAndDelete({ name });
    console.log(deletedItem);
  });

const port = 5000;

app.listen(port, () => `Server running on port ${port}`);
