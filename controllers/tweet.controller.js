const { models } = require("mongoose");
const TweetsModel = require("../models/tweet.model");
const UserModel = require("../models/user.model");


const createTweet = async (req, res, next) => {
    try{
        const loggedInUserId = req.userId;
        const {description} = req.body;
        const postImageUrl = req.file ? req.file.path : undefined;


        if(!description){
            return res.status(401).json({
                success: false,
                messege: "All fields are required",
            })
        }

        await TweetsModel.create({
            description,
            userId: loggedInUserId,
            postImageUrl
        })

        res.json({
            success: true,
            message: "Tweet created successfully"
        })

    }catch(err){
        return res.status(400).json({
            success: false,
            messege: "catch block",
            error: err.message
        })
    }
}   

const likeOrUnlike = async (req, res, next) => {
    try{
        
        const loggedInUserId = req.userId;
        const tweetId = req.params.id;

        if(!tweetId){
            return res.status(401).json({
                success: false,
                messege: "Invalid id",
            })
        }
        
        let tweet = await TweetsModel.findById(tweetId);

        if(tweet.like.includes(loggedInUserId)){
            //dislike
            await TweetsModel.findByIdAndUpdate(tweetId, {
                $pull: {
                    like: loggedInUserId
                }
            })

            res.json({
                success: true,
                message: "Tweet dislike successfully"
            })
    
        }else{
            //like
            await TweetsModel.findByIdAndUpdate(tweetId, {
                $push: {
                    like: loggedInUserId
                }
            })
            res.json({
                success: true,
                message: "Tweet like successfully"
            })
    
        }
        
        
    }catch(err){
        return res.status(400).json({
            success: false,
            messege: "catch block",
            error: err.message
        })
    }
}   


const deleteTweet = async (req, res, next) => {
    try{
        
        const id = req.params.id;

        let tweet = await TweetsModel.findById(id);
        if(!tweet){
            return res.status(401).json({
                success: false,
                messege: "Invalid id",
            })
        }
        await TweetsModel.findByIdAndDelete(id);

        res.json({
            success: true,
            message: "Tweet deleted successfully"
        })

    }catch(err){
        return res.status(400).json({
            success: false,
            messege: "catch block",
            error: err.message
        })
    }
}   



const getAllTweets = async (req, res, next) =>{
    try {
        let loggedInUserId = req.userId;
        const user = await UserModel.findById(loggedInUserId);
        const userTwittes = await TweetsModel.find({userId: loggedInUserId}).populate('userId', 'firstName lastName email userName imageUrl')

        const followingPersonsTweets = await Promise.all(user.following.map(personId => {
            return TweetsModel.find({userId: personId}).populate('userId', 'firstName lastName email userName imageUrl');
        }))

        const allTweets = [...userTwittes, ...followingPersonsTweets.flat()].sort((a , b) => {
            return new Date(b.createdAt) - new Date(a.createdAt);
        });


        res.json({
            success: true,
            message: "Get all tweets API",
            tweetLength: allTweets.length,
            result: allTweets
        })
        
    } catch (error) {
        return res.status(400).json({
            success: false,
            messege: "catch block",
            error: error.message
        })
    }
}


const getFollowingTweets = async (req, res, next) =>{
    try {
        let loggedInUserId = req.userId;
        const user = await UserModel.findById(loggedInUserId);
        const followingPersonsTweets = await Promise.all(user.following.map(personId => {
            return TweetsModel.find({userId: personId}).populate('userId', 'firstName lastName email userName imageUrl');
        }))

        const allTweets = followingPersonsTweets.flat().sort((a, b) => {
            return new Date(b.createdAt) - new Date(a.createdAt);
        });

        res.json({
            success: true,
            message: "Get Following tweets API",
            tweetLength: allTweets.length,
            result: allTweets
        })
        
    } catch (error) {
        return res.status(400).json({
            success: false,
            messege: "catch block",
            error: error.message
        })
    }
}

const getBookmarkTweets = async (req, res, next) =>{
    try {
        let loggedInUserId = req.userId;
        const user = await UserModel.findById(loggedInUserId);
        const followingPersonsTweets = await Promise.all(user.bookmarks.map(personId => {
            return TweetsModel.find({_id: personId}).populate('userId', 'firstName lastName email userName imageUrl');
        }))

        const allTweets = followingPersonsTweets.flat().sort((a, b) => {
            return new Date(b.createdAt) - new Date(a.createdAt);
        });

        res.json({
            success: true,
            message: "Get bookmark tweets API",
            tweetLength: allTweets.length,
            result: allTweets
        })
        
    } catch (error) {
        return res.status(400).json({
            success: false,
            messege: "catch block",
            error: error.message
        })
    }
}



const addComment = async (req, res, next) =>{
    try {
        let loggedInUserId = req.userId;
        let {tweetId, comment} = req.body;

        console.log(tweetId, comment)
        let update = await TweetsModel.findByIdAndUpdate(tweetId, {
            $push: {
                comments: {
                    userId: loggedInUserId,
                    comment
                }
            }
        })

        res.json({
            success: true,
            message: "Comment added successfully",
        })
        
    } catch (error) {
        return res.status(400).json({
            success: false,
            messege: "catch block",
            error: error.message
        })
    }
}
const editComment = async (req, res, next) =>{
    try {
        let loggedInUserId = req.userId;
        let {tweetId, comment, commentId} = req.body;

        console.log(tweetId, comment, commentId)
    
        await TweetsModel.updateOne({
            _id: tweetId,
            "comments._id": commentId
        },{
            $set: {
                "comments.$.comment": comment,
            }
        })

        res.json({
            success: true,
            message: "Comment added successfully",
        })
        
    } catch (error) {
        return res.status(400).json({
            success: false,
            messege: "catch block",
            error: error.message
        })
    }
}


const deleteComment = async (req, res, next) =>{
    try {
        let {commentId, tweetId} = req.body;
        let update = await TweetsModel.findByIdAndUpdate(tweetId, {
            $pull: {
                comments: {
                    _id: commentId
                }
            }
        })

        res.json({
            success: true,
            message: "Comment deleted successfully",
        })
        
    } catch (error) {
        return res.status(400).json({
            success: false,
            messege: "catch block",
            error: error.message
        })
    }
}

const getAllCommens = async (req, res, next) => {
    try {
      // let loggedInUserId = req.userId;
      
      let tweetId = req.params.id;
      const tweet = await TweetsModel.findById(tweetId)
        .populate({
          path: 'comments.userId',
          select: 'firstName lastName imageUrl'
        })
        .sort({ 'comments.createdAt': -1 });
  
      if (!tweet) {
        return res.status(404).json({
          success: false,
          message: "Tweet not found",
        });
      }
  
      const allComments = tweet.comments;
  
      res.json({
        success: true,
        message: "Get All comments API",
        tweetLength: allComments.length,
        result: allComments
      });
      
    } catch (error) {
      return res.status(400).json({
        success: false,
        message: "Error in fetching comments",
        error: error.message
      });
    }
  }
  

module.exports = {
    createTweet,
    deleteTweet,
    likeOrUnlike,
    getAllTweets,
    getFollowingTweets,
    getBookmarkTweets,
    addComment,
    getAllCommens,
    deleteComment,
    editComment,

}