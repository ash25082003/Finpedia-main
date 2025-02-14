
//Custom middleware to authenticate user and get user detail


import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken"
import { User } from "../models/user.model.js";

export const verifyJWT = asyncHandler(async(req , res , next)=>{

    try {
        const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer " ,"")
        console.log("token" , token)
    
        if(!token){
            throw new ApiError(401 , "unauthorised access")
        }
    
        const decodedToken = jwt.verify(token , process.env.ACCESS_TOKEN_SECRET)
        console.log
    
        const user = await User.findById(decodedToken?._id).select("-password -refreshToken")
    
        if(!user){
            throw new ApiError(401, "Invalid Acess Token")
        }
    
        req.user = user  // it is cutom middleware so we need to add field to request
        next()
    } catch (error) {
        throw new ApiError(401 , error?.message || "Invalid acess token")
    }
})
