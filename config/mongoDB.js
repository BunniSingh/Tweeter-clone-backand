const mongoose = require("mongoose");
require('dotenv').config();

const DB_URI = process.env.DB_CONNECTION_STRING;
const dataBaseConnection = () => {
    mongoose.connect(`${DB_URI}/twitter-database`)
    .then(()=> console.log("DB Connected Successfully"))
    .catch((err) => console.log(err));
}

module.exports = dataBaseConnection;