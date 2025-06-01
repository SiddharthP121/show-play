import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/User.model.js";
import jwt from "jsonwebtoken";

export const verifyJWT = asyncHandler(async (req, _, next) => {
  // The main goal is to take the access token from the user Id which is provided

  try {
    const token =
      req.cookies?.accessToken || // We are these cookies threw user.controller.js which we sent while logging in
      req.header("Authorization")?.replace("Bearer ", "");  //I have a doubt here

    if (!token) {
      throw new ApiError(401, "Unauthorized request");
    }

    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    // if (!decodedToken) {
    //   throw new ApiError(500, "Something went wrong");
    // }

    const user =await User.findById(decodedToken?._id).select(
      "-password -refreshToken"
    ); // finding object by Id

    if (!user) {
      throw new ApiError(401, "Authorization Error");
    }
    req.user = user;
    next();
  } catch (error) {
    throw new ApiError(401, error?.message || "Invalid access token");
  }
});



// import { ApiError } from "../utils/ApiError.js";
// import { asyncHandler } from "../utils/asyncHandler.js";
// import jwt from "jsonwebtoken"
// import { User } from "../models/user.model.js";

// export const verifyJWT = asyncHandler(async(req, _, next) => {
//     try {
//         const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "")
        
//         // console.log(token);
//         if (!token) {
//             throw new ApiError(401, "Unauthorized request")
//         }
    
//         const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
    
//         const user = await User.findById(decodedToken?._id).select("-password -refreshToken")
    
//         if (!user) {
            
//             throw new ApiError(401, "Invalid Access Token")
//         }
    
//         req.user = user;
//         next()
//     } catch (error) {
//         throw new ApiError(401, error?.message || "Invalid access token")
//     }
    
// })

