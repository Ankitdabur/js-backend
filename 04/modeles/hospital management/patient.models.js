import mongoose from "mongoose"

const patientSchema = new mongoose.Schema({
    name:{
        type : String,
        required:true,
    },

    diagnosedWith:{
        type : String,
        required:true,
    },

    adress:{
        type : String,
        required:true,
    },

    age :{
        type : Number,
        required:true,
    },

    bloodGroup:{
        type : String,
        required:true,
    },
       
    gender:{
        type : String,
        enum : ['f','m','o'],
        required : true,
    },

    admittedIn:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"hospital"
    }
    
},{timestamps:true})

export const Patient = mongoose.model("Patient",patientSchema)