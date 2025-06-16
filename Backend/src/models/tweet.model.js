import mongoose, {Schema} from "mongoose";

const tweetSchema = new Schema({
    content: {
        type: String,
        required: true
    },
    likes: {
        type: Number,
        default: 0 
    },
    owner: {
        type: String,
        required: true
       
    }
}, {timestamps: true})


export const Tweet = mongoose.model("Tweet", tweetSchema)