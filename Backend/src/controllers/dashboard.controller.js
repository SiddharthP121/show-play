import mongoose, { isValidObjectId } from "mongoose";
import { Video } from "../models/Video.model.js";
import { Subscription } from "../models/subscription.model.js";
import { Like } from "../models/like.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { useId } from "react";
import { User } from "../models/User.model.js";

const getChannelStats = asyncHandler(async (req, res) => {
  // TODO: Get the channel stats like total video views, total subscribers, total videos, total likes etc.
  const userId = req.user._id;
  const stats = await User.aggregate([
    {
      $match: {
        _id: userId,
      },
    },
    { 
        $lookup: {
            from: "subscriptions",
            localField: "_id",
            foreignField: "channel",
            as: "subscribers"
        }
     },
     {
        $lookup: {
            from: "videos",
            localField: "_id",
            foreignField: "creator._id",
            as: "videos"
        }
     },
     {
        $lookup: {
            from: "likes",
            localField: "videos._id",
            foreignField: "video",
            as: "likes"
        }
     },
     {
        $addFields: {
            totalVideos: {$size: "$videos"},
            totalSubscribers: {$size: "$subscribers"},
            totalLikes: {$size: "$likes"},
            totalViewsCount: {$sum: "$videos.views"}
        }
     }
  ]);
  if (!stats) {
    throw new ApiError(400, "Channel Stats not found")
  }

  return res
  .status(200)
  .json(
    new ApiResponse(200, stats[0], "Channel stats found successfully")
  )
});

const getChannelVideos = asyncHandler(async (req, res) => {
  // TODO: Get all the videos uploaded by the channel
  const { userId } = req.user._id;
  if (!userId || !isValidObjectId(userId)) {
    throw new ApiError(400, "Invalid user id");
  }

  const myVideos = await Video.findById({ owner: userId });
  if (!myVideos) {
    throw new ApiError(400, "No videos avalible");
  }

  return res
    .status(200)
    .json(
      new ApiResponse(
        400,
        { myVideos, totalVideos: myVideos.length },
        "Videos fetched successfully"
      )
    );
});

export { getChannelStats, getChannelVideos };
