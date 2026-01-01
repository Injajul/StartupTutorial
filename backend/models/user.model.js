import mongoose from "mongoose"

const userSchema = new mongoose.Schema({
    clerkId:{
        type:String,
        unique:true,
        required:true,
        trim:true
    },
    email:{
        type:String,
    },
    fullName:{
        type:String
    },
    avatarUrl:{
        type:String
    },
    role:{
        type:String,
        enum:["founder","investor"]
    },
    lastActivity:{
        type:Date
    }
},{timestamps:true})

export default mongoose.model("User", userSchema)