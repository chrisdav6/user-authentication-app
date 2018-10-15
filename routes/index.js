const express = require("express");
const router = express.Router();

//GET Homepage
router.get("/", (req, res) => {
  res.render("index");
});

//GET Register Form
router.get("/register", (req, res) => {
  res.render("register");
});

//POST Handle Register Form
router.post("/register", (req, res) => {
  res.send("register");
});

module.exports = router;