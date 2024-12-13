import mongoose from "mongoose";

const ContactSchema = new mongoose.Schema({
    "contact_id": {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required:true,
        unique:true
    },
    "username":{
        type: String,
        required:true,
        unique:true
    },
    "estado": {
        type:String,
        enum: ['accepted', 'inactive', 'pending'],
        required: true
    },
    "isFavorite": {
        type: Boolean,
        default: false
    },
    "date": Date
})

export const Contact = mongoose.model('Contact', ContactSchema, 'contacts')