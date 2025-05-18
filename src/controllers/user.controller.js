import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/User.model.js";
import { uplaodFile } from "../utils/Cloudinary.js";
// import { deleteFromCloud } from "../utils/deleteFromCloud.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";

const generateAccessAndRefreshToken = async (userId) => {
  try {
    const user = await User.findById(userId);
    const accessToken = user.generateAccessTokens();
    const refreshToken = user.generateRefreshTokens();

    user.refreshToken = refreshToken;
    user.accessToken = accessToken;

    await user.save({ validateBeforeSave: false });

    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(
      500,
      error.message ||
        "Something went wrong while generating access and refresh token"
    );
  }
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

  const user = await User.findOne({ $or: [{ username }, { email }] });

  if (!user) {
    throw new ApiError(401, "Invalid username or password");
  }

  const ValidPassword = await user.isPasswordCorrect(password);

  if (!ValidPassword) {
    throw new ApiError(402, "Invalid user credentials");
  }

  console.log(user._id);
  const { accessToken, refreshToken } = await generateAccessAndRefreshToken(
    user._id
  );

  const loggedInUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

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
          loggedInUser,
        },
        "User logged in successfully"
      )
    );
});

const logoutUser = asyncHandler(async (req, res) => {
  await User.findByIdAndUpdate(
    req.user._id,
    {
      $unset: {
        refreshToken: 1,
      },
    },
    {
      new: true,
    }
  );
  console.log(req.user._id);

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

const refreshAccessToken = asyncHandler(async (req, res) => {
  //
  const incomingRefreshToken =
    req.cookies.refreshToken || req.body.refreshToken;

  if (!incomingRefreshToken) {
    throw new ApiError(401, "Unautorized request");
  }

  const decodedRefreshToken = jwt.verify(
    incomingRefreshToken,
    process.env.REFRESH_TOKEN_SECRET
  );

  const user = await User.findById(decodedRefreshToken?._id);

  if (!user) {
    throw new ApiError(401, "Invalid refresh token");
  }

  if (incomingRefreshToken !== user.refreshToken) {
    throw new ApiError(401, "Refresh token is expired or used");
  }

  const options = {
    http: true,
    security: true,
  };

  const { accessToken, newRefreshToken } = await generateAccessAndRefreshToken(
    user._id
  );

  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", newRefreshToken, options)
    .json(
      new ApiResponse(
        200,
        { accessToken, refreshToken: newRefreshToken },
        "Access token refreshed successfully"
      )
    );
});

const changeCurrentPassword = asyncHandler(async (req, res) => {
  /*
  Steps to make the logic of changing the current password
  01. Aquire the current password and new password for req.body
  02. Check the validation if empty
  03. Check if current password is true
  04. Add the password and update the user model
  */

  const { oldPassword, newPassword } = req.body;

  const user = await User.findById(req.user._id);
  console.log(req.user._id);
  const passwordResult = await user.isPasswordCorrect(oldPassword);

  if (!passwordResult) {
    throw new ApiError(400, "Invalid old password");
  }

  if (!passwordResult) {
    throw new ApiError(401, "Invalid current password");
  }

  // User.findByIdAndUpdate(
  //   req.user._id,
  //   {
  //    $set : {
  //     password: newPassword
  //    }
  //   },
  //   {
  //     new: true
  //   }
  // )

  user.password = newPassword;
  await user.save({ validateBeforeSave: false });

  const options = {
    http: true,
    security: true,
  };

  return res
    .status(200)
    .json(new ApiResponse(200, {}, options, "Password updated"));
});

const getCurrentUser = asyncHandler(async (req, res) => {
  return res
    .status(200)
    .json(new ApiResponse(201, req.user, "Current user fetched successfully"));
});

const updateAccountDetails = asyncHandler(async (req, res) => {
  const { fullname, username, email } = req.body;

  if (!fullname || !username || !email) {
    throw new ApiError(401, "All the fields are required");
  }

  const user = await User.findByIdAndUpdate(
    req.user._id,
    {
      $set: {
        username,
        fullname,
        email,
      },
    },
    {
      new: true,
    }
  ).select("-password");

  if (!user) {
    throw new ApiError(500, "Something went wrong");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, user, "User updated successfully"));
});

const updateAvtar = asyncHandler(async (req, res) => {
  const newAvtarPath = req.file?.path;

  if (!newAvtarPath) {
    throw new ApiError(400, "Avtar image is required");
  }

  const updatedUserAvtar = await uplaodFile(newAvtarPath);

  if (!updatedUserAvtar) {
    throw new ApiError(
      400,
      "Something went wrong while uploading the avtar image"
    );
  }

  const user = await User.findByIdAndUpdate(req.user._id, {
    $set: {
      avtar: updatedUserAvtar.url,
    },
  }).select("-password");

  // const user = await User.findById(req.user._id).select(
  //   "-password -refreshToken"
  // );

  // deleteFromCloud(user.avtar); // delete the old image from the cloudinary
  // user.avtar = updatedUserAvtar.url; // update the new image in the database

  return res
    .status(200)
    .json(new ApiResponse(200, user, "Avtar updated successfully"));
});

const updateCoverImage = asyncHandler(async (req, res) => {
  const newCoverImagePath = req.file?.path;
  if (!newCoverImagePath) {
    throw new ApiError(400, "Cover Image file is required");
  }
  const updatedCoverImg = uplaodFile(newCoverImagePath);
  if (!updatedCoverImg) {
    throw new ApiError(500, "Something went wrong while uploading cover image");
  }

  const user = await User.findByIdAndUpdate(req.user._id, {
    $set: {
      coverImage: updatedCoverImg.url,
    },
  }).select("-password");

  return res
    .status(200)
    .json(new ApiResponse(200, user, "Cover image updated successfully"));
});

const userChannelProfile = asyncHandler(async (req, res) => {
  const { username } = req.params;

  if (!username) {
    throw new ApiError(400, "Username is missing");
  }

  const channel = await User.aggregate([
    {
      $match: {
        username: username?.toLowerCase(),
      },
    },

    {
      $lookup: {
        //getting subscribers
        from: "subscriptions",
        localField: "_id",
        foreignField: "channel",
        as: "channelSubscribers",
      },
    },

    {
      $lookup: {
        //getting channel user have subscribed
        from: "subscriptions",
        localField: "_id",
        foreignField: "subscriber",
        as: "channelSubscribedTo",
      },
    },

    {
      $addFields: {
        channelSubscribersCount: {
          $size: "$channelSubscribers",
        },
        channelsSubscribedToCount: {
          $size: "$channelSubscribedTo",
        },
        isSubscribed: {
          $cond: {
            if: { $in: [req.user?._id, "$channelSubscribers.subscriber"] }, //revise it
            then: true,
            else: false,
          },
        },
      },
    },

    {
      $project: {
        username: 1,
        email: 1,
        fullname: 1,
        coverImage: 1,
        avtar: 1,
        channelSubscribersCount: 1,
        channelsSubscribedToCount: 1,
        isSubscribed: 1,
      },
    },
  ]);
  if (!channel?.length) {
    throw new ApiError(404, "Channel does not exist");
  }

  return res
    .status(200)
    .json(
      new ApiResponse(200, channel[0], "User channel fetched successfully")
    );
});

const getWatchHistory = asyncHandler(async (req, res) => {
  const user = await User.aggregate([
    {
      $match: {
        _id: new mongoose.Types.ObjectId(String(req.user._id)), //Always pass the object Id in aggregation pipeline as a string
      },
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
                    username: 1,
                    fullname: 1,
                    avtar: 1,
                    email: 1,
                  },
                },
              ],
            },
          },
          {
            $addFields: {
              owner: {
                $first: "$owner",
              },
            },
          },
        ],
      },
    },
  ]);

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        user[0].watchHistory,
        "Watch history fetched successfully"
      )
    );
});

export {
  registerUser,
  loginUser,
  logoutUser,
  refreshAccessToken,
  changeCurrentPassword,
  getCurrentUser,
  updateAccountDetails,
  updateAvtar,
  updateCoverImage,
  userChannelProfile,
  getWatchHistory,
};
