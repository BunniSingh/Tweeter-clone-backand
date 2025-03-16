const mongoose = require("mongoose");

const tweetSchema = new mongoose.Schema(
  {
    description: {
      type: String,
      required: true,
      trim: true,
    },
    like: {
      type: Array,
      default: [],
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Users"
    },
    bookmarks: {
      type: Array,
      default: [],
    },
  },
  { timestamps: true }
); 

const TweetsModel  = mongoose.model("tweets", tweetSchema);
module.exports = TweetsModel;
