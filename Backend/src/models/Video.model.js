import mongoose, { Schema } from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";
const ownerSchema = new Schema({
    id: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    avtar:{
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true
    },
    fullname: {
        type: String,
        required: true
    } 
    
})
const videoSchema = new Schema({
    videoFile:{
        type: String,
        required: true
    },
    thumbnail:{
        type: String,
        required: true
    },
    title:{
        type: String,
        required: true
    },
    description:{
        type: String,
        required: true
    },
    owner: {
        type: ownerSchema,
        required: true
    },
    duration:{
        type: Number,
        required: true,
    },
    views:{
        type: Number,
        default: 0
    },
    likes:{
        type: Number,
        default: 0
    },
    isPublished:{
        type: Boolean,
        required: true,
        default: false
    }

    
    
}, {timestamps: true})

videoSchema.plugin(mongooseAggregatePaginate)

export const Video = mongoose.model("Video", videoSchema)