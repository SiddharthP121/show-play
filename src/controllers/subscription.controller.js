import mongoose, { isValidObjectId } from "mongoose";
import { asyncHandler } from "../utils/asyncHandler";
import { ApiError } from "../utils/ApiError";
import { ApiResponse } from "../utils/ApiResponse";
import { User } from "../models/User.model.js";
import { Subscription } from "../models/subscription.model.js";

const toggleSubscription = asyncHandler(async (req, res) => {
  const channelId = req.params;
  if (channelId || !isValidObjectId(channelId)) {
    throw new ApiError(400, "Invalid channel id");
  }
  const channel = await User.findById(channelId);
  if (!channel) {
    throw new ApiError(400, "Channel not found");
  }
  const userId = req.user._id;

  if (!userId) {
    throw new ApiError(400, "Unable to find the user id");
  }

  const subscription = await Subscription.findById({
    channel: channelId,
    subscriber: userId,
  });

  let isSubscribed = true;
  if (!subscription) {
    const subscription = await Subscription.create(
      { channel: channelId, subscriber: userId },
      { new: true }
    );
    if (!subscription) {
      throw new ApiError(400, "Unable to subscribe at the moment");
    }
    return;
  } else {
    isSubscribed = false;
    const subscription = await Subscription.findByIdAndDelete(subscription.id);
    if (!subscription) {
      throw new ApiError(400, "Unable to unsubscribe at the moment");
    }
  }

  return res
  .status(200)
  .json(new ApiResponse(200, {channel: channel, isSubscribed: isSubscribed}, isSubscribed? "Subscribed successfully": "Unsubscribed successfully"))
});

const getSubscribedChannels = asyncHandler(async (req, res) => {
  const channelId =  req.params;
  if (!isValidObjectId(channelId) || channelId) {
    throw new ApiError(400, "Invalid channel id")
  }

  const subscribedChannels = await Subscription.find({channelId})
  if (!subscribedChannels) {
    throw new ApiError(400, "Unable to find the subscribers")
  }

  return res
  .status(200)
  .json( new ApiResponse(200, {subscribedChannels, totalSubscribedChannels: subscribedChannels.length}, "Total subscribed channels fetched successfully"))
}
)

const getChannelSubscribers = asyncHandler(async (req, res) => {
  const subscriberId = req.params;
  if (!subscriberId || !isValidObjectId(subscriberId)) {
    throw new ApiError(400, "Invalid id provided")
  }

  const subscriber = await User.findById(subscriberId);
  if (!subscriber) {
    throw new ApiError(400, "Subscriber not found")
  }

  const channelSubscriber = await Subscription.find({channel: subscriberId}).populate("subscriber", "username fullname avatar")

  return res
  .status(200)
  .json( new ApiResponse(200, {channelSubscriber, totalSubscribers: channelSubscriber.length}, "Subscriber fetched successfully"))
}
)

export { toggleSubscription, getSubscribedChannels, getChannelSubscribers };
