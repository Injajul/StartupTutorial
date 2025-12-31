import mongoose from "mongoose"

import dotenv from "dotenv"

dotenv.config()

const connectDB = async()=>{
    try {
        await mongoose.connect(process.env.MongodbUrl)
        console.log("Connected to mongoDB")
    } catch (error) {
        console.error("MongoDb connection error:", error)
        process.exit(1)
    }
}

export default connectDB