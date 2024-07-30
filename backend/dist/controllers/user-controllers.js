import User from "../models/User.js";
import { hash, compare } from 'bcrypt'; //hash is used to encrypt password
import { createToken } from "../utils/token-manager.js";
import { COOKIE_NAME } from "../utils/constants.js";
import fetch from 'node-fetch';
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
        //user signup
        const { name, email, password } = req.body;
        const existingUser = await User.findOne({ email });
        if (existingUser)
            return res.status(401).send("User already registered");
        const hashedPassword = await hash(password, 10); //awaits this action before moving->password encryption  
        const user = new User({ name, email, password: hashedPassword });
        await user.save();
        //create token and store cookie
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
        const user = await User.findById(req.user.id).select('savedVideos');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json({ videos: user.savedVideos });
    }
    catch (error) {
        res.status(500).json({ message: 'Error fetching saved videos' });
    }
};
export const getVideoDetails = async (videoId) => {
    try {
        const apiKey = process.env.YOUTUBE_API_KEY; // Ensure this is correctly set in your environment variables
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
//# sourceMappingURL=user-controllers.js.map