const UserModel = require("../models/user.model");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const registerUser = async (req, res, next) => {
    try{
        const {firstName, lastName , userName, email, password} = req.body;

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
        })

        res.json({
            success: true,
            message: "User register successfully"
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
            token: token
        })
        res.json({
            success: true,
            message: "User login successfully",
            token: token
        })
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



module.exports = {
    registerUser,
    loginUser,
    logoutUser
}