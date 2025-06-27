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
    isEmailVerified:{
        type: Boolean,
        default: false
    },

    darkMode:{
        type: Boolean,
        default: false
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

userSchema.pre("save", async function(next){
    if (!this.isModified("password")) return next()

    this.password = await bcrypt.hash(this.password, 10)
    next()
})


userSchema.methods.isPasswordCorrect = async function (password) {
   return await bcrypt.compare(password, this.password)
}

userSchema.methods.generateAccessTokens = function(){
   const accessTokenData = jwt.sign({
        _id: this._id,
        email: this.email,
        fullname: this.fullname,
        username: this.username

    },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY
        }
    )
    return accessTokenData;
}

userSchema.methods.generateRefreshTokens = function(){
        const refreshTokenData = jwt.sign({
             _id: this._id
         },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY
        }
        )
         return refreshTokenData;    
}

export const User =  mongoose.model('User', userSchema)