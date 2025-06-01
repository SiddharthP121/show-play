import mongoose, {Schema} from "mongoose";

const subscriptionSchema = new Schema({

    subscriber: {   // One who is subscribing
        type: mongoose.Types.ObjectId,
        ref: "User"
    },
    channel: {    // One who is subscribed
        type: mongoose.Types.ObjectId,
        ref: "User"
    }

}, {timestamps: true})

export const Subscription = mongoose.model("Subscription", subscriptionSchema)