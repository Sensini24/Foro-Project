import mongoose from "mongoose";


const MessageSchema = new mongoose.Schema({
    "id_offset": {
        type: Number,
        required: true
    },
    "content": {
        type: String
    },
    "date": Date,
    "senderId": {
        type: String,
        required:true
    },
    "roomId":{
        type:String,
        required:true
    }
})

export const Message = mongoose.model('Message', MessageSchema, 'messages') //nombre del modelo / nombre del schema / nombre en la base de datos mongodb