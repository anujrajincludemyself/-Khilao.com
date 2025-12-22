const mongoose = require("mongoose")

const URL = process.env.CONNECTION_STRING

const connectDB= async()=>{
    await mongoose.connect(URL)
    .then(()=>{
        console.log("CONNECTED");
    })
}

module.exports = connectDB