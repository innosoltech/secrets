// The dotenv is an npm package that provides us a safe environment for keeping our secretKeys. We configure (set it up) to be able to access our secretKeys from the dotenv file, by calling ".config" on the dotenv
require("dotenv").config();

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const encrypt = require("mongoose-encryption");

const app = express();

app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/secretsDB");

// This schema is a mongoose-type schema
const userSchema = new mongoose.Schema({
  email: String,
  password: String,
});

// secretKey is used during the process of encryption and decryption of fields such as passwords. "secretKey" is stored in a safe environment (.env file) as "SECRET".
// The way the secretKey is stored in dotenv follows the convention specified by dotenv.
const secretKey = process.env.SECRET; // "process.env.SECRET" means, Process the Secret stored in the ".env" file.

// The encrypt plugin, is plugged (added) to the userSchema, so that the necessary fields of the schema are encrpted and parsed into the database
userSchema.plugin(encrypt, {
  secret: secretKey,
  encryptedFields: ["password"],
});

// model for article, based on the articleSchema
const SecretUser = mongoose.model("User", userSchema); // line of code creates/connects to the "articles" collection, in the "wikiDB"

app.get("/", function (req, res) {
  res.render("home");
});

app.get("/login", function (req, res) {
  res.render("login");
});

app.get("/register", function (req, res) {
  res.render("register");
});

// ============================== HANDLING OF ALL POST REQUEST STARTS ============================== //
app.post("/register", function (req, res) {
  const newUser = new SecretUser({
    email: req.body.username,
    password: req.body.password,
  });

  newUser.save(function (err) {
    if (err) {
      reconsole.log(err);
    } else {
      res.render("secrets");
    }
  });
});

app.post("/login", function (req, res) {
  const userName = req.body.username;
  const userPassword = req.body.password;

  SecretUser.findOne({ email: userName }, function (err, foundUser) {
    if (err) {
      console.log(err);
    } else {
      if (foundUser.password === userPassword) {
        res.render("secrets");
        console.log(req.body.password);
      }
    }
  });
});
// ============================== HANDLING OF ALL POST REQUEST STARTS ============================== //

app.listen(3000, function () {
  console.log("Server is running on port 3000.");
});
