import { randomUUID } from 'crypto';
import mongoose, { Schema, Document } from 'mongoose';

// Define the schema for saved videos
const videoSchema = new Schema({
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
const chatSchema = new Schema({
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
    default: [], // Ensure videoIds is initialized to an empty array
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
const liftingPlanSchema = new Schema({
  liftingId: {
    type: String,
    default: randomUUID,
  },
  height: { type: Number, required: true },
  weight: { type: Number, required: true },
  experienceLevel: { type: String, required: true },
  gender: { type: String, required: true },
  desiredExercise: { type: String, required: true },
  targetWeight: { type: Number, required: true },
  numberOfWeeks: { type: Number, required: true },
  liftingPlan: { type: Array, required: true },
  createdAt: { type: Date, default: Date.now },
  deleted: { type: Boolean, default: false } // Add deleted property
});

// Define the user schema
const userSchema = new Schema({
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
  chats: {
    type: [chatSchema], // Embedded array of chat messages
    default: [], // Ensure chats is initialized to an empty array
  },
  savedVideos: {
    type: [videoSchema], // Embedded array of saved videos
    default: [], // Ensure savedVideos is initialized to an empty array
  },
  liftingPlans: {
    type: [liftingPlanSchema], // Embedded array of lifting plans
    default: [], // Ensure liftingPlans is initialized to an empty array
  },
  savedLiftingPlans: {
    type: [liftingPlanSchema], // Embedded array of saved lifting plans
    default: [], // Ensure savedLiftingPlans is initialized to an empty array
  },
});

export default mongoose.model('User', userSchema);