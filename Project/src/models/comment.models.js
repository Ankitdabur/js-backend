import mongoose from "mongoose"
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2"
import { Video } from "./video.models"
import User from "./user.models"

const commentSchema = new mongoose.Schema({
   
    content : {
      type : String,
      required : true
    },

    video : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "Video"
    },

    owner : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "User"
    }
} , 
{timestamps : true}
)

const Comment = mongoose.model("Comment" , commentSchema)
export default Comment 