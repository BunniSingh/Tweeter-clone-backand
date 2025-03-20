const express = require("express");
const mongoose = require("mongoose");
const cookie_parser = require("cookie-parser");
const cors = require("cors");
const userRouter = require("./routes/user.route");
const dataBaseConnection = require("./config/mongoDB");
const tweetRouter = require("./routes/tweet.route");
const authMiddleware = require("./middlewares/authMiddleware");
require("dotenv").config();

const app = express();
const port = process.env.PORT || 8080;

dataBaseConnection();

const allowedOrigins = [
  "http://localhost:5173", // Local frontend (adjust port if needed)
  "https://tweeter-clone-frontend-ochre.vercel.app", // Your Vercel frontend
];

//middlewares
app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  })
);
app.use(cookie_parser());
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

//routes
app.use("/api/v1/user", userRouter);
app.use("/api/v1/tweet", authMiddleware, tweetRouter);

app.listen(port, () => console.log("Server started on port:", port));
