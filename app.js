//jshint esversion:6
require("dotenv").config();
const express = require("express");
const ejs = require("ejs");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const encrypt = require("mongoose-encryption");

const app = express();

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

///////////////////////////////////////////// DBConnect /////////////////////////////////////////////
mongoose.connect(process.env.DB_LINK, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true});

///////////////////////////////////////////// DBConnect END /////////////////////////////////////////

// Schema 
const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [1, "Email cannot be null."],
    unique: [1, "Email already exists."],
    dropDups: [1, "Duplicate email not allowed"]
  },
  password: {
    type: String,
    required: [1, "Password cannot be null."],
    min: 8,
    max: 20
  }
});
userSchema.plugin(encrypt, { secret: process.env.SECRET, encryptedFields: ["password"] });

// Model
const User = mongoose.model("User", userSchema);

// Routes
app.route("/").get(function(req, res) {
  res.render("home");
});

app.route("/login").get(function(req, res) {
  res.render("login");
}).post(function(req, res) {
  User.findOne({email: req.body.username}, function(err, result) {
    if(!err) {
      if(result) {
        if(result.password === req.body.password) {
          res.redirect("/secrets");
        } else {
          res.send("Incorrect password.");
        }
      } else {
        res.send("User associated with the email is not found.");
      }
    } else {
      console.log("Login failed. (server returned error message)");
      // res.render("/login", {
      //   msg: "Incorrect login information."
      // });
    }
  });
});

app.route("/register").get(function(req, res) {
  res.render("register");
}).post(function(req, res) {
  const user = new User({email: req.body.username, password: req.body.password});
  user.save(function(err){
    if(!err) {
      res.render("register", {
        msg: "Registration successful."
      });
    } else {
      res.render("register", {
        msg: "Registration failed."
      });
    }
  });
});

app.route("/secrets")
.get(function(req, res) {
  res.render("secrets");
});





app.listen(3000, function() {
  console.log("Server started successfully on port: 3000");
});