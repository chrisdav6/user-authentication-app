const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const db = "mongodb://chris:chris6@ds045507.mlab.com:45507/passport-login";

//Connect to DB
mongoose.connect(db, () => {
  console.log("Connected to DB");
});

//User Schema
const UserSchema = mongoose.Schema({
  name: {
    type: String
  },
  username: {
    type: String
  },
  email: {
    type: String
  },
  password: {
    type: String
  }
});

const User = module.exports = mongoose.model("User", UserSchema);

module.exports.registerUser = (newUser, callback) => {
  bcrypt.genSalt(10, (err, salt) => {
    bcrypt.hash(newUser.password, salt, (err, hash) => {
      if(err) {
        console.log(err);
      }
      newUser.password = hash;
      newUser.save(callback);
    });
  });
};

module.exports.getUserByUsername = (username, callback) => {
  const query = { username: username };
  User.findOne(query, callback);
};

module.exports.getUserById = (id, callback) => {
  User.findById(id, callback);
};

module.exports.comparePassword = (userPassword, hash, callback) => {
  bcrypt.compare(userPassword, hash, (err, isMatch) => {
    if(err) {
      console.log(err);
    }
    callback(null, isMatch);
  });
};
