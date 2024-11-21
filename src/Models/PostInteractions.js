import mongoose from "mongoose";

const PostInteractionsSchema = new mongoose.Schema({
    "post_id": {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Post',
        required: true
    },  
    "user_id": {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    "type": {
        type: String,
        enum: ['like', 'dislike', 'outstanding'],
        required: true
    },
    "timestamp": Date
})

export const PostInteractions = mongoose.model('PostInteractions', PostInteractionsSchema, 'post_interactions')