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
    type: String,
  },
  currentVideoIndex: {
    type: Number,
    default: 0,
  },
});

// Define the schema for lifting plans
const LiftingPlanSchema = new mongoose.Schema({
  height: { type: Number, required: true },
  weight: { type: Number, required: true },
  experienceLevel: { type: String, required: true },
  gender: { type: String, required: true },
  desiredExercise: { type: String, required: true },
  targetWeight: { type: Number, required: true },
  numberOfWeeks: { type: Number, required: true },
  liftingPlan: { type: Array, required: true },
  createdAt: { type: Date, default: Date.now }
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
  liftingPlans: [LiftingPlanSchema], // Embedded array of lifting plans
});

export default mongoose.model('User', userSchema);