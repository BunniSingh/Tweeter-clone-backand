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
    
  },
  { timestamps: true }
); 

const TweetsModel  = mongoose.model("tweets", tweetSchema);
module.exports = TweetsModel;
