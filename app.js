const express = require("express");
const path = require("path");
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

//Routes
app.use("/", index);
app.use("/users", users);

//Start Server
app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});

