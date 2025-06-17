import mongoose, { isValidObjectId } from "mongoose";
import { Like } from "../models/like.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { Video } from "../models/Video.model.js";
import { Tweet } from "../models/tweet.model.js";

const toggleVideoLike = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  //TODO: toggle like on video

  if (!videoId || !isValidObjectId(videoId)) {
    throw new ApiResponse(400, "Video ID not found");
  }

  const userId = req.user._id;

  if (!userId || !isValidObjectId(userId)) {
    throw new ApiError(400, "User ID not found");
  }

  const like = await Like.findOne({ video: videoId, likedBy: userId });

  if (like) {
    await Like.findByIdAndDelete(like._id);
    const video = await Video.findByIdAndUpdate(
      videoId,
      {
        $inc: {
          likes: -1,
        },
      },
      {
        new: true,
      }
    );
    if (!video) {
      throw new ApiError(400, "Invalid video Id");
    }

    return res
      .status(200)
      .json(
        new ApiResponse(200, { video: video }, "Video unliked successfully")
      );
  } else {
    const like = await Like.create({ video: videoId, likedBy: userId });
    const video = await Video.findByIdAndUpdate(
      videoId,
      {
        $inc: {
          likes: 1,
        },
      },
      { new: true }
    );

    if (!video) {
      throw new ApiError(400, "Invalid video Id");
    }

    if (!like) {
      throw new ApiError(400, "Failed to like the video");
    }

    return res
      .status(200)
      .json(200, { video: video, like: like }, "Video liked successfully");
  }
});

const toggleCommentLike = asyncHandler(async (req, res) => {
  //TODO: toggle like on comment
  const { commentId } = req.params;
  if (!commentId) {
    throw new ApiError(400, "Invalid comment Id");
  }

  const userId = req.user._id;
  if (!userId) {
    throw new ApiError(400, "Invalid user Id");
  }

  const like = await Like.findOne({ likedBy: userId, comment: commentId });

  if (like) {
    await Like.findByIdAndDelete(like._id);
    const comment = await Comment.findByIdAndUpdate(commentId, {
      $inc: { likes: -1 },
      new: true,
    });
    if (!comment) {
      throw new ApiError(400, "Unable to dislike the comment");
    }

    return res
      .status(200)
      .json(new ApiResponse(200, { comment }, "Comment disliked"));
  } else {
    const like = await Like.create({
      comment: commentId,
      likedBy: userId,
    });

    const comment = await Comment.findByIdAndUpdate(
      commentId,
      { $inc: { likes: 1 } },
      { new: true }
    );
    if (!like) {
      throw new ApiResponse(400, "Unable to like the comment");
    }
    if (!comment) {
      throw new ApiError(400, "Unable to like the comment at the moment");
    }

    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          { comment: comment, like: like },
          "Liked comment successfully"
        )
      );
  }
});

const toggleThoughtLike = asyncHandler(async (req, res) => {
  //TODO: toggle like on tweet
  const { thoughtId } = req.params;
  const userId = req.user._id;
  if (!thoughtId || !isValidObjectId(thoughtId)) {
    throw new ApiError(400, "Invalid tweet Id");
  }
  if (!userId || !isValidObjectId(userId)) {
    throw new ApiError(400, "Invalid user Id");
  }

  const like = await Like.findOne({ tweet: thoughtId, likedBy: userId });

  if (like) {
    await Like.findByIdAndDelete(like._id);
    const thought = await Tweet.findByIdAndUpdate(
      thoughtId,
      {
        $inc: { likes: -1 },
      },
      { new: true }
    );

    if (!thoughtId) {
      throw new ApiError(400, "Unable to dislike");
    }
    return res
      .status(200)
      .json(new ApiResponse(200, { thought }, "Tweet disliked successfully"));
  } else {
    const like = await Like.create({ tweet: thoughtId, likedBy: userId });
    const thought = await Tweet.findByIdAndUpdate(
      thoughtId,
      { $inc: { likes: 1 } },
      { new: true }
    );
    if (!like) {
      throw new ApiError(400, "Unable to like the tweet");
    }
    if (!thought) {
      throw new ApiError(400, "Unable to like the tweet at the moment");
    }
    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          { thought: thoughtId, like: like },
          "Tweet liked successfully"
        )
      );
  }
});

const getLikedVideos = asyncHandler(async (req, res) => {
  //TODO: get all liked videos
  const userId = req.user._id;
  const likes = await Like.find({ likedBy: userId, video: { $exists: true } })
    .populate("video")
    .lean();
  const totalLikedVideos = likes.length;
  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { likes: likes, totalLikedVideos: totalLikedVideos },
        "Liked videos fetched successfully"
      )
    );
});

export { toggleCommentLike, toggleThoughtLike, toggleVideoLike, getLikedVideos };
