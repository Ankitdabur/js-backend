import mongoose from 'mongoose'

const userSchema = new mongoose.Schema(
    {
        username : {
            type : String,
            required : true,
            unique : true,
            lowercase : true,
        },
        email : {
            type : String,
            required : true,
            unique : true,
            lowercase : true,
        },
        password : {
            type : String,
            required : true,
        }
    }
)

export const User = mongoose.model("User",userSchema) //creating model of name User ,userSchema base pr bnaya hai 