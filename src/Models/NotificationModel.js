import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema({
  senderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  recipientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    enum: ['firstmessage', 'youlike', 'newcontact',  'youshare', 'youmention', 'youcomment', ],
    required: true,
  },
  pathsIds: {
    id_comment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Comment'
    },
    id_post: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Post'
    }
  },
  roomId: {
    type: String
  },
  isRead: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
});

export const Notification = mongoose.model('Notification', notificationSchema, 'notifications');
