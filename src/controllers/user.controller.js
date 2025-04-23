import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/User.models.js"
import { uplaodFile } from "../utils/Cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const registerUser = asyncHandler(async (req, res) => {


    // get user details from frontend
    // validation - not empty
    // check if user already exists: username, email
    // check for images, check for avatar
    // upload them to cloudinary, avatar
    // create user object - create entry in db
    // remove password and refresh token field from response
    // check for user creation
    // return res



  const { username, email, password, fullname } = req.body;
  console.log("email :", email);

  if (
    [username, email, password, fullname].some((field) => field?.trim() === "")
  ) {
    throw new ApiError(400, "All fields are required");
  }

  const existedUser = await User.findOne({ $or: [{ username }, { email }] })

  if (existedUser) {
    throw new ApiError(409, "Username or password is registered")
  }

  const avtarLocalPath = req.files?.avtar[0]?.path   // referencing about system files
  const coverImageLocalPath = req.files?.coverImage[0]?.path     // referencing about system files

  if (!avtarLocalPath) {
    throw new ApiError(400, 'Avtar image is required')
  }

  const avtar = await uplaodFile(avtarLocalPath)  // function which uploads files on the cloud
  const coverImage = await uplaodFile(coverImageLocalPath)  // function which uploads files on the cloud

  if (!avtar) {
    throw new ApiError(400, 'Avtar image is required')
  }

  const user = await User.create({
    fullname,
    username: username.toLowerCase(),
    password,
    email,
    avtar: avtar.url,
    coverImage: coverImage?.url || ""
  })

  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken"
  )


  if (!createdUser) {
    throw new ApiError(500, 'Something went wrong while registering the user')
  }

  return res.status(201).json(
   new ApiResponse(200, "User created successfully")
  )

});
export { registerUser };
