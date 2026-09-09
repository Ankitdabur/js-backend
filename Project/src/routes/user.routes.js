 import {Router} from "express"
import {registerUser} from "../controllers/user.controller.js"
import  upload  from "../middlewares/multer.middleware.js"
import {UserLogin} from "../controllers/user.controller.js"
import {logoutUser} from "../controllers/user.controller.js"
import verifyJWT from "../middlewares/auth.middleware.js"
import { refreshAccessToken } from "../controllers/user.controller.js"
import { changeCurrentPassword,getUserDetail,updateAccountDetail,updateUserAvatar,
    updateUsercoverImage , getUserChannelProfile,getWatchHistory} from "../controllers/user.controller.js"

const router = Router()

    router.route("/register").post( 
    upload.fields(
        [
           {
            name : "avatar",
            maxCount : 1,
           },
           {
            name : "coverImage",
            maxCount : 1,
           }
        ])
      ,registerUser)
    
    router.route("/login").post(UserLogin)

    //secured routes
    router.route("/logout").post(verifyJWT , logoutUser)
    router.route("/refresh-token").post(refreshAccessToken)
    router.route("/change-password").post(verifyJWT,changeCurrentPassword)
    router.route("/user-detail").get(verifyJWT,getUserDetail)
    router.route("/update-details").patch(verifyJWT,updateAccountDetail)
    router.route("/update-avatar").patch(verifyJWT , upload.single("avatar") ,updateUserAvatar)
    router.route("/update-coverImage").patch (verifyJWT , upload.single("coverImage") ,updateUsercoverImage)
    router.route("/c/:username").get(verifyJWT , getUserChannelProfile)
    router.route("/history").get(verifyJWT,getWatchHistory)

export default router