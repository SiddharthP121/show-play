import mongoose, { isValidObjectId } from "mongoose";
import { Video } from "../models/Video.model.js";
import { Like } from "../models/like.model.js";
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
    { $skip: (page - 1) * parseInt(limit) },
    { $limit: parseInt(limit) }
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
  console.log(req.body);
  console.log(req.files);

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
    thumbnail: thumbnail.secure_url,
    videoFile: videoFile.secure_url,
    duration: videoFile.duration,
    isPublished: true,
    owner: {
      id: req.user._id,
      avtar: req.user.avtar,
      fullname: req.user.fullname,
      username: req.user.username,
    },
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

  console.log(videoId);

  if (!videoId) {
    throw new ApiError(400, "Invalid video id");
  }
  if (!isValidObjectId(videoId)) {
    throw new ApiError(400, "Invalid video object id");
  }

  const video = await Video.findById(videoId);
  if (!video) {
    throw new ApiError(400, "Can not find the video with the given video id");
  }
  let isLiked = false;
  if (req.user && req.user._id) {
    const like = await Like.findOne({ video: videoId, likedBy: req.user._id });
    isLiked = !!like;
  }

  return res
    .status(200)
    .json(new ApiResponse(200, { video, isLiked }, "Video found successfully"));
});

const getCurrentUserVideos = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  if (!userId || !isValidObjectId(userId)) {
    throw new ApiError(400, "Invalid user id");
  }
  const videos = await Video.find({ "owner.id": userId });

  if (videos.length === 0) {
    return res
      .status(200)
      .json(new ApiResponse(200, videos, "No videos found"));
  }

  return res
    .status(200)
    .json(new ApiResponse(200, videos, "Videos fetched successfully"));
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
      thumbnail: thumbnail.secure_url,
    },
    { new: true }
  );
  if (!video) {
    throw new ApiError(400, "Can not find the video with the given video id");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, { video }, "Video updated successfully"));
});

const deleteVideo = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  //TODO: delete video

  if (!videoId || !isValidObjectId(videoId)) {
    throw new ApiError(400, "Video Id is invalid");
  }

  const deleteVideo = await Video.findByIdAndDelete(videoId);
  const deleteVideoLikes = await Like.findByIdAndDelete(videoId);

  if (!deleteVideo || !deleteVideoLikes) {
    throw new ApiError(400, "Failed to delete the video");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, { deleteVideo }, "Video deleted successfully"));
});

const togglePublishStatus = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
});

const searchVideo = asyncHandler(async (req, res) => {
  const { query } = req.query;
  if (!query) {
    throw new ApiError(400, "Unable to find the query");
  }

  const videos = await Video.find({ title: { $regex: query, $options: "i" } });

  if (videos.length == 0) {
    return res
      .status(200)
      .json(new ApiResponse(200, { videos }, "No videos found"));
  }

  return res
    .status(200)
    .json(new ApiResponse(200, { videos }, "Videos found"));
});

export {
  getAllVideos,
  publishAVideo,
  getVideoById,
  updateVideo,
  searchVideo,
  deleteVideo,
  togglePublishStatus,
  getCurrentUserVideos,
};
