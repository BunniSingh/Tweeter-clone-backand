const express = require('express');
const { createTweet, deleteTweet } = require('../controllers/tweet.controller');
const tweetRouter = express.Router();



tweetRouter.post("/create", createTweet);
tweetRouter.delete("/delete/:id", deleteTweet);

module.exports = tweetRouter;