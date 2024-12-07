import mongoose from "mongoose";


const MessageSchema = new mongoose.Schema({
    "id_offset": {
        type: Number,
        unique: true,
        required: true
    },
    "content": {
        type: String
    },
    "date": Date
})

export const Message = mongoose.model('Message', MessageSchema, 'messages') //nombre del modelo / nombre del schema / nombre en la base de datos mongodb