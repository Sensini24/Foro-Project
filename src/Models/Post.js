import mongoose from "mongoose";

const PostSchema = new mongoose.Schema({
    "title": String,
    "content": String,
    "author": String,
    "date": Date,
    "tags": Array     

})

export const Post = mongoose.model('Post', PostSchema, 'posts')
