import mongoose, {Schema} from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";


const userSchema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        index: true,
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
    },
    fullname: {
        type: String,
        required: true,
        index: true
    },
    avtar: {
        type: String,
        
    },
    coverImage: {
        type: String,
        
    },
    watchHistory:[
        {
        type: Schema.Types.ObjectId,
        ref:"Video"
        }
    ],
  
    refreshToken: {
        type: String
    }
}, {timestamps: true});

userSchema.pre("save",async function(next){
    if (!this.isModified("password")) return next()

    this.password = await bcrypt.hash(this.password, 10)
    next()
})

userSchema.models.isPasswordCorrect = async function (password) {
   return await bcrypt.compare(password, this.password)
   
}

userSchema.models.generateAccessTokens = function(){
   const accessTokenData = jwt.sign({
        _id: this._id,
        email: this.email,
        fullname: this.fullname,
        username: this.username

    })
    return accessTokenData;
}

userSchema.models.generateRefreshTokens = function(){
    userSchema.models.generateAccessTokens = function(){
        const refreshTokenData = jwt.sign({
             _id: this._id
         })
         return refreshTokenData;
     }
}

export const User =  mongoose.model('User', userSchema)