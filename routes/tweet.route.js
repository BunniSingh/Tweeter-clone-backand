const express = require('express');
const { createTweet, deleteTweet, likeOrUnlike, getAllTweets, getFollowingTweets, getBookmarkTweets, addComment, getAllCommens } = require('../controllers/tweet.controller');
const upload = require('../middlewares/cloudinaryConfig');
const tweetRouter = express.Router();



tweetRouter.post("/create", upload.single("postImageUrl"), createTweet);
tweetRouter.put("/like/:id", likeOrUnlike);
tweetRouter.get("/getalltweets", getAllTweets);
tweetRouter.get("/getfollowingtweets", getFollowingTweets);
tweetRouter.get("/getbookmarktweets", getBookmarkTweets);
tweetRouter.post("/create/comment", addComment);
tweetRouter.get("/get/all/comments/:id", getAllCommens);
tweetRouter.delete("/delete/:id", deleteTweet);

module.exports = tweetRouter;