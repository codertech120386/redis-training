const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  first_name: String,
  last_name: String,
  email: String,
  gender: String,
  ip_address: String,
  age: Number,
});

const User = mongoose.model("user", userSchema);

module.exports = User;
