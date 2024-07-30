import { randomUUID } from 'crypto';
import mongoose from 'mongoose';
// Define the schema for saved videos
const videoSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    url: {
        type: String,
        required: true,
    },
});
// Define the schema for chat messages
const chatSchema = new mongoose.Schema({
    id: {
        type: String,
        default: randomUUID,
    },
    role: {
        type: String,
        required: true,
    },
    content: {
        type: String,
        required: true,
    },
    videoIds: {
        type: [String], // Array of video IDs
    },
    videoId: {
        type: String
    },
    currentVideoIndex: {
        type: Number,
        default: 0,
    },
});
// Define the user schema
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    chats: [chatSchema], // Embedded array of chat messages
    savedVideos: [videoSchema], // Embedded array of saved videos
});
export default mongoose.model('User', userSchema);
//# sourceMappingURL=User.js.map