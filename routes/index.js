const express = require("express");
const passport = require("passport");
const localStrategy = require("passport-local").Strategy;
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

//Login Local Strategy
passport.use(new localStrategy((username, password, done) => {
  User.getUserByUsername(username, (err, user) => {
    if(err){
      console.log(err);
    }
    if(!user) {
      return done(null, false, { message: "No User Found" });
    }

    User.comparePassword(password, user.password, (err, isMatch) => {
      if(err) {
        console.log(err);
      }
      if(isMatch) {
        return done(null, user);
      }else {
        return done(null, false, { message: "Wrong Password" });
      }
    });
    
  });
}));

//Serialize User
passport.serializeUser((user, done) => {
  done(null, user.id);
});

//DeSerialize User
passport.deserializeUser((id, done) => {
  User.getUserById(id, (err, user) => {
    done(err, user);
  });
});

//POST Handle Login Form
router.post("/login", (req, res, next) => {
  const { username,  password } = req.body;

  req.checkBody("username", "Username field is required").notEmpty();
  req.checkBody("password", "Password field is required").notEmpty();

  let errors = req.validationErrors();

  if (errors) {
    res.render("login", { errors: errors });
  } else {
    passport.authenticate("local", {
      successRedirect: "/",
      failureRedirect: "/login",
      failureFlash: true
    })(req, res, next);
  }
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

//GET Logout
router.get("/logout", (req, res) => {
  req.logout();
  req.flash("success_messages", "You have logged out");
  res.redirect("/login");
});

module.exports = router;