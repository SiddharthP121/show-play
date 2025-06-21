import mongoose, { isValidObjectId } from "mongoose";
import { Tweet } from "../models/tweet.model.js";
import { User } from "../models/User.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { Like } from "../models/like.model.js";

const createTweet = asyncHandler(async (req, res) => {
  //TODO: create tweet
  const userId = req.user._id;
  const { content } = req.body;
  if (!content) {
    throw new ApiError(400, "Tweet content not found");
  }
  if (!isValidObjectId(userId)) {
    throw new ApiError(400, "User Id not found");
  }

  const tweet = await Tweet.create({
    content,
    owner: {
      id: req.user._id,
      username: req.user.username,
      fullname: req.user.fullname,
      email: req.user.email,
      avtar: req.user.avtar,
    },
  });

  if (!tweet) {
    throw new ApiError(402, "Tweet not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, { tweet }, "Tweet created Successfully"));
});

const getAllHotThoughts = asyncHandler(async (req, res) => {
  const thoughts = await Tweet.aggregate([
    {
      $lookup: {
        from: "likes",
        localField: "_id",
        foreignField: "tweet",
        as: "likes",
      },
    },
    {
      $addFields: {
        likes: {
          $size: "$likes",
        },
      },
    },
  ]);

  if (!thoughts) {
    throw new ApiError(400, "Failed to get all the tweets");
  }

  const totalThoughts = await Tweet.countDocuments();

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { thoughts, totalThoughts },
        "Tweets fetched successfully"
      )
    );
});

const getUserTweets = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  if (!userId || !isValidObjectId(userId)) {
    throw new ApiError(400, "No thought Id found");
  }

  const thoughts = await Tweet.find({ "owner.id": userId });

  if (thoughts.length === 0) {
    return res
      .status(200)
      .json(
        new ApiResponse(200, thoughts, "No thoughts found with current user")
      );
  }

  return res
    .status(200)
    .json(new ApiResponse(200, thoughts, "Tweets fetched successfully"));
});

const updateTweet = asyncHandler(async (req, res) => {
  //TODO: update tweet
  const updatedTweet = req.body;
  const userId = req.user._id;
  const {tweetId} = req.params;

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
    { "owner.id": userId, _id: tweetId },
    { ...updatedTweet, updatedAt: Date.now() },
    { new: true }
  );
  if (!tweet) {
    throw new ApiError(400, "Failed to update the tweet");
  }

  console.log("tweet updated")
  const updatedTweetArray = await Tweet.find({"owner.id": userId}).populate("owner")

  if (!updatedTweetArray) {
    throw new ApiError(400, "Unable to give updated tweet array")
  }
  return res
    .status(200)
    .json(new ApiResponse(200, updatedTweetArray, "Tweet updated successfully"));
});

const deleteTweet = asyncHandler(async (req, res) => {
  const { tweetId } = req.params;
  const userId = req.user._id;

  if (!isValidObjectId(tweetId) || !isValidObjectId(userId)) {
    throw new ApiError(400, "Invalid Tweet or User ID");
  }

  const deletedTweet = await Tweet.findOneAndDelete({
    _id: tweetId,
    "owner.id": userId
  });

  if (!deletedTweet) {
    const exists = await Tweet.exists({ _id: tweetId });
    if (exists) {
      throw new ApiError(403, "Not authorized to delete this tweet");
    } else {
      throw new ApiError(404, "Tweet not found");
    }
  }

  await Like.deleteMany({ tweet: tweetId });

  const newThoughts = await Tweet.find({ "owner.id": userId });
  console.log('Remaining thoughts:', newThoughts);

  return res
    .status(200)
    .json(new ApiResponse(200, newThoughts, "Tweet deleted successfully"));
});


export {
  createTweet,
  getAllHotThoughts,
  getUserTweets,
  updateTweet,
  deleteTweet,
};
