import ApiError from "../utils/ApiErrors.js";
import asyncHandler from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken"
import User from "../models/user.models.js";

const verifyJWT = asyncHandler(async (req , _ ,next) => {
    const token = req.cookies?.accessToken ||  req.header("Authorization")?.replace("Bearer ","" )

    if(!token){
        throw new ApiError(401 , "aunthorized request")
    }

    const DecodedToken = jwt.verify(token , process.env.ACESS_TOKEN_SECRET)
    
    const user = await User.findById(DecodedToken?._id)

    if(!user){
        throw new ApiError(401 , "Invalid access token")
    }
    
    req.user = user
    next()
})

export default verifyJWT