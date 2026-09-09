import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiErrors.js"
import User from "../models/user.models.js"
import uploadOnCloudinary from "../utils/cloudinary.js"
import ApiResponse from "../utils/ApiResponse.js";
import jwt from "jsonwebtoken"
import mongoose from "mongoose";


const registerUser = asyncHandler( async (req , res) => {
    //   res.status(200).json({
    //     message : "ok"
    //   })

    // get user details from frontend
    // validation - kahin kuch empty toh nhi
    // check if user already exist - by email , username
    // check for images , avatar (required fields)
    // upload on cloudinary , chech avtar is stored in cloudinary successfully
    // create user object , create entry in db
    // remove password , refresh token from response received from db
    // check for user creation , response should not be null
    // return response

    //taking details
    const {fullname , email , username , password} = req.body
    // console.log(email,password)
    // console.log(req.body)
    
    //validation
    if( [fullname , email , username , password].some((field) => 
         field?.trim() === "",)
    ){
        throw new ApiError(400 , "All fields are required")
    } 
    
    //user already exist?
    const existedUser = await User.findOne({
        $or : [{email} , {username}]
    })

    if(existedUser){
        throw new ApiError(409,"User with email or password already exist")
    }

    //check for image and avatar
    const avatarLocalPath = req.files?.avatar?.[0]?.path
    const coverImageLocalPath = req.files?.coverImage?.[0]?.path
    // console.log(req.files)

    if(!avatarLocalPath){
        throw new ApiError(400 , "avatar file is required")
    }

    // upload on cloudinary and check avatar
    const avatar = await uploadOnCloudinary(avatarLocalPath)
    const coverImage = await uploadOnCloudinary(coverImageLocalPath)
  
    // console.log(avatar)

    if(!avatar){
        throw new ApiError(400 , "avatar file is required")
    }

    // create user object - create entry in db
    const user = await User.create({
        fullname,
        avatar : avatar.url,
        coverImage : coverImage?.url || "",
        password,
        email,
        username : username.toLowerCase()
    })

   const createdUser = await User.findById(user._id).select(
    "-password -refreshToken"
   )

   // check for user creation
   if(!createdUser){
    throw new ApiError(500 , "Something went wrong while registering the user")
   }

   // return response
   return res.status(201).json(
     new ApiResponse(200 , createdUser , "User created successfully")
   )

})

const generateAccessAndRefreshToken = async (userId) => {
   try{ 
    const user = await User.findById(userId)
    const accessToken = user.generateAccessToken()
    const refreshToken = user.generateRefreshToken()

    user.refreshToken = refreshToken
    await user.save({validateBeforeSave : false})

    return {accessToken , refreshToken}
   }
   catch(error){
    throw new ApiError(500 , error)
   }
}

const UserLogin = asyncHandler( async (req,res) => {

    // req.body -> data
    // check for email and username
    // check does already user exist
    // check password
    // access token and refresh token
    // set cookie
    // send response

    //req.body -> data

    const {username , email , password} = req.body

    //check for email and username

    if(!(username || email)){
        throw new ApiError(400 ,"username of email is required")
    }

    //user already exist 

    const user = await User.findOne({
        $or : [{username} , {email}]
    })

    if(!user){
        throw ApiError(404,"user does not exist")
    }

    // check password
    const isPassworValid = await user.isPasswordCorrect(password)

    if(!isPassworValid){
        throw new ApiError(401 ,"password is incorrect")
    }

    //acess token and refresh token
    const {accessToken , refreshToken} = await generateAccessAndRefreshToken(user._id)

    const loggedInUser =await  User.findById(user._id).select("-password -refreshToken")
    
    //send cookie

    const options = {
        httpOnly : true,
        secure : true
    }

    return res
    .status(201)
    .cookie("refreshToken" , refreshToken , options)
    .cookie("accessToken" , accessToken , options)
    .json(
        new ApiResponse( 200 , {
            "user" : loggedInUser , 
            refreshToken : refreshToken , 
            accessToken : accessToken
        }, "User logged in successfully")
    )
})

const logoutUser = asyncHandler (async (req , res) => {
    
    //delete access token from db
     await User.findByIdAndUpdate( req.user._id , 
        {
          $unset : {
            refreshToken : 1
          }  
        } , 
        {
            new : true
        })

    // clear cookie 

    const options = {
        httpOnly : true,
        secure : true
    }

    return res
    .status(200)
    .clearCookie("accessToken" , options)
    .clearCookie("refreshToken" , options)
    .json( new ApiResponse(200 , {} , "user logout successfully"))
})

const refreshAccessToken = asyncHandler( async ( req , res ) => {
    
    const incomingRefreshToken =  req.cookies?.refreshToken || req.body?.refreshToken

    if(!incomingRefreshToken){
        throw new ApiError(401 , "unthorized request")
    }

    const decodedtoken = jwt.verify(incomingRefreshToken , process.env.REFRESH_TOKEN_SECRET)
     
    const user = await User.findById(decodedtoken?._id)

    if(!user){
        throw new ApiError(401 , "invalid referesh token")
    }
    

    if(user.refreshToken !== incomingRefreshToken){
        throw new ApiError(401 , "refresh token expired or used")
    }


    const {accessToken , refreshToken : newrefreshToken} = await generateAccessAndRefreshToken(user._id)

    const options = {
        httpOnly :true , 
        secure : true
    }

    return res
    .status(200)
    .cookie("accessToken" , accessToken , options)
    .cookie("refreshToken" , newrefreshToken , options)
    .json( 
        new ApiResponse(
            200 , {
                "accessToken" : accessToken,
                "refreshToken" : newrefreshToken
            },
            "Access token refreshed"
        ))
})

const changeCurrentPassword = asyncHandler( async (req, res) => {

    const {oldPassword , newPassword} = req.body
     
    const user = await User.findById(req.user._id)
    const isPasswordCorrect = await user.isPasswordCorrect(oldPassword)

    if(!isPasswordCorrect){
        throw new ApiError(400,"invalid Password")
    }

    user.password = newPassword
    await user.save({validateBeforeSave : false})

    return res
    .status(200)
    .json(new ApiResponse(200 , {} ,"password changed successfully"))

})

const getUserDetail = asyncHandler (async (req, res) => {
    const getuser = await User.findById(req.user._id).select("-password -refreshToken")
    

    return res
    .status(200)
    .json(new ApiResponse (200 , getuser , "current user feteched successfully"))
})

const updateAccountDetail = asyncHandler (async (req , res) => {
    const {email , fullname} = req.body

    if(!(email && fullname)){
        throw new ApiError(400 , "all fields required")
    }

    const user = await User.findByIdAndUpdate(
        req.user._id , 
        {
            $set : {
                email,
                fullname
            }
        } ,{
            new : true
        }
    ).select("-password")

    return res
    .status(200)
    .json(new ApiResponse(200 , user , "user detail updated successfully"))
})

const updateUserAvatar = asyncHandler(async (req , res) => {
    const avatarLocalPath = req.file?.path

    if(! avatarLocalPath){
        throw new ApiError(400 , "avatar file is missing")
    }

    const avatar = await uploadOnCloudinary(avatarLocalPath)

    if(!avatar.url){
        throw new ApiError(400 , "error while uploading avatar on cloudinary")
    }

    const user = await User.findByIdAndUpdate(
        req.user._id , {
            $set : {
                avatar : avatar.url
            }
        } , {
            new : true
        }
    ).select("-passoword")

    return  res
    .status(200)
    .json(new ApiResponse(200 , user , "avatar image updated successfully"))
})

const updateUsercoverImage = asyncHandler(async (req , res) => {
    const coverImageLocalPath = req.file?.path

    if(! coverImageLocalPath){
        throw new ApiError(400 , "cover Image file is missing")
    }

    const coverImage = await uploadOnCloudinary(coverImageLocalPath)

    if(!coverImage.url){
        throw new ApiError(400 , "error while uploading coverImage on cloudinary")
    }

    const user = await User.findByIdAndUpdate(
        req.user._id , {
            $set : {
                coverImage : coverImage.url
            }
        } , {
            new : true
        }
    ).select("-passoword")

    return  res
    .status(200)
    .json(new ApiResponse(200 , user , "coverImage  updated successfully"))
})

const getUserChannelProfile = asyncHandler( async (req , res) => {
      const {username} = req.params

      if(! username?.trim()){
        throw new ApiError(400 , "username is missing")
      }

      const channel = await User.aggregate([
        {
            $match : {
                username : username?.toLowerCase()
            }
        },
        {
            $lookup : {
                from : "subscriptions",
                localField : "_id",
                foreignField : "channel",
                as : "subscribers"
            }
        },
        {
            $lookup : {
                from : "subscriptions",
                localField : "_id",
                foreignField : "subscriber",
                as : "subscribedTo"
            }
        },
        {
            $addFields:{
                subscribersCount : {
                    $size : "$subscribers"
                },
                channelSubscribedToCount : {
                    $size : "$subscribedTo"
                },
                isSubscribed :{
                    $cond : {
                        if : { $in : [req.user?._id , "$subscribers.subscriber"]},
                        then : true,
                        else : false
                    }
                }

            }
        },
        {
            $project : {
                fullname:1,
                username:1,
                subscribersCount:1,
                channelSubscribedToCount:1,
                isSubscribed:1,
                avatar:1,
                coverImage:1,
                email:1,
            }
        }
      ])

      if(! channel.length){
        throw new ApiError(400 , "channel not found")
      }
       
      return res
      .status(200)
      .json(new ApiResponse(200 , channel[0] ,"user channel fetched successfully"))

    })

const getWatchHistory = asyncHandler( async ( req , res ) => {

const user = await User.aggregate([
    {
       $match : {
        _id : req.user._id
       }
    },
    {
            $lookup: {
                from: "videos",
                localField: "watchHistory",
                foreignField: "_id",
                as: "watchHistory",
                pipeline: [
                    {
                        $lookup: {
                            from: "users",
                            localField: "owner",
                            foreignField: "_id",
                            as: "owner",
                            pipeline: [
                                {
                                    $project: {
                                        fullName: 1,
                                        username: 1,
                                        avatar: 1
                                    }
                                }
                            ]
                        }
                    },
                    {
                        $addFields:{
                            owner:{
                                $first: "$owner"
                            }
                        }
                    }
                ]
            }
        }

])

        return res
         .status(200)
         .json( new ApiResponse(200 , user[0].watchHistory , "user watch history fetched successfully"))

})



export  {
    registerUser ,
    UserLogin ,
    logoutUser ,
    refreshAccessToken,
    changeCurrentPassword,
    getUserDetail,
    updateAccountDetail,
    updateUserAvatar,
    updateUsercoverImage,
    getUserChannelProfile,
    getWatchHistory

}