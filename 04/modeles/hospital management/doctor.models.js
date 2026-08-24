import mongoose from "mongoose"

const doctorSchema = new mongoose.Schema({
    name: {
      type: String,
      required: true,
    },
    salary: {
      type: String,
      required: true,
    },
    qualification: {
      type: String,
      required: true,
    },
    experienceInYears: {
      type: Number,
      defaut: 0,
    },
    worksInHospitals:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"hospital"
        }
    ]
},{timestamps:true})

export const doctor = mongoose.model("doctor",doctorSchema)