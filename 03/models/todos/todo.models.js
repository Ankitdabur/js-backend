import mongoose from "mongoose";

const todoSchema = new mongoose.Schema({
   title :{
    type : String,
    required : true,
   },

   complete:{
    type : Boolean,
    default : false,
   },

   createdBy : {
    type : mongoose.Schema.Types.ObjectId,
    ref:"User",
   },

   subtodo:[
    {
    type:mongoose.Schema.Types.ObjectId,
    ref:"subtodo"
    }
   ] //array of sub todos

}, {timestamps : true});

export const todo = mongoose.model("todo",todoSchema);