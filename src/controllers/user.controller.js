import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/User.models.js";
import { uplaodFile } from "../utils/Cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const generateAccessAndRefreshToken = async (userId) => {
  try {
    const user = await User.findById(userId);
    const accessToken = user.generateAccessTokens();
    const refreshToken = user.generateRefreshToken();

    user.refreshToken = refreshToken;

    await user.save({ validateBeforeSave: false });
  } catch (error) {
    throw new ApiError(
      500,
      "Something went wrong while generating access and refresh token"
    );
  }

  return { accessToken, refreshToken };
};

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

  // console.log(req.body);

  if (
    [username, email, password, fullname].some((field) => field?.trim() === "")
  ) {
    throw new ApiError(400, "All fields are required");
  }

  const existedUser = await User.findOne({ $or: [{ username }, { email }] });

  if (existedUser) {
    throw new ApiError(409, "Username or email is registered");
  }

  const avtarLocalPath = req.files?.avtar[0]?.path; // referencing about system files
  // const coverImageLocalPath = req.files?.coverImage[0]?.path     // referencing about system files
  let coverImageLocalPath;

  if (
    req.files &&
    Array.isArray(req.files.coverImage) &&
    req.files.coverImage.length > 0
  ) {
    coverImageLocalPath = req.files.coverImage[0].path;
  }

  // console.log(req.files.coverImage[0].path )

  if (!avtarLocalPath) {
    throw new ApiError(400, "Avtar image is required");
  }

  const avtar = await uplaodFile(avtarLocalPath); // function which uploads files on the cloud
  const coverImage = await uplaodFile(coverImageLocalPath); // function which uploads files on the cloud

  if (!avtar) {
    throw new ApiError(400, "Avtar image is required");
  }

  const user = await User.create({
    fullname,
    username: username.toLowerCase(),
    password,
    email,
    avtar: avtar.url,
    coverImage: coverImage?.url || "",
  });

  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  if (!createdUser) {
    throw new ApiError(500, "Something went wrong while registering the user");
  }

  return res
    .status(201)
    .json(new ApiResponse(200, createdUser, "User created successfully"));
});

const loginUser = asyncHandler(async (req, res) => {
  /* Steps to login the user
  01. Get the data form the frontend or req.body
  02. Check the validation if empty, if empty throw error
  03. Check for the email or username if avlaible in the database, if not throw error invalid credientials
  04. Check the  password
  05. Generate Access and refresh token if password is correct
  06. Serve the access and refresh token to the database

  */

  const { username, email, password } = req.body;

  if (!(username || password)) {
    throw new ApiError(400, "All the fields are required");
  }

  const user = await User.findOne($or[({ username }, { email })]);

  if (!user) {
    throw new ApiError(401, "Invalid username or password");
  }

  const ValidPassword = await user.isPasswordCorrect(password);

  if (!ValidPassword) {
    throw new ApiError(402, "Invalid user credentials");
  }

  const loggendInUser = user.findById(user._id);

  const { accessToken, refreshToken } = await generateAccessAndRefreshToken(
    user._id
  ).select("-password -refreshToken");

  const options = {
    http: true,
    security: true,
  };

  res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiResponse(
        200,
        {
          user: accessToken,
          refreshToken,
          loggendInUser,
        },
        "User logged in successfully"
      )
    );
});

const logoutUser = asyncHandler(async (req, res) => {
  await User.findByIdAndUpdate(
    req.user._id,
    {
      $set: {
        refreshToken: undefined,
      },
    },
    {
      new: true,
    }
  );

  const options = {
    http: true,
    security: true,
  };

  return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, {}, "User logged out successfully"));
});

export { registerUser, loginUser, logoutUser };
