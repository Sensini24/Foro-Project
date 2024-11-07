import mongoose from "mongoose";

const CommentSchema = new mongoose.Schema({
    "post_id": {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Post',
        required: true
    },
    "user_name": String,
    "comment": String,
    "date": Date,
    "visible": Boolean
})

export const Comment = mongoose.model('Comment', CommentSchema, 'comments')