import mongoose from "mongoose";

const CommentInteractionsSchema = new mongoose.Schema({
    "post_id": {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Post',
        required: true
    },
    "comment_id": {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Comment',
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
    "timestamps": Date
})

export const CommentInteractions = mongoose.model('CommentInteractions', CommentInteractionsSchema, 'comment_interactions') //nombre del modelo / nombre del schema / nombre en la base de datos mongodb