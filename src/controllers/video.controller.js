import mongoose, { isValidObjectId } from "mongoose";
import { Video } from "../models/Video.model.js";
import { User } from "../models/User.model.js";
import {Like} from "../models/like.model.js"
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { uplaodFile } from "../utils/Cloudinary.js";

const getAllVideos = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, query, sortBy, sortType, userId } = req.query;

  //TODO: get all videos based on query, sort, pagination
  if (userId && !isValidObjectId(userId)) {
    throw new ApiError(400, "User id is invalid");
  }

  const validSortByTypes = ["title", "views", "likes", "createdAt"];

  if (sortBy && !validSortByTypes.includes(sortBy)) {
    throw new ApiError(
      400,
      `Invalid sort by validation, Valid type are ${validSortByTypes.join(", ")}`
    );
  }

  const validSortTypes = ["a", "d"];

  if (sortType && !validSortTypes.includes(sortType)) {
    throw new ApiError(
      400,
      "Invalid sort type validation, Valid types are a (accending), d (decending) "
    );
  }

  const sortOptions = { createdAt: -1 };

  if (sortBy) {
    sortOptions[sortBy] = sortType === "d" ? -1 : 1;
  }

  let pipeline = [];

  if (query) {
    pipeline.push({
      $search: {
        index: "search",
        text: {
          query: query,
          path: {
            wildcard: "*",
          },
        },
      },
    });
  }

  pipeline.push(
    {
      $match: {
        isPublished: true,
      },
    },
    {
      $lookup: {
        from: "likes",
        foreignField: "video",
        localField: "_id",
        as: "likes",
      },
    },
    {
      $addFields: {
        likes: { $size: "$likes" },
      },
    },
    { $sort: sortOptions },
    { skip: (page - 1) * limit },
    { limit: parseInt(limit) },
  );
  const video = await Video.aggregate(pipeline);
  const totalVideos = await Video.countDocuments();

  if (!video) {
    throw new ApiError(401, "Failed to fetch the videos");
  }

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { video, totalVideos },
        "Videos fetched successfully"
      )
    );
});

const publishAVideo = asyncHandler(async (req, res) => {
  const { title, description } = req.body;

  // TODO: get video, upload to cloudinary, create video
  if (!title || !description) {
    throw new ApiError(401, "Title and description required");
  }

  const videoLocalPath = req.files?.videoFile[0]?.path;
  const thumbnailLocalPath = req.files?.thumbnail[0].path;

  if (!videoLocalPath) {
    throw new ApiError(400, "Video file is required");
  }

  if (!thumbnailLocalPath) {
    throw new ApiError(400, "Thumbnail is required");
  }

  const videoFile = await uplaodFile(videoLocalPath);
  const thumbnail = await uplaodFile(thumbnailLocalPath);

  console.log(videoFile);

  if (!videoFile) {
    throw new ApiError(400, "Failed to upload the video file");
  }

  if (!thumbnail) {
    throw new ApiError(400, "Failed to upload the thumbnail file");
  }

  const uploadVideoData = await Video.create({
    title,
    description,
    thumbnail: thumbnail.url,
    videoFile: videoFile.url,
    owner: req.user._id,
    duration: videoFile.duration,
    isPublished: true,
  });

  if (!uploadVideoData) {
    throw new ApiError(401, "Failed to upload the video data");
  }

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { uploadVideoData },
        "Video file uploaded successfully"
      )
    );
});

const getVideoById = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  //TODO: get video by id

  if (!videoId || !isValidObjectId(videoId)) {
    throw new ApiError(400, "Invalid video id");
  }

  const video = await Video.findById(videoId);
  if (!video) {
    throw new ApiError(400, "Can not find the video with the given video id");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, { video }, "Video found successfully"));
});

const updateVideo = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  //TODO: update video details like title, description, thumbnail
  if (!videoId || !isValidObjectId(videoId)) {
    throw new ApiError(400, "Invalid video id");
  }

  const { title, description } = req.body;
  if (!title || !description) {
    throw new ApiError(400, "Title or description is missing");
  }

  const thumbnailLocalPath = req.file?.path;

  if (!thumbnailLocalPath) {
    throw new ApiError(400, "Failed to find the local thumbnail path");
  }

  const thumbnail = await uplaodFile(thumbnailLocalPath);

  if (!thumbnail) {
    throw new ApiError(400, "Failed to upload the thumbnail");
  }

  const video = await Video.findByIdAndUpdate(
    videoId,
    {
      title,
      description,
      thumbnail: thumbnail.url,
    },
    { new: true }
  );
  if (!video) {
    throw new ApiError(400, "Can not find the video with the given video id");
  }
  
  return res
  .status(200)
  .json(
    new ApiResponse(200, { video }, "Video updated successfully")
  )

});

const deleteVideo = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  //TODO: delete video

  if (!videoId || !isValidObjectId(videoId)) {
    throw new ApiError(400, "Video Id is invalid")
  }

  const deleteVideo = await Video.findByIdAndDelete(videoId)
  const deleteVideoLikes = await Like.findByIdAndDelete(videoId)

  if (!deleteVideo || !deleteVideoLikes) {
    throw new ApiError(400, "Failed to delete the video")
  }

  return res
  .status(200)
  .json(
    new ApiResponse(200, {deleteVideo}, "Video deleted successfully")
  )
});

const togglePublishStatus = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
});

export {
  getAllVideos,
  publishAVideo,
  getVideoById,
  updateVideo,
  deleteVideo,
  togglePublishStatus,
};
