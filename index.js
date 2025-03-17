const express = require('express');
const mongoose = require('mongoose');
const cookie_parser = require('cookie-parser');
const cors = require('cors');
const userRouter = require('./routes/user.route');
const dataBaseConnection = require('./config/mongoDB');
const tweetRouter = require('./routes/tweet.route');
const authMiddleware = require('./middlewares/authMiddleware');
require('dotenv').config();


const app = express();
const port = process.env.PORT || 8080;

// const DB_URI = process.env.DB_CONNECTION_STRING;
// mongoose.connect(`${DB_URI}/twitter-database`)
// .then(()=> console.log("DB Connected Successfully"))
// .catch((err) => console.log(err));
dataBaseConnection()

//middlewares
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true,
}));
app.use(express.urlencoded({ extended: true }));
app.use(cookie_parser())
app.use(express.json())


//routes
app.use('/api/v1/user', userRouter)
app.use('/api/v1/tweet', authMiddleware, tweetRouter)


app.listen(port, () => console.log("Server started on port:" , port));