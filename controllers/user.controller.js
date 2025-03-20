
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const UserModel = require('../models/user.model');
require('dotenv').config();

const registerUser = async (req, res, next) => {
    try{
        console.log("BODY:", req.body);
        console.log("FILE:", req.file);
        const {firstName, lastName , userName, email, password} = req.body;
        const imageUrl = req.file ? req.file.path : undefined;

        if(!firstName || !userName || !email || !password){
            return res.status(401).json({
                success: false,
                message: "All fields are required",
            })
        }

        const user = await UserModel.findOne({email: email});
        if(user){
            return res.status(401).json({
                success: false,
                message: "User already exist",
            })
        }

        const hashPassword = await bcrypt.hash(password, 10);

        await UserModel.create({
            firstName,
            lastName,
            userName,
            password: hashPassword,
            email,
            imageUrl
        })

        res.json({
            success: true,
            message: "User signed up successfully!"
        })
    }catch(err){
        return res.status(400).json({
            success: false,
            message: "Catch block error",
            error: err.message
        })
    }
}


const loginUser = async (req, res, next) => {
    try{
        const {email, password} = req.body;

        if(!email || !password){
            return res.status(401).json({
                success: false,
                message: "All fields are required"
            })
        }

        const user = await UserModel.findOne({email: email});
        if(!user){
            return res.status(401).json({
                success: false,
                message: "User does not exiest with this email",
            })
        }

        const isPasswordMatch = await bcrypt.compare(password, user.password);
        if(!isPasswordMatch){
            return res.status(401).json({
                success: false,
                message: "Incroct email or password",
            }) 
        }

        // let currentTimeInSec = parseInt(Date.now()/1000);
        // let tockenObj = {
        //     iat: currentTimeInSec,
        //     exp: currentTimeInSec + 3600,
        //     id: user._id  
        // }
        const token = jwt.sign({id: user._id}, process.env.JWT_KEY, {expiresIn: "1d"});
        
        await UserModel.findByIdAndUpdate(user._id, {token})
        
        return res.status(201).cookie('token', token, {expiresIn: "1d", httpOnly: true}).json({
            success: true,
            message: "User login successfully",
            user
        })
        // res.json({
        //     success: true,
        //     message: "User login successfully",
        //     token: token
        // })
    }catch(err){
        return res.status(400).json({
            success: false,
            message: "Catch block error",
            error: err.message
        })
    }
}


const logoutUser = async (req, res) =>{
    // res.json({
    //     success: true,
    //     message: "User logout successfully"
    // })
    return res.status(201).cookie('token' , "" , {expaireIn: new Date(Date.now())}).json({
        success: true,
        message: "User logged out successfully",
    })
}


const bookmarksTweet = async (req, res, next) => {
    try{  
        const loggedInUserId = req.userId;
        const tweetId = req.params.id;

        if(!loggedInUserId || !tweetId){
            return res.status(401).json({
                success: false,
                messege: "Invalid id",
            })
        }
        
        const user = await UserModel.findById(loggedInUserId);

        if(user.bookmarks.includes(tweetId)){
            //remove bookmarks
            await UserModel.findByIdAndUpdate(loggedInUserId, {
                $pull: {
                    bookmarks: tweetId
                }
            })

            res.json({
                success: true,
                message: "Tweet remove as a bookmark successfully"
            })
    
        }else{
            //like
            await UserModel.findByIdAndUpdate(loggedInUserId, {
                $push: {
                    bookmarks: tweetId
                }
            })
            res.json({
                success: true,
                message: "Tweet save as bookmark successfully"
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


const getUserProfile = async (req, res, next) => {
    try{  
        const id = req.params.id;
        const user = await UserModel.findById(id).select('-password');
        res.json({
            success: true,
            message: "user details sent successfully",
            user,
        })
        
    }catch(err){
        return res.status(400).json({
            success: false,
            messege: "catch block",
            error: err.message
        })
    }
}  

const getOtherUsers = async (req, res, next) => {
    try{  
        const loggedInUserId = req.userId;
        const users = await UserModel.find({
            _id: {
                $ne: loggedInUserId
            }
        }).select('-password');

        if(!users){
            return res.status(401).json({
                success:false,
                message: "Currently oteher user does not exist"
            })
        }

        res.json({
            success: true,
            message: "user details sent successfully",
            length: users.length,
            users ,
        })
        
    }catch(err){
        return res.status(400).json({
            success: false,
            messege: "catch block",
            error: err.message
        })
    }
}  

const followOrUnfollow = async (req, res, next) => {
    try{
        const loggedInUserId = req.userId;
        const personId = req.params.id;
        const loggedUserDetails = await UserModel.findById(loggedInUserId);
        const personToFollowDetails = await UserModel.findById(personId);

        if(personToFollowDetails.followers.includes(loggedInUserId)){
            //Unfollow 
            await personToFollowDetails.updateOne({
                $pull:{
                    followers: loggedInUserId,
                }
            })
            await loggedUserDetails.updateOne({
                $pull:{
                    following: personId,
                }
            })

            return res.json({
                success: true,
                message: `${loggedUserDetails.firstName} unfollow the ${personToFollowDetails.firstName}`,
            })

        }else{
            //Follow
            await personToFollowDetails.updateOne({
                $push:{
                    followers: loggedInUserId,
                }
            })
            await loggedUserDetails.updateOne({
                $push:{
                    following: personId,
                }
            })

            return res.json({
                success: true,
                message: `${loggedUserDetails.firstName} follow the ${personToFollowDetails.firstName}`,
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


module.exports = {
    registerUser,
    loginUser,
    logoutUser,
    bookmarksTweet,
    getUserProfile,
    getOtherUsers,
    followOrUnfollow,
}