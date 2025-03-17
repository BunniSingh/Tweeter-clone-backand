const express = require('express');
const { createTweet, deleteTweet, likeOrUnlike, getAllTweets, getFollowingTweets } = require('../controllers/tweet.controller');
const tweetRouter = express.Router();



tweetRouter.post("/create", createTweet);
tweetRouter.put("/like/:id", likeOrUnlike);
tweetRouter.get("/getalltweets", getAllTweets);
tweetRouter.get("/getfollowingtweets", getFollowingTweets);
tweetRouter.delete("/delete/:id", deleteTweet);

module.exports = tweetRouter;