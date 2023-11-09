import mongoose from 'mongoose';
const messageCollection = 'message';
const messageSchema = new mongoose.Schema({
    user: {
        type: String,
        required: true
    },
    message: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

 const messageModel = mongoose.model(messageCollection, messageSchema);
export default messageModel
  