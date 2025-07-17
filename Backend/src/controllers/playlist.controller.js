import mongoose, { isValidObjectId } from "mongoose";
import { Playlist } from "../models/playlist.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { Video } from "../models/Video.model.js";

const createPlaylist = asyncHandler(async (req, res) => {
  //TODO: create playlist
  const { name, description } = req.body;

  if (!name) {
    throw new ApiError(400, "Playlist name is required");
  }
  if (!description) {
    throw new ApiError(400, "Playlist description is required");
  }

  const owner = req.user._id;

  const existingPlaylist = await Playlist.findOne({ name, owner });

  if (existingPlaylist) {
    throw new ApiError(400, "Playlist already exists");
  }

  const playlist = await Playlist.create({
    name: name,
    description: description,
    owner,
  });

  if (!playlist) {
    throw new ApiError(400, "Unable to create playlist");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, { playlist }, "Playlist created successfully"));
});

const getUserPlaylists = asyncHandler(async (req, res) => {
  //TODO: get user playlists
  const { userId } = req.user._id;

  if (!userId || !isValidObjectId(userId)) {
    throw new ApiError(400, "User Id not found");
  }

  const playlist = await Playlist.find({ owner: userId });

  if(!playlist){
    throw new ApiError(400, "No playlist found")
  }

  if (playlist.length == 0) {
    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          {playlist},
          "No playlist found"
        )
      )
  }

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { playlist },
        "Playlist fetched successfully"
      )
    );
});

const getPlaylistById = asyncHandler(async (req, res) => {
  //TODO: get playlist by id
  const { playlistId } = req.params;

  if (!playlistId || !isValidObjectId(playlistId)) {
    throw new ApiError(400, "Invalid playlist Id");
  }

  const playlist = await Playlist.findById(playlistId);

  if (!playlist) {
  throw new ApiError(404, `Unable to find the playlist with id ${playlistId}`);
  }

  return res
    .status(200)
    .json(new ApiResponse(200, { playlist }, "Playlist fetched successfully"));
});

const addVideoToPlaylist = asyncHandler(async (req, res) => {
  const { playlistId, videoId } = req.params;

  if (!playlistId || !isValidObjectId(playlistId)) {
    throw new ApiError(400, "Invalid playlist id");
  }
  if (!videoId || !isValidObjectId(videoId)) {
    throw new ApiError(400, "Invalid video id");
  }

  const playlist = await Playlist.findById(playlistId);
  const video = await Video.findById(videoId);

  if (!playlist) {
    throw new ApiError(400, "Unable to find the playlist with the provided id");
  }
  if (!video) {
    throw new ApiError(400, "Unable to find the video with the provided id");
  }

  if (!playlist.videos.includes(video._id)) {
    playlist.videos.push(video._id);
    await playlist.save();
  }

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { video, playlist },
        "Video added to playlist successfully"
      )
    );
});

const removeVideoFromPlaylist = asyncHandler(async (req, res) => {
  // TODO: remove video from playlist
  const { playlistId, videoId } = req.params;

  if (!playlistId || !isValidObjectId(playlistId)) {
    throw new ApiError(400, "Playlist not found");
  }

  if (!videoId || !isValidObjectId(videoId)) {
    throw new ApiError(400, "Video not found");
  }

  const playlist = await Playlist.findById(playlistId);
  const video = await Video.findById(videoId);

  if (!playlist) {
    throw new ApiError(400, "Unable to fetch the playlist");
  }

  if (!video) {
    throw new ApiError(400, "Unable to fetch the video");
  }

  if (playlist.videos.includes(video._id)) {
    playlist.videos.pull(video._id);
   await playlist.save();
  }

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { updatedPlaylist: playlist, removedVideo: video },
        "Video removed from playlist successfully"
      )
    );
});

const deletePlaylist = asyncHandler(async (req, res) => {
  // TODO: delete playlist
  const { playlistId } = req.params;

  if (!playlistId || !isValidObjectId(playlistId)) {
    throw new ApiError(400, "Invalid playlist id");
  }
  //   const playlist = await Playlist.findById(playlistId)

  //   if (!playlist) {
  //     throw new ApiError(404, "Unable to find the playlist with the provided id")
  //   }

  const Deleteplaylist = await Playlist.findByIdAndDelete(playlistId);

  if (!Deleteplaylist) {
    throw new ApiError(400, "Unable to delete the playlist at the moment");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, { deletePlaylist: Deleteplaylist }, "Playlist deleted successfully"));
});

const updatePlaylist = asyncHandler(async (req, res) => {
  //TODO: update playlist
  const { playlistId } = req.params;
  const { name, description } = req.body;

  if (!playlistId || !isValidObjectId(playlistId)) {
    throw new ApiError(400, "Invalid playlist Id");
  }

  if (!name || !description) {
    throw new ApiError(400, "Name and description are required");
  }

  const playlist =await Playlist.findByIdAndUpdate(playlistId, {
    name: name,
    description: description,
  }, {new: true});

  if (!playlist) {
    throw new ApiError(400, "Unable to update playlist");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, { playlist }, "Playlist updated successfully"));
});

export {
  createPlaylist,
  getUserPlaylists,
  getPlaylistById,
  addVideoToPlaylist,
  removeVideoFromPlaylist,
  deletePlaylist,
  updatePlaylist,
};
