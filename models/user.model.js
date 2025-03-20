const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    imageUrl: {
      type: String,
      default: "https://img.freepik.com/free-vector/blue-circle-with-white-user_78370-4707.jpg"
    },
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
      ref:"tweet",
      default: [],
    },
  },
  { timestamps: true }
); 

const UserModel = mongoose.model("User", userSchema);
module.exports = UserModel;
