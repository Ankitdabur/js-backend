import mongoose from "mongoose";
import { Video } from "./video.models";
import User from "./user.models";
const playlistSchema = new mongoose.Schema({
     
    name : {
        type : String,
        required : true,
    },

    description : {
        type : String,
        required : true
    },

    videos : [{
        type : mongoose.Schema.Types.ObjectId,
        ref : "Video"
    }],

    owner : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "User"
    }

} , 

{timestamps : true}

)

const Playlist = new mongoose.model("Playlist" , playlistSchema)
export default Playlist