import mongoose, {Schema} from "mongoose";

const ownerSchema = new Schema({
    id: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    username: {
        type: String,
        required: true
    },
    email:{
        type: String,
        required: true
    },
    fullname: {
        type: String,
        required: true
    },
    avtar: {
        type: String,
        required: true
    }
})

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
        type: ownerSchema,
        required: true
       
    }
}, {timestamps: true})


export const Tweet = mongoose.model("Tweet", tweetSchema)