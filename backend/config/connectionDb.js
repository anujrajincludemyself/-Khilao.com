const mongoose = require("mongoose")

const URL = process.env.CONNECTION_STRING

const connectDB= async()=>{
    try {
        await mongoose.connect(URL, {
            // Connection pool optimization
            maxPoolSize: 10,
            minPoolSize: 2,
            serverSelectionTimeoutMS: 5000,
            socketTimeoutMS: 45000,
        })
        console.log("✅ CONNECTED TO DATABASE");
    } catch(error) {
        console.error("❌ Database connection failed:", error)
        process.exit(1)
    }
}

module.exports = connectDB