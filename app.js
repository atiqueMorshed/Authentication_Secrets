//jshint esversion:6
const express = require("express");
const ejs = require("ejs");
const bodyParser = require("body-parser");

const app = express();

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

app.route("/").get(function(req, res) {
  res.render("home");
});

app.route("/login").get(function(req, res) {
  res.render("login");
});

app.route("/register").get(function(req, res) {
  res.render("register");
});







app.listen(3000, function() {
  console.log("Server started successfully on port: 3000");
});