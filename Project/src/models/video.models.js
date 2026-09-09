import mongoose from "mongoose"
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2"

const VideoSchema = new mongoose.Schema(
    {
        videoFile : {
            type : String, //cloudinary url
            required : true,
        },

        thumbnail : {
            type : String, //cloudinary url
            required : true,
        },

        title : {
            type : String, 
            required : true,
        },

        description : {
            type : String, 
            required : true,
        },

        duration : {
            type : Number,  //cloudinary se aayega ye bhi
            required : true
        },

        views : {
            type : String,
            default : 0
        },

        isPublished : {
            type : Boolean,
            default: true,
        },

        owner : {
            type : mongoose.Schema.Types.ObjectId,
            ref : "User"
        }

    },
    {
        timestamps : true
    }
)

VideoSchema.plugin(mongooseAggregatePaginate)
export const Video = mongoose.model("Video" , VideoSchema)