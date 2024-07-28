const mongoose = require("mongoose");

// Connect to MongoDB
mongoose.connect("mongodb://localhost:27017/Project-1");

// Create userSchema
let userSchema = mongoose.Schema({
  name: String,
  userName: String,
  age: Number,
  email: String,
  password: String,
  profilePic: {
    type: String,
    default: "default_profile.png",
  },
  posts: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "post",
    },
  ],
});

module.exports = mongoose.model("user", userSchema);
