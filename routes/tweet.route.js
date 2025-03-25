const express = require('express');
const { createTweet, deleteTweet, likeOrUnlike, getAllTweets, getFollowingTweets, getBookmarkTweets, addComment, getAllCommens, deleteComment, editComment } = require('../controllers/tweet.controller');
const upload = require('../middlewares/cloudinaryConfig');
const tweetRouter = express.Router();



tweetRouter.post("/create", upload.single("postImageUrl"), createTweet);
tweetRouter.put("/like/:id", likeOrUnlike);
tweetRouter.get("/getalltweets", getAllTweets);
tweetRouter.get("/getfollowingtweets", getFollowingTweets);
tweetRouter.get("/getbookmarktweets", getBookmarkTweets);
tweetRouter.post("/create/comment", addComment);
tweetRouter.patch("/edit/comment", editComment);
tweetRouter.get("/get/all/comments/:id", getAllCommens);
tweetRouter.delete("/delete/comment", deleteComment);
tweetRouter.delete("/delete/:id", deleteTweet);

module.exports = tweetRouter;