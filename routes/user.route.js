const express = require('express');
const { registerUser, loginUser, logoutUser, bookmarksTweet, getUserProfile, getOtherUsers, followOrUnfollow } = require('../controllers/user.controller');
const authMiddleware = require('../middlewares/authMiddleware');
const upload = require('../middlewares/cloudinaryConfig');
const userRouter = express.Router();



userRouter.post(
    "/register",
    (req, res, next) => {
      console.log("Before multer");
      next();
    },
    upload.single("profileImage"),
    (req, res, next) => {
      console.log("After multer");
      console.log("File:", req.file);
      console.log("Body:", req.body);
      next();
    },
    registerUser
  );


// userRouter.post("/register",upload.single("profileImage"), registerUser);
userRouter.post("/login", loginUser);
userRouter.get("/logout", authMiddleware, logoutUser);
userRouter.put("/bookmark/:id", authMiddleware, bookmarksTweet);
userRouter.get("/profiledetails/:id", authMiddleware, getUserProfile);
userRouter.get("/otherusers", authMiddleware, getOtherUsers);
userRouter.put("/follow/:id", authMiddleware, followOrUnfollow);

module.exports = userRouter;