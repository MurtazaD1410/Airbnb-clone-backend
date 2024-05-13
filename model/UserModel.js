const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  googleId: {
    type: String,
    required: false,
  },
  avatarUrl: {
      type: String,
      required: false,
  },
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: false,
    min: 6,
    max: 1024,
  },
});

const User = mongoose.model("user", userSchema);

module.exports = User;
