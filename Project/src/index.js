// import dotenv from "dotenv"

// import mongoose from "mongoose"
// import {DB_NAME from "./constants.js"
// import express from "express"
// const app = express()

// dotenv.config()


/*
;(async ()=> {
    
    try {
     await mongoose.connect(`${process.env.MONGODB_URL}/${DB_NAME}`)
     app.on("error" , (error) => {
        console.log("express baat nhi kr paa raha")
        throw error
     })

     app.listen(process.env.PORT , () => {
        console.log(`server is listning on port ${process.env.PORT}`)
     })
    }
    
    catch(error){
      console.log(error)
      throw error
    }

})()
*/


import dbconnect from "./db/index.js";
import app from "./app.js"

dbconnect()
.then(()=> {
   app.listen(process.env.PORT || 4000 , () => {
      console.log(`server is listening at port : ${process.env.PORT}`)
   })
})
.catch((error) => {
   console.log("db error",error)
})
