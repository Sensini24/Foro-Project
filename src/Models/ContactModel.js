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
    "isActive": {
        type: Boolean,
        default: true // Activo por defecto
    },
    "isFavorite": {
        type: Boolean,
        default: false // No favorito por defecto
    },
    "date": Date
})

export const Contact = mongoose.model('Contact', ContactSchema, 'contacts')