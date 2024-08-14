import User from "../models/User.js";
import { hash, compare } from 'bcrypt'; //hash is used to encrypt password
import { createToken } from "../utils/token-manager.js";
import { COOKIE_NAME } from "../utils/constants.js";
import fetch from 'node-fetch';
import { sendThankYouEmail } from "../utils/email-service.js"; // Import the sendThankYouEmail function
import { configureOpenAI } from '../config/openai-config.js';
import { randomUUID } from "crypto";
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
            secure: true,
            sameSite: 'none',
            domain: ".fitsgpt.com",
            signed: true,
            path: "/",
        });
        const token = createToken(user._id.toString(), user.email, "7d");
        const expires = new Date();
        expires.setDate(expires.getDate() + 7);
        res.cookie(COOKIE_NAME, token, {
            path: "/",
            secure: true,
            sameSite: 'none',
            domain: ".fitsgpt.com",
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
            secure: true,
            sameSite: 'none',
            domain: ".fitsgpt.com",
            signed: true,
            path: "/",
        });
        const token = createToken(user._id.toString(), user.email, "7d");
        const expires = new Date();
        expires.setDate(expires.getDate() + 7);
        res.cookie(COOKIE_NAME, token, { path: "/",
            domain: ".fitsgpt.com", //localhost could be replaced with actual domain when it is publically hosted
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
            domain: ".fitsgpt.com",
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
export const getPlanOptions = async (req, res, next) => {
    try {
        const options = ['Lifting', 'Calisthenics', 'Endurance', 'Balance', 'Flexibility'];
        return res.status(200).json({ options });
    }
    catch (error) {
        return res.status(500).json({ message: 'Failed to retrieve options', error: error.message });
    }
};
export const createLiftingPlan = async (req, res, next) => {
    const { height, weight, experienceLevel, gender, desiredExercise, targetWeight, numberOfWeeks } = req.body;
    try {
        const user = await User.findById(res.locals.jwtData.id);
        if (!user) {
            return res.status(401).json({ message: "User not registered OR Token malfunctioned" });
        }
        const openai = configureOpenAI();
        const validationMessages = [
            {
                role: "system",
                content: "You are a fitness assistant that validates exercises and generates specific lifting plans.",
            },
            {
                role: "user",
                content: `
          Is "${desiredExercise}" a valid strength training exercise? If it is, generate a list of related auxiliary exercises that complement this exercise. If not, respond with "Invalid exercise."
        `,
            },
        ];
        const validationResponse = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: validationMessages,
        });
        if (validationResponse.choices && validationResponse.choices.length > 0) {
            const responseMessage = validationResponse.choices[0].message?.content || '';
            if (responseMessage.toLowerCase().includes("invalid exercise")) {
                return res.status(400).json({ message: 'Invalid exercise entered. Please enter a valid exercise.' });
            }
            const AuxiliaryMovements = responseMessage.split(',').map(movement => movement.trim());
            console.log("Exercise:", desiredExercise);
            console.log("Auxiliary Movements:", AuxiliaryMovements);
            const baseWeightFactor = experienceLevel === "beginner" ? 0.5 :
                experienceLevel === "intermediate" ? 0.6 : 0.7;
            const startingWeight = Math.round(targetWeight * baseWeightFactor / 5) * 5;
            const auxiliaryWeights = AuxiliaryMovements.map((movement, index) => {
                const adjustmentFactor = 0.7 - (index * 0.05);
                return {
                    movement,
                    weight: Math.round(startingWeight * adjustmentFactor / 5) * 5
                };
            });
            // Calculate the number of weeks for each phase based on total numberOfWeeks
            const foundationWeeks = Math.floor(numberOfWeeks * 0.25); // Foundation Building Phase
            const strengthFocusWeeks = Math.floor(numberOfWeeks * 0.25); // Strength Focus Phase
            const peakIntensityWeeks = Math.floor(numberOfWeeks * 0.25); // Peak Intensity Phase
            const maxEffortWeeks = numberOfWeeks - (foundationWeeks + strengthFocusWeeks + peakIntensityWeeks); // Max Effort Phase
            const planMessages = [
                {
                    role: "system",
                    content: "You are a fitness assistant that generates specific lifting plans.",
                },
                {
                    role: "user",
                    content: `
            Generate a detailed ${numberOfWeeks}-week lifting plan specifically for ${desiredExercise} based on the following details:
            - Height: ${height} inches
            - Weight: ${weight} pounds
            - Experience Level: ${experienceLevel}
            - Gender: ${gender}
            - Desired Exercise: ${desiredExercise}
            - Target Weight: ${targetWeight} pounds
            - Starting Weight (Calculated): ${startingWeight} pounds (This should be the weight used on Week 1, Day 1 and progress from here over the course of the program)
            - Number of Weeks: ${numberOfWeeks}
            
            The plan should include appropriately weighted auxiliary movements: ${auxiliaryWeights.map(aw => `${aw.movement} at ${aw.weight} pounds`).join(', ')}.
      
            **Important Considerations:**
            - Ensure all suggested weights are in common gym increments (e.g., 5-pound increments) to make the plan practical and realistic (e.g., 100 pounds instead of 99 pounds).
            - Use the calculated starting weight of ${startingWeight} pounds for Week 1, Day 1, and then progressively increase the weight over the duration of the program.
            - For each week, specify only two training days focused on the main exercise (${desiredExercise}) and its auxiliary movements. The remaining days of the week should be left for the athlete to focus on other movements or exercises as per their goals.
            - **Do not include any # symbols in the output.**
            - **Ensure to output each phase/week in detail. Do not cut anything out, especially for weeks that come later . These weeks should have the same level of detail as Weeks that came earlier in the program.**
      
            **Output Format:**
            Start with: This is a ${numberOfWeeks}-Week Plan for an ${experienceLevel} ${gender} athlete looking to improve their ${desiredExercise} to ${targetWeight} pounds
            - then add **Baseline Information**, listing height, weight, experience level, gender, desired exercise, starting weight (calculated), and target weight.
            - Break down the plan into the following phases, with each phase including detailed week-by-week breakdowns:
              - Foundation Building (Weeks 1-${foundationWeeks})
              - Strength Focus (Weeks ${foundationWeeks + 1}-${foundationWeeks + strengthFocusWeeks})
              - Peak Intensity (Weeks ${foundationWeeks + strengthFocusWeeks + 1}-${foundationWeeks + strengthFocusWeeks + peakIntensityWeeks})
              - Max Effort (Weeks ${foundationWeeks + strengthFocusWeeks + peakIntensityWeeks + 1}-${numberOfWeeks}): **Provide a detailed breakdown for each week and day, just as in the previous phases. Specify sets, reps, and weights for each day, ensuring that the athlete has a clear plan to follow for every training session.**
            - For each week, specify:
              - Day 1: The number of sets, reps, and weight for the main exercise (${desiredExercise}) and the auxiliary movements.
              - Day 2: The number of sets, reps, and weight for the main exercise (${desiredExercise}) and the auxiliary movements.
              - Mention that for the rest of the days in the week, the athlete should feel free to focus on other movements or exercises based on their overall fitness goals.
            - Provide a summary at the end of each phase, outlining the overall progress and focus.
            - Include the same tips and disclaimer as before.
          `,
                },
            ];
            const planResponse = await openai.chat.completions.create({
                model: "gpt-3.5-turbo",
                messages: planMessages,
            });
            if (planResponse.choices && planResponse.choices.length > 0) {
                const liftingPlan = planResponse.choices[0].message?.content || '';
                console.log("Generated lifting plan:", liftingPlan);
                const newLiftingPlan = {
                    Liftingid: randomUUID(),
                    height,
                    weight,
                    experienceLevel,
                    gender,
                    desiredExercise,
                    targetWeight,
                    numberOfWeeks,
                    liftingPlan,
                    createdAt: new Date(),
                };
                user.liftingPlans.push(newLiftingPlan);
                await user.save();
                res.status(201).json({ message: 'Lifting plan generated successfully', liftingPlan });
            }
            else {
                throw new Error('Unexpected API response format');
            }
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
        res.status(200).json({ message: 'Lifting plan retrieved successfully', liftingPlan: liftingPlan.liftingPlan, liftingPlanId: liftingPlan.liftingId });
    }
    catch (error) {
        console.error('Error retrieving lifting plan:', error);
        res.status(500).json({ message: 'Error retrieving lifting plan' });
    }
};
export const addSavedLiftingPlan = async (req, res, next) => {
    const { liftingPlanId } = req.body;
    const userId = res.locals.jwtData.id; // Retrieve user ID from decoded token
    if (!userId) {
        return res.status(401).json({ message: 'User not authenticated' });
    }
    try {
        console.log('User ID:', userId);
        console.log('Lifting Plan ID:', liftingPlanId);
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        console.log('User found:', user);
        const liftingPlan = user.liftingPlans.find(plan => plan.liftingId === liftingPlanId);
        if (!liftingPlan) {
            console.log('Lifting plan not found in user plans');
            return res.status(404).json({ message: 'Lifting plan not found' });
        }
        console.log('Lifting plan found:', liftingPlan);
        const liftingPlanExists = user.savedLiftingPlans.some(plan => plan.liftingId === liftingPlanId);
        if (liftingPlanExists) {
            return res.status(400).json({ message: 'Lifting plan already saved' });
        }
        user.savedLiftingPlans.push(liftingPlan);
        await user.save();
        console.log('Lifting plan saved successfully');
        res.status(201).json({ message: 'Lifting plan saved successfully' });
    }
    catch (error) {
        console.error('Error saving lifting plan:', error);
        res.status(500).json({ message: 'Error saving lifting plan' });
    }
};
export const getAllSavedLiftingPlans = async (req, res, next) => {
    const userId = res.locals.jwtData.id; // Retrieve user ID from decoded token
    if (!userId) {
        return res.status(401).json({ message: 'User not authenticated' });
    }
    try {
        // Fetch the user document freshly from the database
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        // Filter out deleted lifting plans
        //@ts-ignore
        user.savedLiftingPlans = user.savedLiftingPlans.filter(plan => !plan.deleted);
        // Save any changes (e.g., if you have automatic deletion flags)
        await user.save();
        // Set headers to prevent caching
        res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
        res.setHeader('Pragma', 'no-cache');
        res.setHeader('Expires', '0');
        res.setHeader('Surrogate-Control', 'no-store');
        res.status(200).json({ message: 'Saved lifting plans retrieved successfully', liftingPlans: user.savedLiftingPlans });
    }
    catch (error) {
        console.error('Error retrieving saved lifting plans:', error);
        res.status(500).json({ message: 'Error retrieving saved lifting plans' });
    }
};
export const clearAllSavedLiftingPlans = async (req, res, next) => {
    try {
        const user = await User.findById(res.locals.jwtData.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        //@ts-ignore
        user.savedLiftingPlans = [];
        await user.save();
        res.status(200).json({ message: 'All saved lifting plans cleared' });
    }
    catch (error) {
        console.error('Error clearing saved lifting plans:', error);
        res.status(500).json({ message: 'Error clearing saved lifting plans' });
    }
};
export const createCalisthenicsPlan = async (req, res, next) => {
    const { height, weight, experienceLevel, gender, desiredMovement, repsGoal, numberOfWeeks } = req.body;
    try {
        const user = await User.findById(res.locals.jwtData.id);
        if (!user) {
            return res.status(401).json({ message: "User not registered OR Token malfunctioned" });
        }
        const openai = configureOpenAI();
        const validationMessages = [
            {
                role: "system",
                content: "You are a fitness assistant that validates exercises and generates specific calisthenics plans.",
            },
            {
                role: "user",
                content: `
          Is "${desiredMovement}" a valid calisthenics exercise? If it is, generate a list of related auxiliary exercises that complement this movement. If not, respond with "Invalid exercise."
        `,
            },
        ];
        const validationResponse = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: validationMessages,
        });
        if (validationResponse.choices && validationResponse.choices.length > 0) {
            const responseMessage = validationResponse.choices[0].message?.content || '';
            if (responseMessage.toLowerCase().includes("invalid exercise")) {
                return res.status(400).json({ message: 'Invalid exercise entered. Please enter a valid exercise.' });
            }
            const auxiliaryMovements = responseMessage.split(',').map(movement => movement.trim());
            console.log("Movement:", desiredMovement);
            console.log("Auxiliary Movements:", auxiliaryMovements);
            // Base algorithm to calculate reps and progression
            const baseRepsFactor = experienceLevel === "beginner" ? 0.5 :
                experienceLevel === "intermediate" ? 0.7 : 0.9;
            const startingReps = Math.round(repsGoal * baseRepsFactor);
            const weeklyProgression = Math.ceil((repsGoal - startingReps) / numberOfWeeks);
            // Calculate the number of weeks for each phase based on total numberOfWeeks
            const foundationWeeks = Math.floor(numberOfWeeks * 0.25); // Foundation Building Phase
            const strengthFocusWeeks = Math.floor(numberOfWeeks * 0.25); // Strength Focus Phase
            const peakIntensityWeeks = Math.floor(numberOfWeeks * 0.25); // Peak Intensity Phase
            const maxEffortWeeks = numberOfWeeks - (foundationWeeks + strengthFocusWeeks + peakIntensityWeeks); // Max Effort Phase
            const planMessages = [
                {
                    role: "system",
                    content: "You are a fitness assistant that generates specific calisthenics plans.",
                },
                {
                    role: "user",
                    content: `
            Generate a detailed ${numberOfWeeks}-week calisthenics plan specifically for ${desiredMovement} based on the following details:
            - Height: ${height} inches
            - Weight: ${weight} pounds
            - Experience Level: ${experienceLevel}
            - Gender: ${gender}
            - Desired Movement: ${desiredMovement}
            - Target Reps: ${repsGoal} repetitions
            - Starting Reps (Calculated): ${startingReps} repetitions (This should be the number of reps used on Week 1, Day 1 and progress from here over the course of the program)
            - Number of Weeks: ${numberOfWeeks}
            
            The plan should include appropriately integrated auxiliary movements: ${auxiliaryMovements.join(', ')}.
      
            **Important Considerations:**
            - Ensure the progression in repetitions is realistic and achievable, with appropriate increases each week.
            - Use the calculated starting reps of ${startingReps} repetitions for Week 1, Day 1, and then progressively increase the reps over the duration of the program.
            - For each week, specify only two training days focused on the main movement (${desiredMovement}) and its auxiliary movements. The remaining days of the week should be left for the athlete to focus on other movements or exercises as per their goals.
            - **Do not include any # symbols in the output.**
            - **Ensure to output each phase/week in detail. Do not cut anything out, especially for weeks that come later. These weeks should have the same level of detail as Weeks that came earlier in the program.**
            - **If${desiredMovement} is typically a movement you would hold for a certain amount of time rather then do a number of reps, reflect the plan to show seconds rather then reps. **
            **Output Format:**
            Start with: This is a ${numberOfWeeks}-Week Plan for an ${experienceLevel} ${gender} athlete looking to improve their ${desiredMovement} to ${repsGoal} repetitions
            - then add **Baseline Information**, listing height, weight, experience level, gender, desired movement, and target reps.
            - Break down the plan into the following phases, with each phase including detailed week-by-week breakdowns:
              - Foundation Building (Weeks 1-${foundationWeeks})
              - Strength Focus (Weeks ${foundationWeeks + 1}-${foundationWeeks + strengthFocusWeeks})
              - Peak Intensity (Weeks ${foundationWeeks + strengthFocusWeeks + 1}-${foundationWeeks + strengthFocusWeeks + peakIntensityWeeks})
              - Max Effort (Weeks ${foundationWeeks + strengthFocusWeeks + peakIntensityWeeks + 1}-${numberOfWeeks}): **Provide a detailed breakdown for each week and day, just as in the previous phases. Specify sets, reps, and auxiliary movements for each day, ensuring that the athlete has a clear plan to follow for every training session.**
            - For each week, specify:
              - Day 1: The number of sets, reps, and auxiliary movements.
              - Day 2: The number of sets, reps, and auxiliary movements.
              - Mention that for the rest of the days in the week, the athlete should feel free to focus on other movements or exercises based on their overall fitness goals.
            - Provide a summary at the end of each phase, outlining the overall progress and focus.
            - Include the same tips and disclaimer as before.
          `,
                },
            ];
            const planResponse = await openai.chat.completions.create({
                model: "gpt-3.5-turbo",
                messages: planMessages,
            });
            if (planResponse.choices && planResponse.choices.length > 0) {
                const calisthenicsPlan = planResponse.choices[0].message?.content || '';
                console.log("Generated calisthenics plan:", calisthenicsPlan);
                const newCalisthenicsPlan = {
                    calisthenicsId: randomUUID(),
                    height,
                    weight,
                    experienceLevel,
                    gender,
                    desiredMovement,
                    repsGoal,
                    numberOfWeeks,
                    calisthenicsPlan,
                    createdAt: new Date(),
                };
                user.calisthenicsPlans.push(newCalisthenicsPlan);
                await user.save();
                res.status(201).json({ message: 'Calisthenics plan generated successfully', calisthenicsPlan });
            }
            else {
                throw new Error('Unexpected API response format');
            }
        }
        else {
            throw new Error('Unexpected API response format');
        }
    }
    catch (error) {
        console.error('Error creating calisthenics plan:', error.response ? error.response.data : error.message);
        return res.status(500).json({ message: 'Error creating calisthenics plan' });
    }
};
export const getCalisthenicsPlan = async (req, res) => {
    try {
        const userId = res.locals.jwtData.id;
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        // Fetch the most recent calisthenics plan
        const calisthenicsPlan = user.calisthenicsPlans[user.calisthenicsPlans.length - 1]; // Assuming you want the latest plan
        if (!calisthenicsPlan) {
            return res.status(404).json({ message: "Calisthenics plan not found" });
        }
        console.log("Sending Calisthenics Plan:", calisthenicsPlan); // Log the data being sent
        return res.status(200).json({ calisthenicsPlan });
    }
    catch (error) {
        console.error("Error fetching calisthenics plan:", error);
        return res.status(500).json({ message: "Server error" });
    }
};
export const addSavedCalisthenicsPlan = async (req, res, next) => {
    const { calisthenicsPlanId } = req.body; // Adjusted variable name to match frontend
    const userId = res.locals.jwtData.id; // Retrieve user ID from decoded token
    if (!userId) {
        return res.status(401).json({ message: 'User not authenticated' });
    }
    try {
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        // Find the calisthenics plan by its id
        const calisthenicsPlan = user.calisthenicsPlans.find(plan => plan.calisthenicsId === calisthenicsPlanId);
        if (!calisthenicsPlan) {
            return res.status(404).json({ message: 'Calisthenics plan not found' });
        }
        // Check if the calisthenics plan is already saved
        const calisthenicsPlanExists = user.savedCalisthenicsPlans.some(plan => plan.calisthenicsId === calisthenicsPlanId);
        if (calisthenicsPlanExists) {
            return res.status(400).json({ message: 'Calisthenics plan already saved' });
        }
        // Save the plan
        user.savedCalisthenicsPlans.push(calisthenicsPlan);
        await user.save();
        res.status(201).json({ message: 'Calisthenics plan saved successfully' });
    }
    catch (error) {
        console.error('Error saving calisthenics plan:', error);
        res.status(500).json({ message: 'Error saving calisthenics plan' });
    }
};
export const getSavedCalisthenicsPlans = async (req, res, next) => {
    const userId = res.locals.jwtData.id; // Retrieve user ID from decoded token
    if (!userId) {
        return res.status(401).json({ message: 'User not authenticated' });
    }
    try {
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        // Filter out deleted calisthenics plans
        //@ts-ignore
        user.savedCalisthenicsPlans = user.savedCalisthenicsPlans.filter(plan => !plan.deleted);
        await user.save();
        res.status(200).json({ message: 'Saved calisthenics plans retrieved successfully', calisthenicsPlans: user.savedCalisthenicsPlans });
    }
    catch (error) {
        console.error('Error retrieving saved calisthenics plans:', error);
        res.status(500).json({ message: 'Error retrieving saved calisthenics plans' });
    }
};
export const clearAllSavedCalisthenicsPlans = async (req, res, next) => {
    try {
        const user = await User.findById(res.locals.jwtData.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        //@ts-ignore
        user.savedCalisthenicsPlans = [];
        await user.save();
        res.status(200).json({ message: 'All saved calisthenics plans cleared' });
    }
    catch (error) {
        console.error('Error clearing saved calisthenics plans:', error);
        res.status(500).json({ message: 'Error clearing saved calisthenics plans' });
    }
};
export const createEndurancePlan = async (req, res, next) => {
    const { age, weight, fitnessLevel, gender, preferredActivity, distanceGoal, timeGoal, numberOfWeeks } = req.body;
    try {
        const user = await User.findById(res.locals.jwtData.id);
        if (!user) {
            return res.status(401).json({ message: "User not registered OR Token malfunctioned" });
        }
        const openai = configureOpenAI();
        const validationMessages = [
            {
                role: "system",
                content: "You are a fitness assistant that validates endurance activities and generates specific endurance plans.",
            },
            {
                role: "user",
                content: `
          Is "${preferredActivity}" a valid endurance activity? If it is, generate a list of related training sessions that complement this activity. If not, respond with "Invalid activity."
        `,
            },
        ];
        const validationResponse = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: validationMessages,
        });
        if (validationResponse.choices && validationResponse.choices.length > 0) {
            const responseMessage = validationResponse.choices[0].message?.content || '';
            if (responseMessage.toLowerCase().includes("invalid activity")) {
                return res.status(400).json({ message: 'Invalid activity entered. Please enter a valid endurance activity.' });
            }
            const trainingSessions = responseMessage.split(',').map(session => session.trim());
            console.log("Activity:", preferredActivity);
            console.log("Training Sessions:", trainingSessions);
            // Base algorithm to calculate distance and time progression
            const baseDistanceFactor = fitnessLevel === "Beginner" ? 0.6 :
                fitnessLevel === "Intermediate" ? 0.75 : 0.9;
            const startingDistance = Math.round(distanceGoal * baseDistanceFactor);
            const weeklyProgression = Math.ceil((distanceGoal - startingDistance) / numberOfWeeks);
            const baseTimeFactor = fitnessLevel === "Beginner" ? 0.6 :
                fitnessLevel === "Intermediate" ? 0.75 : 0.9;
            const startingTime = Math.round(parseFloat(timeGoal) * baseTimeFactor);
            const weeklyTimeProgression = Math.ceil((parseFloat(timeGoal) - startingTime) / numberOfWeeks);
            const planMessages = [
                {
                    role: "system",
                    content: "You are a fitness assistant that generates specific endurance plans.",
                },
                {
                    role: "user",
                    content: `
            Generate a detailed ${numberOfWeeks}-week endurance plan specifically for ${preferredActivity} based on the following details:
            - Age: ${age}
            - Weight: ${weight} pounds
            - Fitness Level: ${fitnessLevel}
            - Gender: ${gender}
            - Preferred Activity: ${preferredActivity}
            - Target Distance: ${distanceGoal} miles/kilometers
            - Target Time: ${timeGoal} minutes
            - Starting Distance (Calculated): ${startingDistance} miles/kilometers (This should be the distance used on Week 1, Day 1 and progress from here over the course of the program)
            - Starting Time (Calculated): ${startingTime} minutes (This should be the time used on Week 1, Day 1 and progress from here over the course of the program)
            - Number of Weeks: ${numberOfWeeks}
            
            The plan should include appropriately integrated training sessions: ${trainingSessions.join(', ')}.

            **Important Considerations:**
            - Ensure the progression in distance and time is realistic and achievable, with appropriate increases each week.
            - Use the calculated starting distance of ${startingDistance} miles/kilometers and starting time of ${startingTime} minutes for Week 1, Day 1, and then progressively increase these metrics over the duration of the program.
            - For each week, specify training days focused on the main activity (${preferredActivity}) and its complementary sessions.
            - **Do not include any # symbols in the output.**
            - **Ensure to output each phase/week in detail.**
            - **Provide a detailed breakdown for each week and day, ensuring the athlete has a clear plan to follow for every training session.**
            - Include general tips for warm-up, rest, nutrition, sleep, and form.
            **Output Format:**
            Start with: This is a ${numberOfWeeks}-Week Plan for an ${fitnessLevel} ${gender} athlete looking to improve their ${preferredActivity} to ${distanceGoal} miles/kilometers and ${timeGoal} minutes.
            - then add **Baseline Information**, listing age, weight, fitness level, gender, preferred activity, target distance, and target time.
            - Break down the plan into detailed week-by-week breakdowns.
            - For each week, specify:
              - Day 1: The distance, time, and training sessions.
              - Day 2: The distance, time, and training sessions.
              - Mention that for the rest of the days in the week, the athlete should focus on recovery or other complementary activities.
            - Provide a summary at the end, outlining the overall progress and focus.
            - Include the same tips and disclaimer as before.
          `,
                },
            ];
            const planResponse = await openai.chat.completions.create({
                model: "gpt-3.5-turbo",
                messages: planMessages,
            });
            if (planResponse.choices && planResponse.choices.length > 0) {
                const endurancePlan = planResponse.choices[0].message?.content || '';
                console.log("Generated endurance plan:", endurancePlan);
                const newEndurancePlan = {
                    enduranceId: randomUUID(),
                    age,
                    weight,
                    fitnessLevel,
                    gender,
                    preferredActivity,
                    distanceGoal,
                    timeGoal,
                    numberOfWeeks,
                    endurancePlan,
                    createdAt: new Date(),
                };
                user.endurancePlans.push(newEndurancePlan);
                await user.save();
                res.status(201).json({ message: 'Endurance plan generated successfully', endurancePlan });
            }
            else {
                throw new Error('Unexpected API response format');
            }
        }
        else {
            throw new Error('Unexpected API response format');
        }
    }
    catch (error) {
        console.error('Error creating endurance plan:', error.response ? error.response.data : error.message);
        return res.status(500).json({ message: 'Error creating endurance plan' });
    }
};
export const getEndurancePlan = async (req, res, next) => {
    try {
        const userId = res.locals.jwtData.id;
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        // Fetch the most recent endurance plan
        const endurancePlan = user.endurancePlans[user.endurancePlans.length - 1]; // Assuming you want the latest plan
        if (!endurancePlan) {
            return res.status(404).json({ message: "Endurance plan not found" });
        }
        console.log("Sending Endurance Plan:", endurancePlan); // Log the data being sent
        return res.status(200).json({ endurancePlan });
    }
    catch (error) {
        console.error("Error fetching endurance plan:", error);
        return res.status(500).json({ message: "Server error" });
    }
};
// Controller to save an endurance plan
export const addSavedEndurancePlan = async (req, res, next) => {
    const { endurancePlanId } = req.body; // Adjusted variable name to match frontend
    const userId = res.locals.jwtData.id; // Retrieve user ID from decoded token
    if (!userId) {
        return res.status(401).json({ message: 'User not authenticated' });
    }
    try {
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        // Find the endurance plan by its id
        const endurancePlan = user.endurancePlans.find(plan => plan.enduranceId === endurancePlanId);
        if (!endurancePlan) {
            return res.status(404).json({ message: 'Endurance plan not found' });
        }
        // Check if the endurance plan is already saved
        const endurancePlanExists = user.savedEndurancePlans.some(plan => plan.enduranceId === endurancePlanId);
        if (endurancePlanExists) {
            return res.status(400).json({ message: 'Endurance plan already saved' });
        }
        // Save the plan
        user.savedEndurancePlans.push(endurancePlan);
        await user.save();
        res.status(201).json({ message: 'Endurance plan saved successfully' });
    }
    catch (error) {
        console.error('Error saving endurance plan:', error);
        res.status(500).json({ message: 'Error saving endurance plan' });
    }
};
export const getSavedEndurancePlans = async (req, res, next) => {
    const userId = res.locals.jwtData.id; // Retrieve user ID from decoded token
    if (!userId) {
        return res.status(401).json({ message: 'User not authenticated' });
    }
    try {
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        // Filter out deleted endurance plans
        //@ts-ignore
        user.savedEndurancePlans = user.savedEndurancePlans.filter(plan => !plan.deleted);
        await user.save();
        res.status(200).json({ message: 'Saved endurance plans retrieved successfully', endurancePlans: user.savedEndurancePlans });
    }
    catch (error) {
        console.error('Error retrieving saved endurance plans:', error);
        res.status(500).json({ message: 'Error retrieving saved endurance plans' });
    }
};
// Controller to clear all saved endurance plans
export const clearAllSavedEndurancePlans = async (req, res, next) => {
    try {
        const user = await User.findById(res.locals.jwtData.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        //@ts-ignore
        user.savedEndurancePlans = [];
        await user.save();
        res.status(200).json({ message: 'All saved endurance plans cleared' });
    }
    catch (error) {
        console.error('Error clearing saved endurance plans:', error);
        res.status(500).json({ message: 'Error clearing saved endurance plans' });
    }
};
export const createBalancePlan = async (req, res, next) => {
    const { age, fitnessLevel, gender, targetMovement, stabilityGoal, numberOfWeeks } = req.body;
    try {
        const user = await User.findById(res.locals.jwtData.id);
        if (!user) {
            return res.status(401).json({ message: "User not registered OR Token malfunctioned" });
        }
        const openai = configureOpenAI();
        const validationMessages = [
            {
                role: "system",
                content: "You are a fitness assistant that validates exercises and generates specific balance plans.",
            },
            {
                role: "user",
                content: `Is "${targetMovement}" a valid balance exercise? If it is, generate a list of related auxiliary exercises that complement this movement. If not, respond with "Invalid exercise."`,
            },
        ];
        const validationResponse = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: validationMessages,
        });
        if (validationResponse.choices && validationResponse.choices.length > 0) {
            const responseMessage = validationResponse.choices[0].message?.content || '';
            if (responseMessage.toLowerCase().includes("invalid exercise")) {
                return res.status(400).json({ message: 'Invalid exercise entered. Please enter a valid exercise.' });
            }
            const auxiliaryMovements = responseMessage.split(',').map(movement => movement.trim());
            console.log("Movement:", targetMovement);
            console.log("Auxiliary Movements:", auxiliaryMovements);
            // Base algorithm to calculate stability progression
            const baseStabilityFactor = fitnessLevel === "Beginner" ? 0.5 :
                fitnessLevel === "Intermediate" ? 0.7 : 0.9;
            const startingStability = Math.round(parseFloat(stabilityGoal) * baseStabilityFactor);
            const weeklyProgression = Math.ceil((parseFloat(stabilityGoal) - startingStability) / numberOfWeeks);
            // Calculate the number of weeks for each phase based on total numberOfWeeks
            const foundationWeeks = Math.floor(numberOfWeeks * 0.25); // Foundation Building Phase
            const strengthFocusWeeks = Math.floor(numberOfWeeks * 0.25); // Strength Focus Phase
            const peakIntensityWeeks = Math.floor(numberOfWeeks * 0.25); // Peak Intensity Phase
            const maxEffortWeeks = numberOfWeeks - (foundationWeeks + strengthFocusWeeks + peakIntensityWeeks); // Max Effort Phase
            const planMessages = [
                {
                    role: "system",
                    content: "You are a fitness assistant that generates specific balance plans.",
                },
                {
                    role: "user",
                    content: `
            Generate a detailed ${numberOfWeeks}-week balance plan specifically for ${targetMovement} based on the following details:
            - Age: ${age} years
            - Fitness Level: ${fitnessLevel}
            - Gender: ${gender}
            - Target Movement: ${targetMovement}
            - Stability Goal: ${stabilityGoal} seconds
            - Starting Stability (Calculated): ${startingStability} seconds (This should be the starting stability goal for Week 1, Day 1 and should progress from here over the course of the program)
            - Number of Weeks: ${numberOfWeeks}
            
            The plan should include appropriately integrated auxiliary movements: ${auxiliaryMovements.join(', ')}.
      
            **Important Considerations:**
            - Ensure the progression in stability is realistic and achievable, with appropriate increases each week.
            - Use the calculated starting stability of ${startingStability} seconds for Week 1, Day 1, and then progressively increase the stability over the duration of the program.
            - For each week, specify only two training days focused on the main movement (${targetMovement}) and its auxiliary movements. The remaining days of the week should be left for the athlete to focus on other movements or exercises as per their goals.
            - **Do not include any # symbols in the output.**
            - **Ensure to output each phase/week in detail. Do not cut anything out, especially for weeks that come later. These weeks should have the same level of detail as Weeks that came earlier in the program.**
          `,
                },
            ];
            const planResponse = await openai.chat.completions.create({
                model: "gpt-3.5-turbo",
                messages: planMessages,
            });
            if (planResponse.choices && planResponse.choices.length > 0) {
                const balancePlan = planResponse.choices[0].message?.content || '';
                console.log("Generated balance plan:", balancePlan);
                const newBalancePlan = {
                    balanceId: randomUUID(),
                    age,
                    fitnessLevel,
                    gender,
                    targetMovement,
                    stabilityGoal,
                    numberOfWeeks,
                    balancePlan,
                    createdAt: new Date(),
                };
                user.balancePlans.push(newBalancePlan);
                await user.save();
                res.status(201).json({ message: 'Balance plan generated successfully', balancePlan });
            }
            else {
                throw new Error('Unexpected API response format');
            }
        }
        else {
            throw new Error('Unexpected API response format');
        }
    }
    catch (error) {
        console.error('Error creating balance plan:', error.response ? error.response.data : error.message);
        return res.status(500).json({ message: 'Error creating balance plan' });
    }
};
export const getBalancePlan = async (req, res, next) => {
    const userId = res.locals.jwtData.id; // Retrieve user ID from decoded token
    if (!userId) {
        return res.status(401).json({ message: 'User not authenticated' });
    }
    try {
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        // Fetch the most recent balance plan
        const balancePlan = user.balancePlans[user.balancePlans.length - 1]; // Assuming you want the latest plan
        if (!balancePlan) {
            return res.status(404).json({ message: 'Balance plan not found' });
        }
        console.log("Sending Balance Plan:", balancePlan); // Log the data being sent
        return res.status(200).json({ balancePlan });
    }
    catch (error) {
        console.error("Error fetching balance plan:", error);
        return res.status(500).json({ message: "Server error" });
    }
};
export const addSavedBalancePlan = async (req, res, next) => {
    const { balancePlanId } = req.body;
    const userId = res.locals.jwtData.id;
    if (!userId) {
        return res.status(401).json({ message: 'User not authenticated' });
    }
    try {
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        const balancePlan = user.balancePlans.find(plan => plan.balanceId === balancePlanId);
        if (!balancePlan) {
            return res.status(404).json({ message: 'Balance plan not found' });
        }
        const balancePlanExists = user.savedBalancePlans.some(plan => plan.balanceId === balancePlanId);
        if (balancePlanExists) {
            return res.status(400).json({ message: 'Balance plan already saved' });
        }
        user.savedBalancePlans.push(balancePlan);
        await user.save();
        res.status(201).json({ message: 'Balance plan saved successfully' });
    }
    catch (error) {
        console.error('Error saving balance plan:', error);
        res.status(500).json({ message: 'Error saving balance plan' });
    }
};
export const getSavedBalancePlans = async (req, res, next) => {
    const userId = res.locals.jwtData.id;
    if (!userId) {
        return res.status(401).json({ message: 'User not authenticated' });
    }
    try {
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        //@ts-ignore
        user.savedBalancePlans = user.savedBalancePlans.filter(plan => !plan.deleted);
        await user.save();
        res.status(200).json({ message: 'Saved balance plans retrieved successfully', balancePlans: user.savedBalancePlans });
    }
    catch (error) {
        console.error('Error retrieving saved balance plans:', error);
        res.status(500).json({ message: 'Error retrieving saved balance plans' });
    }
};
export const clearAllSavedBalancePlans = async (req, res, next) => {
    try {
        const user = await User.findById(res.locals.jwtData.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        //@ts-ignore
        user.savedBalancePlans = [];
        await user.save();
        res.status(200).json({ message: 'All saved balance plans cleared' });
    }
    catch (error) {
        console.error('Error clearing saved balance plans:', error);
        res.status(500).json({ message: 'Error clearing saved balance plans' });
    }
};
export const createFlexibilityPlan = async (req, res, next) => {
    const { age, fitnessLevel, gender, targetArea, flexibilityGoal, numberOfWeeks } = req.body;
    try {
        const user = await User.findById(res.locals.jwtData.id);
        if (!user) {
            return res.status(401).json({ message: "User not registered OR Token malfunctioned" });
        }
        const openai = configureOpenAI();
        const validationMessages = [
            {
                role: "system",
                content: "You are a fitness assistant that validates exercises and generates specific flexibility plans.",
            },
            {
                role: "user",
                content: `Is "${targetArea}" a valid area for flexibility training? If it is, generate a list of related stretches that complement this area. If not, respond with "Invalid area."`,
            },
        ];
        const validationResponse = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: validationMessages,
        });
        if (validationResponse.choices && validationResponse.choices.length > 0) {
            const responseMessage = validationResponse.choices[0].message?.content || '';
            if (responseMessage.toLowerCase().includes("invalid area")) {
                return res.status(400).json({ message: 'Invalid area entered. Please enter a valid area.' });
            }
            const relatedStretches = responseMessage.split(',').map(stretch => stretch.trim());
            // Base algorithm to calculate stretch duration and progression
            const baseDurationFactor = fitnessLevel === "beginner" ? 0.5 :
                fitnessLevel === "intermediate" ? 0.7 : 0.9;
            const startingDuration = Math.round(30 * baseDurationFactor); // 30 seconds as base
            const weeklyProgression = Math.ceil((60 - startingDuration) / numberOfWeeks); // Progression towards 60 seconds
            const planMessages = [
                {
                    role: "system",
                    content: "You are a fitness assistant that generates specific flexibility plans.",
                },
                {
                    role: "user",
                    content: `
            Generate a detailed ${numberOfWeeks}-week flexibility plan specifically for the ${targetArea} based on the following details:
            - Age: ${age} years
            - Fitness Level: ${fitnessLevel}
            - Gender: ${gender}
            - Target Area: ${targetArea}
            - Flexibility Goal: ${flexibilityGoal}
            - Starting Duration: ${startingDuration} seconds (Week 1)
            - Weekly Progression: ${weeklyProgression} seconds/week
            - Include related stretches: ${relatedStretches.join(', ')}.

            **Output Format:**
            - Provide a week-by-week plan detailing the stretches and progression in duration.
            - Include safety tips and advice for optimal flexibility training.
          `,
                },
            ];
            const planResponse = await openai.chat.completions.create({
                model: "gpt-3.5-turbo",
                messages: planMessages,
            });
            if (planResponse.choices && planResponse.choices.length > 0) {
                const flexibilityPlan = planResponse.choices[0].message?.content || '';
                console.log("Generated flexibility plan:", flexibilityPlan);
                const newFlexibilityPlan = {
                    flexibilityId: randomUUID(),
                    age,
                    fitnessLevel,
                    gender,
                    targetArea,
                    flexibilityGoal,
                    numberOfWeeks,
                    flexibilityPlan,
                    createdAt: new Date(),
                };
                user.flexibilityPlans.push(newFlexibilityPlan);
                await user.save();
                res.status(201).json({ message: 'Flexibility plan generated successfully', flexibilityPlan });
            }
            else {
                throw new Error('Unexpected API response format');
            }
        }
        else {
            throw new Error('Unexpected API response format');
        }
    }
    catch (error) {
        console.error('Error creating flexibility plan:', error.response ? error.response.data : error.message);
        return res.status(500).json({ message: 'Error creating flexibility plan' });
    }
};
export const getFlexibilityPlan = async (req, res, next) => {
    const userId = res.locals.jwtData.id;
    if (!userId) {
        return res.status(401).json({ message: 'User not authenticated' });
    }
    try {
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        const flexibilityPlan = user.flexibilityPlans[user.flexibilityPlans.length - 1];
        if (!flexibilityPlan) {
            return res.status(404).json({ message: 'Flexibility plan not found' });
        }
        return res.status(200).json({ flexibilityPlan });
    }
    catch (error) {
        console.error("Error fetching flexibility plan:", error);
        return res.status(500).json({ message: "Server error" });
    }
};
export const getSavedFlexibilityPlans = async (req, res, next) => {
    const userId = res.locals.jwtData.id;
    if (!userId) {
        return res.status(401).json({ message: 'User not authenticated' });
    }
    try {
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        //@ts-ignore
        user.savedFlexibilityPlans = user.savedFlexibilityPlans.filter(plan => !plan.deleted);
        await user.save();
        res.status(200).json({ message: 'Saved flexibility plans retrieved successfully', flexibilityPlans: user.savedFlexibilityPlans });
    }
    catch (error) {
        console.error('Error retrieving saved flexibility plans:', error);
        res.status(500).json({ message: 'Error retrieving saved flexibility plans' });
    }
};
export const addSavedFlexibilityPlan = async (req, res, next) => {
    const { flexibilityPlanId } = req.body;
    const userId = res.locals.jwtData.id;
    if (!userId) {
        return res.status(401).json({ message: 'User not authenticated' });
    }
    try {
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        const flexibilityPlan = user.flexibilityPlans.find(plan => plan.flexibilityId === flexibilityPlanId);
        if (!flexibilityPlan) {
            return res.status(404).json({ message: 'Flexibility plan not found' });
        }
        const planExists = user.savedFlexibilityPlans.some(plan => plan.flexibilityId === flexibilityPlanId);
        if (planExists) {
            return res.status(400).json({ message: 'Flexibility plan already saved' });
        }
        user.savedFlexibilityPlans.push(flexibilityPlan);
        await user.save();
        res.status(201).json({ message: 'Flexibility plan saved successfully' });
    }
    catch (error) {
        console.error('Error saving flexibility plan:', error);
        res.status(500).json({ message: 'Error saving flexibility plan' });
    }
};
export const clearAllSavedFlexibilityPlans = async (req, res, next) => {
    try {
        const user = await User.findById(res.locals.jwtData.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        //@ts-ignore
        user.savedFlexibilityPlans = [];
        await user.save();
        res.status(200).json({ message: 'All saved flexibility plans cleared' });
    }
    catch (error) {
        console.error('Error clearing saved flexibility plans:', error);
        res.status(500).json({ message: 'Error clearing saved flexibility plans' });
    }
};
export const getAboutDeveloper = async (req, res, next) => {
    try {
        return res.status(200).json({ message: "About the Developer page opened successfully" });
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({ message: "ERROR", cause: error.message });
    }
};
//# sourceMappingURL=user-controllers.js.map