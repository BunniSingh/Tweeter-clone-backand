const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      trim: true,
    },
    lastName: {
      type: String,
      default: "NA",
      trim: true,
    },
    userName: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },
    token: {
        type: String,
        default: "NA",
    },
    followers:{
        type: Array,
        default: [],
    },
    following:{
        type: Array,
        default: [],
    },
    bookmarks: {
      type: Array,
      default: [],
    },
  },
  { timestamps: true }
); 

const UserModel = mongoose.model("Users", userSchema);
module.exports = UserModel;
