import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
    {
        "user_name": {
            type:String
        },
        "email": {
            type: String
        },
        "password": {
            type:String
        },
        "profilePic":{
            type:String,
            required:false
        }
    }, 
    {
        strict: false
    }
)

export const User = mongoose.model('User', UserSchema, 'users')
