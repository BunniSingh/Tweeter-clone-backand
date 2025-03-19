const { models } = require("mongoose");
const TweetsModel = require("../models/tweet.model");
const UserModel = require("../models/user.model");


const createTweet = async (req, res, next) => {
    try{
        const loggedInUserId = req.userId;
        const {description} = req.body;

        if(!description){
            return res.status(401).json({
                success: false,
                messege: "All fields are required",
            })
        }

        await TweetsModel.create({
            description,
            userId: loggedInUserId,
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

module.exports = {
    createTweet,
    deleteTweet,
    likeOrUnlike,
    getAllTweets,
    getFollowingTweets,
    getBookmarkTweets,

}