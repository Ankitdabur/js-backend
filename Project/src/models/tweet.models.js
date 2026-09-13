import mongoose from "mongoose";
import User from "./user.models";

const tweetSchema = new mongoose.Schema( { 
    
    content : { 
        type : String,
        required : true
    },

    owner : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "User"
    }
} , 
{timestamps : true}
)

const Tweet = mongoose.model("Tweet" , tweetSchema)
export default Tweet