import { randomUUID } from 'crypto';
import mongoose, { Schema } from 'mongoose';
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
// Define the schema for calisthenics plans
const calisthenicsPlanSchema = new Schema({
    calisthenicsId: {
        type: String,
        default: randomUUID,
    },
    height: { type: Number, required: true },
    weight: { type: Number, required: true },
    experienceLevel: { type: String, required: true },
    gender: { type: String, required: true },
    desiredMovement: { type: String, required: true },
    repsGoal: { type: Number, required: true },
    numberOfWeeks: { type: Number, required: true },
    calisthenicsPlan: { type: Array, required: true },
    createdAt: { type: Date, default: Date.now },
    deleted: { type: Boolean, default: false } // Add deleted property
});
const endurancePlanSchema = new Schema({
    enduranceId: {
        type: String,
        default: randomUUID,
    },
    age: { type: Number, required: true },
    weight: { type: Number, required: true },
    fitnessLevel: { type: String, required: true },
    gender: { type: String, required: true },
    preferredActivity: { type: String, required: true },
    distanceGoal: { type: Number, required: true },
    timeGoal: { type: String, required: true },
    numberOfWeeks: { type: Number, required: true },
    endurancePlan: { type: Array, required: true },
    createdAt: { type: Date, default: Date.now },
    deleted: { type: Boolean, default: false } // Add deleted property
});
const balancePlanSchema = new Schema({
    balanceId: {
        type: String,
        default: randomUUID,
    },
    age: { type: Number, required: true },
    fitnessLevel: { type: String, required: true },
    gender: { type: String, required: true },
    targetMovement: { type: String, required: true },
    stabilityGoal: { type: String, required: true },
    numberOfWeeks: { type: Number, required: true },
    balancePlan: { type: Array, required: true },
    createdAt: { type: Date, default: Date.now },
    deleted: { type: Boolean, default: false },
});
const flexibilityPlanSchema = new Schema({
    flexibilityId: {
        type: String,
        default: randomUUID,
    },
    age: { type: Number, required: true },
    fitnessLevel: { type: String, required: true },
    gender: { type: String, required: true },
    targetArea: { type: String, required: true },
    flexibilityGoal: { type: String, required: true },
    numberOfWeeks: { type: Number, required: true },
    flexibilityPlan: { type: Array, required: true },
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
    calisthenicsPlans: {
        type: [calisthenicsPlanSchema], // Embedded array of calisthenics plans
        default: [], // Ensure calisthenicsPlans is initialized to an empty array
    },
    savedCalisthenicsPlans: {
        type: [calisthenicsPlanSchema], // Embedded array of saved calisthenics plans
        default: [], // Ensure savedCalisthenicsPlans is initialized to an empty array
    },
    endurancePlans: {
        type: [endurancePlanSchema], // Embedded array of endurance plans
        default: [], // Ensure endurancePlans is initialized to an empty array
    },
    savedEndurancePlans: {
        type: [endurancePlanSchema], // Embedded array of saved endurance plans
        default: [], // Ensure savedEndurancePlans is initialized to an empty array
    },
    balancePlans: {
        type: [balancePlanSchema],
        default: [],
    },
    savedBalancePlans: {
        type: [balancePlanSchema],
        default: [],
    },
    flexibilityPlans: {
        type: [flexibilityPlanSchema],
        default: [],
    },
    savedFlexibilityPlans: {
        type: [flexibilityPlanSchema],
        default: [],
    },
});
export default mongoose.model('User', userSchema);
//# sourceMappingURL=User.js.map