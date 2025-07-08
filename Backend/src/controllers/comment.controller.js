import mongoose, {isValidObjectId} from "mongoose";
import { Comment } from "../models/comment.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const getVideoComments = asyncHandler(async (req, res) => {
  //TODO: get all comments for a video
  const {videoId} = req.params;
  if (!isValidObjectId(videoId)) {
    throw new ApiError(400, "Video Id not found");
  }
  const { page = 1, limit = 10 } = req.query;

  const options = {
    page: parseInt(page, 10),
    limit: parseInt(limit, 10),
  };

  const comments = await Comment.aggregate([
    {
      $match: {
        video: new mongoose.Types.ObjectId(String(videoId)),
      },
    },
    {
      $lookup: {
        from: "likes",
        localField: "_id",
        foreignField: "comment",
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
    { $skip: (options.page - 1) * options.limit },
    { $limit: options.limit },
  ]);

  if (!comments.length) {
    throw new ApiError(401, "Comments not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, comments, "Comments fetched successfully"));
});

const addComment = asyncHandler(async (req, res) => {
  // TODO: add a comment to a video
  const { videoId } = req.params;
  const { comment } = req.body;
  if (!comment) {
    throw new ApiError(401, "Comment not found");
  }
  if (!isValidObjectId(videoId)) {
    throw new ApiError(401, "Video Id not found");
  }

  const comments = await Comment.create({
    content: comment,
    owner:{
        id: req.user._id,
        username: req.user.username,
        fullname: req.user.fullname,
        avtar: req.user.avtar
    },
    video: videoId,
  });

  if (!comments) {
    throw new ApiError(400, "Comment not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, comments, "Comment added successfully"));
});

const updateComment = asyncHandler(async (req, res) => {
  // TODO: update a comment
  const commentId = req.params;
  const content = req.body;
  if (!commentId) {
    throw new ApiError(400, "Comment Id not found");
  }
  if (!content) {
    throw new ApiError(401, "Updated Comment not found");
  }

  const updatedComment = await Comment.findByIdAndUpdate(
    commentId,
    {
      $set: {
        content,
      },
    },
    {
      new: true,
    }
  );
  if (!updatedComment) {
    throw new ApiError(402, "Failed to update comment");
  }
  return res
    .status(200)
    .json(new ApiResponse(200, updatedComment, "Comment Updated Successfully"));
});

const deleteComment = asyncHandler(async (req, res) => {
  // TODO: delete a comment
  const commentId = req.params;
  if (!commentId) {
    throw new ApiError(400, "Comment Id not found");
  }

  const deleteUserComment = await Comment.findByIdAndDelete(commentId, { new: true });
  if (!deleteUserComment) {
    throw new ApiError(402, "Failed to delete comment");
  }
  return res
    .status(200)
    .json(new ApiResponse(200,deleteUserComment, "Comment Deleted Successfully"));
});

export { getVideoComments, addComment, updateComment, deleteComment };
