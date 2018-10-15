const express = require("express");
const router = express.Router();
const User = require("../models/user");

//GET Homepage
router.get("/", (req, res) => {
  res.render("index");
});

//GET Login Form
router.get("/login", (req, res) => {
  res.render("login");
});

//GET Register Form
router.get("/register", (req, res) => {
  res.render("register");
});

//POST Handle Register Form
router.post("/register", (req, res) => {
  const { name, username, email, password, password2 } = req.body;
  
  req.checkBody("name", "Name field is required").notEmpty();
  req.checkBody("email", "Email field is required").notEmpty();
  req.checkBody("email", "Email must be a valid email address").isEmail();
  req.checkBody("username", "Username field is required").notEmpty();
  req.checkBody("password", "Password field is required").notEmpty();
  req.checkBody("password2", "Passwords do not match").equals(password);

  let errors = req.validationErrors();

  if(errors) {
    res.render("register", { errors : errors });
  } else {
    const newUser = new User({
      name: name,
      username: username,
      email: email,
      password: password
    });

    User.registerUser(newUser, (err, user) => {
      if(err) {
        console.log(err);
      }
      req.flash("success_messages", "You are registered and can login!");
      res.redirect("/login");
    });
  }
});

module.exports = router;