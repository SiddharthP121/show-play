import mongoose, { isValidObjectId } from "mongoose";
import { Tweet } from "../models/tweet.model.js";
import { User } from "../models/User.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { Like } from "../models/like.model.js";

const createTweet = asyncHandler(async (req, res) => {
  //TODO: create tweet
  const userId  = req.user._id;
  const { content } = req.body;
  if (!content) {
    throw new ApiError(400, "Tweet content not found");
  }
  if (!isValidObjectId(userId)) {
    throw new ApiError(400, "User Id not found");
  }
  
  const tweet = await Tweet.create({
    content,
    owner:{
      id: req.user._id,
      username: req.user.username,
      fullname: req.user.fullname,
      email: req.user.email,
      avtar: req.user.avtar
    }
  });

  if (!tweet) {
    throw new ApiError(402, "Tweet not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, {tweet}, "Tweet created Successfully"));
});

const getAllHotThoughts = asyncHandler(async (req, res) => {
  const thoughts = await Tweet.aggregate([
    {
      $lookup:{
        from: "likes",
        localField: "_id",
        foreignField: "tweet",
        as: "likes"
      }
    },
    {
      $addFields: {
        likes: {
          $size: "$likes"
        }
      }
    }
  ])

  if (!thoughts) {
    throw new ApiError(400, "Failed to get all the tweets")
  }

  const totalThoughts = await Tweet.countDocuments()

  return res
  .status(200)
  .json(
    new ApiResponse(200, {thoughts, totalThoughts}, "Tweets fetched successfully")
  )
}
)

const getUserTweets = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  if (!userId || !isValidObjectId(userId)) {
    throw new ApiError(400, "No thought Id found")
  }

  const thoughts = await Tweet.find({"owner.id": userId})

  if (thoughts.length === 0) {
    return res
    .status(200)
    .json(new ApiResponse(200, thoughts, "No thoughts found with current user"))
  }

  return res
  .status(200)
  .json(new ApiResponse(200, thoughts, "Tweets fetched successfully"))
});

const updateTweet = asyncHandler(async (req, res) => {
  //TODO: update tweet
  const updatedTweet = req.body;
  const userId  = req.user._id;
  const tweetId  = req.params;

  if (!updatedTweet) {
    throw new ApiError(400, "Contant is required to update the tweet");
  }

  if (!isValidObjectId(tweetId)) {
    throw new ApiError(400, "User Id not found");
  }

  if (!isValidObjectId(userId)) {
    throw new ApiError(400, "User Id not found");
  }

  const tweet = await Tweet.findOneAndUpdate(
    { owner: userId, _id: tweetId },
    { content: updatedTweet, updatedAt: Date.now() },
    { new: true }
  );
  if (!tweet) {
    throw new ApiError(400, "Failed to update the tweet");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, tweet, "Tweet updated successfully"));
});

const deleteTweet = asyncHandler(async (req, res) => {
  //TODO: delete tweet
  const { tweetId } = req.params;
  const { userId } = req.user._id;
  if (!isValidObjectId(tweetId)) {
    throw new ApiError(400, "Tweet Id not found");
  }
  if (!isValidObjectId(userId)) {
    throw new ApiError(400, "User Id not found");
  }

  const deletedTweet = await Tweet.findOneAndDelete({
    _id: tweetId,
    owner: userId,
  });
  const deleteTweetLikes = await Like.deleteMany({ tweet: tweetId });
  if (!deletedTweet) {
    throw new ApiError(401, "Failed to delete the tweet")
  }
  if (!deleteTweetLikes) {
    throw new ApiError(401, "Failed to delete the tweet likes")
  }

  return res
  .status(200)
  .json(
    new ApiResponse(200, deletedTweet, "Tweet deleted successfully")
  )
});


export { createTweet,getAllHotThoughts, getUserTweets, updateTweet, deleteTweet };
