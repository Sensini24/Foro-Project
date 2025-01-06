import mongoose from "mongoose";

const PostSchema = new mongoose.Schema({
    title: {
        type:String,
        require:true
    },
    content: {
        type:String,
        require:true
    },
    author_id: {
        type: mongoose.Schema.Types.ObjectId,
        require:true,
        ref:"User"
    },
    date: Date,
    tags: Array
})

export const Post = mongoose.model('Post', PostSchema, 'posts')
