const express = require("express");
const path = require("path");
const expressValidator = require('express-validator');
const flash = require("connect-flash");
const session = require("express-session");
const passport = require("passport");
const mongoose = require("mongoose");
const app = express();
const port = process.env.PORT || '3000';

const index = require("./routes/index");
const users = require("./routes/users");

//Body Parser
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

//Setup Static Folders
app.use(express.static(path.join(__dirname, "public")));
app.use(express.static(path.join(__dirname, "views")));
app.use(express.static(path.join(__dirname, "node_modules")));

//Set EJS as viewengine
app.set("view engine", "ejs");

//Express Session
app.use(session({
  secret: "secret",
  saveUninitialized: true,
  resave: true
}));

//Passport
app.use(passport.initialize());
app.use(passport.session());

//Express Messages
app.use(flash());
app.use(function (req, res, next) {
  res.locals.success_messages = req.flash('success_messages');
  res.locals.error_messages = req.flash('error_messages');
  next();
});

//Express Validator
app.use(expressValidator({
  errorFormatter: (param, msg, value) => {
    let namespace = param.split('.')
      , root = namespace.shift()
      , formParam = root;

    while (namespace.length) {
      formParam += '[' + namespace.shift() + ']';
    }
    return {
      param: formParam,
      msg: msg,
      value: value
    };
  }
}));

//Routes
app.use("/", index);
app.use("/users", users);

//Start Server
app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});

