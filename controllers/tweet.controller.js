const { models } = require("mongoose");
const TweetsModel = require("../models/tweet.model");

const createTweet = async (req, res, next) => {
    try{
        const {description, userId} = req.body;

        if(!description || !userId ){
            return res.status(401).json({
                success: false,
                messege: "All fields are required",
            })
        }

        await TweetsModel.create({
            description,
            userId
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


module.exports = {
    createTweet,
    deleteTweet,

}