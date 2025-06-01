import { Video } from "../models/Video.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import mongoose, { isValidObjectId } from "mongoose";

const videoViews = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  if (!videoId || !isValidObjectId(videoId)) {
    throw new ApiError(400, "Invalid video id");
  }

  const views = Video.findByIdAndUpdate(
    videoId,
    { $inc: { views: 1 } },
    { new: true }
  );

  if (!views) {
    throw new ApiError(400, "Unable to update the view");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, views, "Views updated successfully"));
});
export { videoViews };
