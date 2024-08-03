import User from "../models/User.js";
import { hash, compare } from 'bcrypt'; //hash is used to encrypt password
import { createToken } from "../utils/token-manager.js";
import { COOKIE_NAME } from "../utils/constants.js";
import fetch from 'node-fetch';
import { sendThankYouEmail } from "../utils/email-service.js"; // Import the sendThankYouEmail function
import { configureOpenAI } from '../config/openai-config.js';
const weightliftingTerms = [
    "bench press", "incline bench press", "decline bench press", "dumbbell bench press",
    "squat", "front squat", "Bulgarian split squat", "overhead squat",
    "deadlift", "romanian deadlift", "sumo deadlift", "single-leg deadlift",
    "overhead press", "seated shoulder press", "dumbbell shoulder press", "Arnold press",
    "barbell curl", "dumbbell curl", "hammer curl", "concentration curl",
    "tricep extension", "skull crusher", "tricep dip", "overhead tricep extension",
    "lat pulldown", "pull-up", "chin-up", "wide-grip pulldown",
    "seated row", "bent-over row", "cable row", "one-arm dumbbell row",
    "leg press", "single-leg press", "hack squat", "smith machine squat",
    "leg extension", "leg curl", "lying leg curl", "seated leg curl",
    "calf raise", "seated calf raise", "donkey calf raise", "leg press calf raise",
    "shoulder press", "dumbbell shoulder press", "military press", "Arnold press",
    "chest fly", "incline chest fly", "decline chest fly", "cable chest fly",
    "hammer curl", "preacher curl", "reverse curl", "spider curl",
    "skull crusher", "overhead tricep extension", "tricep dip", "close-grip bench press",
    "pull-up", "chin-up", "neutral-grip pull-up", "wide-grip pull-up",
    "face pull", "upright row", "shrug", "trap raise",
    "front raise", "lateral raise", "rear delt fly", "dumbbell lateral raise",
    "rear delt fly", "reverse pec deck", "bent-over rear delt fly", "cable rear delt fly",
    "hyperextension", "reverse hyperextension", "glute bridge", "hip thrust",
    "romanian deadlift", "sumo deadlift", "stiff-leg deadlift", "trap bar deadlift",
    "clean and press", "snatch", "power clean", "hang clean",
    "power snatch", "high pull", "snatch-grip high pull", "clean pull",
    "good morning", "seated good morning", "cable good morning", "banded good morning",
    "single-leg deadlift", "single-leg Romanian deadlift", "pistol squat", "Bulgarian split squat",
    "cable fly", "low cable fly", "high cable fly", "cable crossover"
];
export const getAllUsers = async (req, res, next) => {
    try {
        //get all users
        const users = await User.find();
        return res.status(200).json({ message: "OK", users });
    }
    catch (error) {
        console.log(error);
        return res.status(200).json({ message: "ERROR", cause: error.message });
    }
};
export const userSignup = async (req, res, next) => {
    try {
        const { name, email, password } = req.body;
        const existingUser = await User.findOne({ email });
        if (existingUser)
            return res.status(401).send("User already registered");
        const hashedPassword = await hash(password, 10); // awaits this action before moving->password encryption
        const user = new User({ name, email, password: hashedPassword });
        await user.save();
        // create token and store cookie
        res.clearCookie(COOKIE_NAME, {
            httpOnly: true,
            domain: "localhost",
            signed: true,
            path: "/",
        });
        const token = createToken(user._id.toString(), user.email, "7d");
        const expires = new Date();
        expires.setDate(expires.getDate() + 7);
        res.cookie(COOKIE_NAME, token, {
            path: "/",
            domain: "localhost", // localhost could be replaced with actual domain when it is publicly hosted
            expires,
            httpOnly: true,
            signed: true,
        });
        // Send thank you email
        await sendThankYouEmail(user.email, user.name);
        return res.status(201).json({ message: "OK", name: user.name, email: user.email, token });
    }
    catch (error) {
        console.log(error);
        return res.status(200).json({ message: "ERROR", cause: error.message });
    }
};
export const userLogin = async (req, res, next) => {
    try {
        //user login
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).send("User not registered");
        }
        const isPasswordCorrect = await compare(password, user.password);
        if (!isPasswordCorrect) {
            return res.status(403).send("Incorrect Password");
        }
        //Create token and store cookie
        res.clearCookie(COOKIE_NAME, {
            httpOnly: true,
            domain: "localhost",
            signed: true,
            path: "/",
        });
        const token = createToken(user._id.toString(), user.email, "7d");
        const expires = new Date();
        expires.setDate(expires.getDate() + 7);
        res.cookie(COOKIE_NAME, token, { path: "/",
            domain: "localhost", //localhost could be replaced with actual domain when it is publically hosted
            expires,
            httpOnly: true,
            signed: true,
        });
        return res.status(201).json({ message: "OK", name: user.name, email: user.email });
    }
    catch (error) {
        console.log(error);
        return res.status(200).json({ message: "ERROR", cause: error.message });
    }
};
export const verifyUser = async (req, res, next) => {
    try {
        //user token check 
        const user = await User.findById(res.locals.jwtData.id);
        if (!user) {
            return res.status(401).send("User not registered or Token Malfunction");
        }
        console.log(user._id.toString(), res.locals.jwtData.id);
        if (user._id.toString() !== res.locals.jwtData.id) {
            return res.status(401).send("Permissons Did not Match");
        }
        return res.status(201).json({ message: "OK", name: user.name, email: user.email });
    }
    catch (error) {
        console.log(error);
        return res.status(200).json({ message: "ERROR", cause: error.message });
    }
};
export const userlogout = async (req, res, next) => {
    try {
        //user token check 
        const user = await User.findById(res.locals.jwtData.id);
        if (!user) {
            return res.status(401).send("User not registered or Token Malfunction");
        }
        console.log(user._id.toString(), res.locals.jwtData.id);
        if (user._id.toString() !== res.locals.jwtData.id) {
            return res.status(401).send("Permissons Did not Match");
        }
        res.clearCookie(COOKIE_NAME, {
            httpOnly: true,
            domain: "localhost",
            signed: true,
            path: "/",
        });
        return res.status(201).json({ message: "OK", name: user.name, email: user.email });
    }
    catch (error) {
        console.log(error);
        return res.status(200).json({ message: "ERROR", cause: error.message });
    }
};
export const getSavedVideos = async (req, res) => {
    try {
        const user = await User.findById(res.locals.jwtData.id).select('savedVideos');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json({ videos: user.savedVideos });
    }
    catch (error) {
        console.error('Error fetching saved videos:', error);
        res.status(500).json({ message: 'Error fetching saved videos' });
    }
};
export const getVideoDetails = async (videoId) => {
    try {
        const apiKey = process.env.YOUTUBE_API_KEY;
        const response = await fetch(`https://www.googleapis.com/youtube/v3/videos?id=${videoId}&part=snippet&key=${apiKey}`);
        const data = await response.json();
        if (data.items.length === 0) {
            throw new Error('Video not found');
        }
        const video = data.items[0].snippet;
        return {
            title: video.title,
            url: `https://www.youtube.com/watch?v=${videoId}`
        };
    }
    catch (error) {
        console.error('Error fetching video details:', error);
        throw new Error('Failed to fetch video details');
    }
};
export const addSavedVideo = async (req, res) => {
    const { videoId } = req.body;
    const userId = res.locals.jwtData.id; // Retrieve user ID from decoded token
    if (!userId) {
        return res.status(401).json({ message: 'User not authenticated' });
    }
    try {
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        const videoExists = user.savedVideos.some(video => video.url.includes(videoId));
        if (videoExists) {
            return res.status(400).json({ message: 'Video already saved' });
        }
        const videoDetails = await getVideoDetails(videoId);
        user.savedVideos.push({
            title: videoDetails.title,
            url: videoDetails.url
        });
        await user.save();
        res.status(201).json({ message: 'Video saved successfully' });
    }
    catch (error) {
        console.error('Error saving video:', error);
        res.status(500).json({ message: 'Error saving video' });
    }
};
export const clearAllSavedVideos = async (req, res) => {
    try {
        const user = await User.findById(res.locals.jwtData.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        //@ts-ignore
        user.savedVideos = [];
        await user.save();
        res.status(200).json({ message: 'All saved videos cleared' });
    }
    catch (error) {
        console.error('Error clearing saved videos:', error);
        res.status(500).json({ message: 'Error clearing saved videos' });
    }
};
export const deleteSavedVideo = async (req, res) => {
    const { videoId } = req.params;
    try {
        const user = await User.findById(res.locals.jwtData.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        //@ts-ignore
        user.savedVideos = user.savedVideos.filter(video => !video.url.includes(videoId));
        await user.save();
        res.status(200).json({ message: 'Video deleted successfully' });
    }
    catch (error) {
        console.error('Error deleting saved video:', error);
        res.status(500).json({ message: 'Error deleting saved video' });
    }
};
const validExperienceLevels = ['beginner', 'intermediate', 'advanced'];
const auxiliaryExercisesMapping = {
    'bench press': ['Incline Bench Press', 'Dumbbell Flyes', 'Tricep Dips', 'Close-Grip Bench Press', 'Push-Ups', 'Tricep Pushdowns', 'Incline Dumbbell Bench Press', 'Pec Deck Machine', 'Overhead Tricep Extension', 'Cable Crossovers'],
    'squat': ['Leg Press', 'Lunges', 'Leg Extensions', 'Hamstring Curls', 'Calf Raises', 'Bulgarian Split Squats', 'Step-Ups', 'Glute Bridges', 'Box Squats'],
    'deadlift': ['Romanian Deadlift', 'Good Mornings', 'Back Extensions', 'Barbell Rows', 'Pull-Ups', 'Shrugs', 'Kettlebell Swings', 'Hip Thrusts', 'Single-Leg Deadlifts'],
    'overhead press': ['Dumbbell Shoulder Press', 'Lateral Raises', 'Front Raises', 'Face Pulls', 'Tricep Pushdowns', 'Arnold Press', 'Upright Rows', 'Bent Over Lateral Raises'],
    // Define mappings for other exercises similarly
};
export const createLiftingPlan = async (req, res, next) => {
    const { height, weight, experienceLevel, gender, desiredExercise, targetWeight, numberOfWeeks } = req.body;
    try {
        const user = await User.findById(res.locals.jwtData.id);
        if (!user) {
            return res.status(401).json({ message: "User not registered OR Token malfunctioned" });
        }
        const isValidExercise = Object.keys(auxiliaryExercisesMapping).some((keyword) => keyword.toLowerCase() === desiredExercise.toLowerCase());
        if (!isValidExercise) {
            return res.status(400).json({ message: 'Invalid exercise entered. Please enter a valid exercise.' });
        }
        const lowerCaseExperienceLevel = experienceLevel.toLowerCase();
        if (!validExperienceLevels.includes(lowerCaseExperienceLevel)) {
            return res.status(400).json({ message: 'Invalid experience level entered. Please enter a valid experience level.' });
        }
        const openai = configureOpenAI();
        const auxiliaryExercises = auxiliaryExercisesMapping[desiredExercise.toLowerCase()] || [];
        const auxiliaryExercisesText = auxiliaryExercises.join(', ');
        const messages = [
            {
                role: "system",
                content: "You are a fitness assistant that generates specific lifting plans.",
            },
            {
                role: "user",
                content: `
          Generate a detailed multi-week lifting plan specifically for ${desiredExercise} based on the following details:
          - Height: ${height}
          - Weight: ${weight}
          - Experience Level: ${experienceLevel}
          - Gender: ${gender}
          - Desired Exercise: ${desiredExercise}
          - Target Weight: ${targetWeight}
          - Number of Weeks: ${numberOfWeeks}

          Here is the logic for generating the lifting plan:
          - The experience levels determine the base weight factor: beginner (0.5), intermediate (0.6), advanced (0.7).
          - Initial weight is calculated as weight * base weight factor.
          - Progressive overload increment is 2.5% of the initial weight per week.
          - Phases are organized as follows:
            - Foundation Building (Weeks 1-2)
            - Strength Focus (Weeks 3-4)
            - Peak Intensity (Weeks 5-6)
            - Max Effort (Weeks 7-8)

          Each phase includes specific days with detailed exercises:
          - Heavy Day:
            - Main Exercise: 4 sets of 5 reps
            - Auxiliary Exercise 1: 3 sets of 8 reps
            - Auxiliary Exercise 2: 3 sets of 12 reps
            - Auxiliary Exercise 3: 3 sets of 10 reps
          - Volume Day:
            - Main Exercise: 5 sets of 8 reps
            - Auxiliary Exercise 1: 3 sets of 8 reps
            - Auxiliary Exercise 2: 3 sets of 15 reps
            - Auxiliary Exercise 3: 3 sets of 12 reps
          - Accessory Day:
            - Main Exercise: 4 sets of 10 reps
            - Auxiliary Exercise 1: 3 sets of 12 reps
            - Auxiliary Exercise 2: 3 sets of 12 reps
            - Auxiliary Exercise 3: 3 sets of 15 reps

          Auxiliary exercises for ${desiredExercise} include: ${auxiliaryExercisesText}.

          Generate the detailed plan using this logic and provide it in the following format:

          **Week 1-2: Foundation Building**
          - **Day 1 (Heavy Day)**:
            - ${desiredExercise}: 4 sets of 5 reps at [calculated weight]
            - ${auxiliaryExercises[0]}: 3 sets of 8 reps
            - ${auxiliaryExercises[1]}: 3 sets of 12 reps
            - ${auxiliaryExercises[2]}: 3 sets of 10 reps

          - **Day 2 (Volume Day)**:
            - ${desiredExercise}: 5 sets of 8 reps at [calculated weight]
            - ${auxiliaryExercises[3]}: 3 sets of 8 reps
            - ${auxiliaryExercises[4]}: 3 sets of 15 reps
            - ${auxiliaryExercises[5]}: 3 sets of 12 reps

          - **Day 3 (Accessory Day)**:
            - ${desiredExercise}: 4 sets of 10 reps at [calculated weight]
            - ${auxiliaryExercises[6]}: 3 sets of 12 reps
            - ${auxiliaryExercises[7]}: 3 sets of 12 reps
            - ${auxiliaryExercises[8]}: 3 sets of 15 reps

          General Tips:
          - **Warm-Up**: Always warm up properly before starting your workout. Do some light cardio and dynamic stretches.
          - **Rest**: Take 2-3 minutes of rest between sets on heavy days and 1-2 minutes on volume and accessory days.
          - **Nutrition**: Ensure you’re eating enough protein and calories to support muscle growth and recovery.
          - **Sleep**: Aim for at least 7-8 hours of sleep per night.
          - **Form**: Focus on maintaining proper form throughout all exercises to prevent injury and ensure maximum muscle engagement.
          - **Progressive Overload**: Gradually increase the weight you lift each week to continuously challenge your muscles.

          Generate the full multi-week plan using the above logic and structure.
        `,
            },
        ];
        const chatResponse = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages,
        });
        if (chatResponse.choices && chatResponse.choices.length > 0) {
            const responseMessage = chatResponse.choices[0].message?.content || '';
            console.log("Generated lifting plan:", responseMessage);
            // Create the lifting plan object with all required fields
            const newLiftingPlan = {
                height,
                weight,
                experienceLevel,
                gender,
                desiredExercise,
                targetWeight,
                numberOfWeeks,
                liftingPlan: responseMessage, // Store as a plain string
                createdAt: new Date(),
            };
            // Save the lifting plan to the user
            user.liftingPlans.push(newLiftingPlan);
            await user.save();
            res.status(201).json({ message: 'Lifting plan generated successfully', liftingPlan: responseMessage });
        }
        else {
            throw new Error('Unexpected API response format');
        }
    }
    catch (error) {
        console.error('Error creating lifting plan:', error.response ? error.response.data : error.message);
        return res.status(500).json({ message: 'Error creating lifting plan' });
    }
};
export const getLiftingPlan = async (req, res, next) => {
    try {
        const user = await User.findById(res.locals.jwtData.id);
        if (!user) {
            return res.status(401).json({ message: 'User not registered OR Token malfunctioned' });
        }
        if (!user.liftingPlans || user.liftingPlans.length === 0) {
            return res.status(404).json({ message: 'No lifting plans found for the user' });
        }
        const liftingPlan = user.liftingPlans[user.liftingPlans.length - 1]; // Get the most recent lifting plan
        // Set headers to prevent caching
        res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
        res.setHeader('Pragma', 'no-cache');
        res.setHeader('Expires', '0');
        res.setHeader('Surrogate-Control', 'no-store');
        res.status(200).json({ message: 'Lifting plan retrieved successfully', liftingPlan: liftingPlan.liftingPlan });
    }
    catch (error) {
        console.error('Error retrieving lifting plan:', error);
        res.status(500).json({ message: 'Error retrieving lifting plan' });
    }
};
//# sourceMappingURL=user-controllers.js.map