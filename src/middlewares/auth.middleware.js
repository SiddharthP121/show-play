import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/User.models.js";
import jwt from "jsonwebtoken";

export const verifyJWT = asyncHandler(async (req, _, next) => {
  // The main goal is to take the access token from the user Id which is provided

  try {
    const token =
      req.cookies?.accessToken || // We are these cookies threw user.controller.js which we sent while logging in
      req.header("Authorization")?.replace("Bearer", "");

    if (!token) {
      throw new ApiError(401, "Unauthorized request");
    }

    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    if (!decodedToken) {
      throw new ApiError(500, "Something went wrong");
    }

    const user = User.findById(decodedToken._id).select(
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
