import { NextFunction,Request, Response} from "express";
import User from "../models/User.js";
import { hash,compare } from 'bcrypt'//hash is used to encrypt password
import { createToken } from "../utils/token-manager.js";
import { COOKIE_NAME } from "../utils/constants.js";
import fetch from 'node-fetch';
import { sendThankYouEmail } from "../utils/email-service.js"; // Import the sendThankYouEmail function
import OpenAi from 'openai'
import { configureOpenAI } from '../config/openai-config.js';
import { ChatCompletionMessageParam } from 'openai/resources/chat/completions'; // Import the necessary type
import { randomUUID } from "crypto";
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








export const getAllUsers = async (
   req:Request,
   res:Response,
   next:NextFunction
)=>{
   try {
      //get all users
    const users = await User.find()
    return res.status(200).json({message: "OK",users});
   } catch (error) {
      console.log(error);
      return res.status(200).json({message: "ERROR",cause:error.message});
   }
};


export const userSignup = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { name, email, password } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(401).send("User already registered");
    const hashedPassword = await hash(password, 10); // awaits this action before moving->password encryption
    const user = new User({ name, email, password: hashedPassword });
    await user.save();

    // create token and store cookie
    res.clearCookie(COOKIE_NAME, {
      httpOnly: true,
      secure:true,
      sameSite: 'none',
      domain: "fit-gpt-frontend.onrender.com",
      signed: true,
      path: "/",
    });

    const token = createToken(user._id.toString(), user.email, "7d");
    const expires = new Date();
    expires.setDate(expires.getDate() + 7);
    res.cookie(COOKIE_NAME, token, {
      path: "/",
 
      secure:true,
      sameSite: 'none',
      domain: "fit-gpt-frontend.onrender.com",
      expires,
      httpOnly: true,
      signed: true,
    });

    // Send thank you email
    await sendThankYouEmail(user.email, user.name);

    return res.status(201).json({ message: "OK", name: user.name, email: user.email, token });
  } catch (error) {
    console.log(error);
    return res.status(200).json({ message: "ERROR", cause: error.message });
  }
};


export const userLogin = async (
   req:Request,
   res:Response,
   next:NextFunction
)=>{
   try {
      //user login
   const {email,password} = req.body;
   const user = await User.findOne({ email })
   if(!user){
      return res.status(401).send("User not registered");
   }
   const isPasswordCorrect = await compare(password, user.password);
   if(!isPasswordCorrect){
      return res.status(403).send("Incorrect Password");
   }
   //Create token and store cookie
   res.clearCookie(COOKIE_NAME,{
      httpOnly: true,
      
      secure:true,
      sameSite: 'none',
      domain: "fit-gpt-frontend.onrender.com",
     signed: true,
     path: "/",
      
   });
   const token = createToken(user._id.toString(),user.email,"7d");
   const expires = new Date();
   expires.setDate(expires.getDate()+7);
   res.cookie(COOKIE_NAME,token,
   {path:"/", 
   domain: "fit-gpt-frontend.onrender.com",//localhost could be replaced with actual domain when it is publically hosted
   expires,
   httpOnly:true,
   
   signed:true,
 });

    return res.status(201).json({message: "OK",name:user.name,email:user.email });
   } catch (error) {
      console.log(error);
      return res.status(200).json({message: "ERROR",cause:error.message});
   }
};


export const verifyUser = async (
   req:Request,
   res:Response,
   next:NextFunction
)=>{
   try {
   //user token check 
   const user = await User.findById(res.locals.jwtData.id );
   if(!user){
      return res.status(401).send("User not registered or Token Malfunction");
   }
   console.log(user._id.toString(),res.locals.jwtData.id);
   if(user._id.toString()!==res.locals.jwtData.id){
      return res.status(401).send("Permissons Did not Match");
   }
  
  
  

    return res.status(201).json({message: "OK",name:user.name,email:user.email });
   } catch (error) {
      console.log(error);
      return res.status(200).json({message: "ERROR",cause:error.message});
   }
};




export const userlogout = async (
   req:Request,
   res:Response,
   next:NextFunction
)=>{
   try {
   //user token check 
   const user = await User.findById(res.locals.jwtData.id );
   if(!user){
      return res.status(401).send("User not registered or Token Malfunction");
   }
   console.log(user._id.toString(),res.locals.jwtData.id);
   if(user._id.toString()!==res.locals.jwtData.id){
      return res.status(401).send("Permissons Did not Match");
   }
   res.clearCookie(COOKIE_NAME,{
      httpOnly: true,
     domain: "https://fit-gpt-frontend.onrender.com",
     signed: true,
  
     path: "/",
      
   });
    return res.status(201).json({message: "OK",name:user.name,email:user.email });
   } catch (error) {
      console.log(error);
      return res.status(200).json({message: "ERROR",cause:error.message});
   }
};


export const getSavedVideos = async (req, res) => {
   try {
     const user = await User.findById(res.locals.jwtData.id).select('savedVideos');
     if (!user) {
       return res.status(404).json({ message: 'User not found' });
     }
     res.json({ videos: user.savedVideos });
   } catch (error) {
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
   } catch (error) {
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
   } catch (error) {
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
  } catch (error) {
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
  } catch (error) {
    console.error('Error deleting saved video:', error);
    res.status(500).json({ message: 'Error deleting saved video' });
  }
};

const validExperienceLevels = ['beginner', 'intermediate', 'advanced'];

const auxiliaryExercisesMapping = {
  'bench press': ['Incline Bench Press', 'Dumbbell Flyes', 'Tricep Dips', 'Close-Grip Bench Press', 'Push-Ups', 'Tricep Pushdowns', 'Incline Dumbbell Bench Press', 'Pec Deck Machine', 'Overhead Tricep Extension', 'Cable Crossovers'],
  'incline bench press': ['Dumbbell Bench Press', 'Chest Fly', 'Tricep Dips', 'Push-Ups', 'Incline Dumbbell Fly', 'Incline Push-Ups', 'Chest Dips', 'Tricep Extensions'],
  'decline bench press': ['Flat Bench Press', 'Dumbbell Bench Press', 'Chest Fly', 'Tricep Dips', 'Push-Ups', 'Cable Crossovers', 'Pec Deck Machine', 'Incline Bench Press'],
  'dumbbell bench press': ['Flat Bench Press', 'Chest Fly', 'Push-Ups', 'Tricep Dips', 'Incline Bench Press', 'Cable Crossovers', 'Tricep Extensions', 'Pec Deck Machine'],
  
  'squat': ['Leg Press', 'Lunges', 'Leg Extensions', 'Hamstring Curls', 'Calf Raises', 'Bulgarian Split Squats', 'Step-Ups', 'Glute Bridges', 'Box Squats'],
  'front squat': ['Leg Press', 'Lunges', 'Hamstring Curls', 'Calf Raises', 'Bulgarian Split Squats', 'Step-Ups', 'Goblet Squats', 'Wall Sits'],
  'Bulgarian split squat': ['Lunges', 'Step-Ups', 'Hamstring Curls', 'Calf Raises', 'Goblet Squats', 'Leg Press', 'Single-Leg Deadlifts', 'Leg Extensions'],
  'overhead squat': ['Snatch', 'Push Press', 'Lunges', 'Step-Ups', 'Leg Press', 'Calf Raises', 'Hamstring Curls', 'Goblet Squats'],
  
  'deadlift': ['Romanian Deadlift', 'Good Mornings', 'Back Extensions', 'Barbell Rows', 'Pull-Ups', 'Shrugs', 'Kettlebell Swings', 'Hip Thrusts', 'Single-Leg Deadlifts'],
  'romanian deadlift': ['Leg Curls', 'Good Mornings', 'Back Extensions', 'Single-Leg Deadlifts', 'Hip Thrusts', 'Glute Bridges', 'Hamstring Curls', 'Kettlebell Swings'],
  'sumo deadlift': ['Romanian Deadlift', 'Good Mornings', 'Back Extensions', 'Hip Thrusts', 'Single-Leg Deadlifts', 'Shrugs', 'Kettlebell Swings', 'Leg Press'],
  'single-leg deadlift': ['Romanian Deadlift', 'Good Mornings', 'Hip Thrusts', 'Glute Bridges', 'Leg Press', 'Step-Ups', 'Hamstring Curls', 'Calf Raises'],
  
  'overhead press': ['Dumbbell Shoulder Press', 'Lateral Raises', 'Front Raises', 'Face Pulls', 'Tricep Pushdowns', 'Arnold Press', 'Upright Rows', 'Bent Over Lateral Raises'],
  'seated shoulder press': ['Dumbbell Shoulder Press', 'Lateral Raises', 'Front Raises', 'Face Pulls', 'Arnold Press', 'Tricep Extensions', 'Upright Rows', 'Shrugs'],
  'dumbbell shoulder press': ['Seated Shoulder Press', 'Lateral Raises', 'Front Raises', 'Face Pulls', 'Arnold Press', 'Tricep Extensions', 'Upright Rows', 'Shrugs'],
  'Arnold press': ['Dumbbell Shoulder Press', 'Lateral Raises', 'Front Raises', 'Face Pulls', 'Seated Shoulder Press', 'Tricep Extensions', 'Upright Rows', 'Shrugs'],
  
  'barbell curl': ['Dumbbell Curl', 'Hammer Curl', 'Preacher Curl', 'Concentration Curl', 'Cable Curl', 'Reverse Curl', 'Spider Curl', 'Zottman Curl'],
  'dumbbell curl': ['Barbell Curl', 'Hammer Curl', 'Preacher Curl', 'Concentration Curl', 'Cable Curl', 'Reverse Curl', 'Spider Curl', 'Zottman Curl'],
  'hammer curl': ['Dumbbell Curl', 'Barbell Curl', 'Preacher Curl', 'Concentration Curl', 'Cable Curl', 'Reverse Curl', 'Spider Curl', 'Zottman Curl'],
  'concentration curl': ['Dumbbell Curl', 'Hammer Curl', 'Preacher Curl', 'Cable Curl', 'Reverse Curl', 'Spider Curl', 'Zottman Curl', 'Barbell Curl'],
  
  'tricep extension': ['Skull Crusher', 'Tricep Dip', 'Overhead Tricep Extension', 'Close-Grip Bench Press', 'Tricep Pushdowns', 'Kickbacks', 'Bench Dips', 'Diamond Push-Ups'],
  'skull crusher': ['Tricep Extension', 'Tricep Dip', 'Overhead Tricep Extension', 'Close-Grip Bench Press', 'Tricep Pushdowns', 'Kickbacks', 'Bench Dips', 'Diamond Push-Ups'],
  'tricep dip': ['Tricep Extension', 'Skull Crusher', 'Overhead Tricep Extension', 'Close-Grip Bench Press', 'Tricep Pushdowns', 'Kickbacks', 'Bench Dips', 'Diamond Push-Ups'],
  'overhead tricep extension': ['Tricep Extension', 'Skull Crusher', 'Tricep Dip', 'Close-Grip Bench Press', 'Tricep Pushdowns', 'Kickbacks', 'Bench Dips', 'Diamond Push-Ups'],
  
  'lat pulldown': ['Pull-Up', 'Chin-Up', 'Cable Row', 'Seated Row', 'Bent-Over Row', 'One-Arm Dumbbell Row', 'Face Pull', 'T-Bar Row'],
  'pull-up': ['Chin-Up', 'Lat Pulldown', 'Cable Row', 'Seated Row', 'Bent-Over Row', 'One-Arm Dumbbell Row', 'Face Pull', 'T-Bar Row'],
  'chin-up': ['Pull-Up', 'Lat Pulldown', 'Cable Row', 'Seated Row', 'Bent-Over Row', 'One-Arm Dumbbell Row', 'Face Pull', 'T-Bar Row'],
  'wide-grip pulldown': ['Lat Pulldown', 'Pull-Up', 'Chin-Up', 'Cable Row', 'Seated Row', 'Bent-Over Row', 'One-Arm Dumbbell Row', 'Face Pull'],
  
  'seated row': ['Bent-Over Row', 'Cable Row', 'One-Arm Dumbbell Row', 'Lat Pulldown', 'Face Pull', 'Pull-Up', 'Chin-Up', 'T-Bar Row'],
  'bent-over row': ['Seated Row', 'Cable Row', 'One-Arm Dumbbell Row', 'Lat Pulldown', 'Face Pull', 'Pull-Up', 'Chin-Up', 'T-Bar Row'],
  'cable row': ['Seated Row', 'Bent-Over Row', 'One-Arm Dumbbell Row', 'Lat Pulldown', 'Face Pull', 'Pull-Up', 'Chin-Up', 'T-Bar Row'],
  'one-arm dumbbell row': ['Seated Row', 'Bent-Over Row', 'Cable Row', 'Lat Pulldown', 'Face Pull', 'Pull-Up', 'Chin-Up', 'T-Bar Row'],
  
  'leg press': ['Squat', 'Lunges', 'Leg Extensions', 'Hamstring Curls', 'Calf Raises', 'Bulgarian Split Squats', 'Step-Ups', 'Glute Bridges'],
  'single-leg press': ['Leg Press', 'Single-Leg Deadlifts', 'Lunges', 'Calf Raises', 'Hamstring Curls', 'Step-Ups', 'Goblet Squats', 'Wall Sits'],
  'hack squat': ['Leg Press', 'Squat', 'Lunges', 'Leg Extensions', 'Hamstring Curls', 'Calf Raises', 'Step-Ups', 'Bulgarian Split Squats'],
  'smith machine squat': ['Squat', 'Leg Press', 'Lunges', 'Leg Extensions', 'Hamstring Curls', 'Calf Raises', 'Step-Ups', 'Glute Bridges'],
  
  'leg extension': ['Leg Press', 'Squat', 'Lunges', 'Hamstring Curls', 'Calf Raises', 'Bulgarian Split Squats', 'Step-Ups', 'Glute Bridges'],
  'leg curl': ['Leg Press', 'Squat', 'Lunges', 'Leg Extensions', 'Calf Raises', 'Bulgarian Split Squats', 'Step-Ups', 'Glute Bridges'],
  'lying leg curl': ['Leg Press', 'Squat', 'Lunges', 'Leg Extensions', 'Calf Raises', 'Bulgarian Split Squats', 'Step-Ups', 'Glute Bridges'],
  'seated leg curl': ['Leg Press', 'Squat', 'Lunges', 'Leg Extensions', 'Calf Raises', 'Bulgarian Split Squats', 'Step-Ups', 'Glute Bridges'],
  
  'calf raise': ['Leg Press', 'Squat', 'Lunges', 'Leg Extensions', 'Hamstring Curls', 'Bulgarian Split Squats', 'Step-Ups', 'Glute Bridges'],
  'seated calf raise': ['Calf Raise', 'Leg Press', 'Squat', 'Lunges', 'Leg Extensions', 'Hamstring Curls', 'Bulgarian Split Squats', 'Step-Ups'],
  'donkey calf raise': ['Calf Raise', 'Leg Press', 'Squat', 'Lunges', 'Leg Extensions', 'Hamstring Curls', 'Bulgarian Split Squats', 'Step-Ups'],
  'leg press calf raise': ['Calf Raise', 'Leg Press', 'Squat', 'Lunges', 'Leg Extensions', 'Hamstring Curls', 'Bulgarian Split Squats', 'Step-Ups'],
  
  'shoulder press': ['Dumbbell Shoulder Press', 'Lateral Raises', 'Front Raises', 'Face Pulls', 'Tricep Pushdowns', 'Arnold Press', 'Upright Rows', 'Bent Over Lateral Raises'],
  'Dumbbell shoulder press': ['Seated Shoulder Press', 'Lateral Raises', 'Front Raises', 'Face Pulls', 'Arnold Press', 'Tricep Extensions', 'Upright Rows', 'Shrugs'],
  'military press': ['Seated Shoulder Press', 'Dumbbell Shoulder Press', 'Lateral Raises', 'Front Raises', 'Face Pulls', 'Arnold Press', 'Upright Rows', 'Shrugs'],
  'arnold press': ['Dumbbell Shoulder Press', 'Lateral Raises', 'Front Raises', 'Face Pulls', 'Seated Shoulder Press', 'Tricep Extensions', 'Upright Rows', 'Shrugs'],
  
  'chest fly': ['Bench Press', 'Incline Bench Press', 'Dumbbell Bench Press', 'Cable Chest Fly', 'Push-Ups', 'Tricep Dips', 'Incline Dumbbell Fly', 'Pec Deck Machine'],
  'incline chest fly': ['Incline Bench Press', 'Dumbbell Bench Press', 'Cable Chest Fly', 'Push-Ups', 'Tricep Dips', 'Incline Dumbbell Fly', 'Pec Deck Machine', 'Chest Dips'],
  'decline chest fly': ['Decline Bench Press', 'Flat Bench Press', 'Dumbbell Bench Press', 'Cable Chest Fly', 'Push-Ups', 'Tricep Dips', 'Pec Deck Machine', 'Chest Dips'],
  'cable chest fly': ['Chest Fly', 'Bench Press', 'Incline Bench Press', 'Dumbbell Bench Press', 'Push-Ups', 'Tricep Dips', 'Incline Dumbbell Fly', 'Pec Deck Machine'],
  
  'Hammer curl': ['Dumbbell Curl', 'Barbell Curl', 'Preacher Curl', 'Concentration Curl', 'Cable Curl', 'Reverse Curl', 'Spider Curl', 'Zottman Curl'],
  'preacher curl': ['Dumbbell Curl', 'Hammer Curl', 'Barbell Curl', 'Concentration Curl', 'Cable Curl', 'Reverse Curl', 'Spider Curl', 'Zottman Curl'],
  'reverse curl': ['Dumbbell Curl', 'Hammer Curl', 'Barbell Curl', 'Preacher Curl', 'Cable Curl', 'Spider Curl', 'Zottman Curl', 'Concentration Curl'],
  'spider curl': ['Dumbbell Curl', 'Hammer Curl', 'Barbell Curl', 'Preacher Curl', 'Cable Curl', 'Reverse Curl', 'Zottman Curl', 'Concentration Curl'],
  
  'Skull crusher': ['Tricep Extension', 'Tricep Dip', 'Overhead Tricep Extension', 'Close-Grip Bench Press', 'Tricep Pushdowns', 'Kickbacks', 'Bench Dips', 'Diamond Push-Ups'],
  'Overhead tricep extension': ['Tricep Extension', 'Skull Crusher', 'Tricep Dip', 'Close-Grip Bench Press', 'Tricep Pushdowns', 'Kickbacks', 'Bench Dips', 'Diamond Push-Ups'],
  'Tricep dip': ['Tricep Extension', 'Skull Crusher', 'Overhead Tricep Extension', 'Close-Grip Bench Press', 'Tricep Pushdowns', 'Kickbacks', 'Bench Dips', 'Diamond Push-Ups'],
  'close-grip bench press': ['Tricep Extension', 'Skull Crusher', 'Tricep Dip', 'Overhead Tricep Extension', 'Tricep Pushdowns', 'Kickbacks', 'Bench Dips', 'Diamond Push-Ups'],
  
  'Pull-up': ['Chin-Up', 'Lat Pulldown', 'Cable Row', 'Seated Row', 'Bent-Over Row', 'One-Arm Dumbbell Row', 'Face Pull', 'T-Bar Row'],
  'Chin-up': ['Pull-Up', 'Lat Pulldown', 'Cable Row', 'Seated Row', 'Bent-Over Row', 'One-Arm Dumbbell Row', 'Face Pull', 'T-Bar Row'],
  'neutral-grip pull-up': ['Pull-Up', 'Chin-Up', 'Lat Pulldown', 'Cable Row', 'Seated Row', 'Bent-Over Row', 'One-Arm Dumbbell Row', 'Face Pull'],
  'wide-grip pull-up': ['Pull-Up', 'Chin-Up', 'Lat Pulldown', 'Cable Row', 'Seated Row', 'Bent-Over Row', 'One-Arm Dumbbell Row', 'Face Pull'],
  
  'face pull': ['Upright Row', 'Shrug', 'Trap Raise', 'Lateral Raise', 'Front Raise', 'Rear Delt Fly', 'Dumbbell Lateral Raise', 'Bent-Over Rear Delt Fly'],
  'upright row': ['Face Pull', 'Shrug', 'Trap Raise', 'Lateral Raise', 'Front Raise', 'Rear Delt Fly', 'Dumbbell Lateral Raise', 'Bent-Over Rear Delt Fly'],
  'shrug': ['Face Pull', 'Upright Row', 'Trap Raise', 'Lateral Raise', 'Front Raise', 'Rear Delt Fly', 'Dumbbell Lateral Raise', 'Bent-Over Rear Delt Fly'],
  'trap raise': ['Face Pull', 'Upright Row', 'Shrug', 'Lateral Raise', 'Front Raise', 'Rear Delt Fly', 'Dumbbell Lateral Raise', 'Bent-Over Rear Delt Fly'],
  
  'front raise': ['Lateral Raise', 'Rear Delt Fly', 'Dumbbell Shoulder Press', 'Arnold Press', 'Face Pull', 'Upright Row', 'Shrug', 'Trap Raise'],
  'lateral raise': ['Front Raise', 'Rear Delt Fly', 'Dumbbell Shoulder Press', 'Arnold Press', 'Face Pull', 'Upright Row', 'Shrug', 'Trap Raise'],
  'rear delt fly': ['Front Raise', 'Lateral Raise', 'Dumbbell Shoulder Press', 'Arnold Press', 'Face Pull', 'Upright Row', 'Shrug', 'Trap Raise'],
  'dumbbell lateral raise': ['Front Raise', 'Rear Delt Fly', 'Dumbbell Shoulder Press', 'Arnold Press', 'Face Pull', 'Upright Row', 'Shrug', 'Trap Raise'],
  
  'reverse pec deck': ['Rear Delt Fly', 'Face Pull', 'Upright Row', 'Shrug', 'Lateral Raise', 'Front Raise', 'Dumbbell Shoulder Press', 'Arnold Press'],
  'bent-over rear delt fly': ['Rear Delt Fly', 'Face Pull', 'Upright Row', 'Shrug', 'Lateral Raise', 'Front Raise', 'Dumbbell Shoulder Press', 'Arnold Press'],
  'cable rear delt fly': ['Rear Delt Fly', 'Face Pull', 'Upright Row', 'Shrug', 'Lateral Raise', 'Front Raise', 'Dumbbell Shoulder Press', 'Arnold Press'],
  
  'hyperextension': ['Reverse Hyperextension', 'Glute Bridge', 'Hip Thrust', 'Romanian Deadlift', 'Good Morning', 'Back Extension', 'Single-Leg Deadlift', 'Cable Good Morning'],
  'reverse hyperextension': ['Hyperextension', 'Glute Bridge', 'Hip Thrust', 'Romanian Deadlift', 'Good Morning', 'Back Extension', 'Single-Leg Deadlift', 'Cable Good Morning'],
  'glute bridge': ['Hip Thrust', 'Hyperextension', 'Reverse Hyperextension', 'Romanian Deadlift', 'Good Morning', 'Back Extension', 'Single-Leg Deadlift', 'Cable Good Morning'],
  'hip thrust': ['Glute Bridge', 'Hyperextension', 'Reverse Hyperextension', 'Romanian Deadlift', 'Good Morning', 'Back Extension', 'Single-Leg Deadlift', 'Cable Good Morning'],
  
  'Romanian deadlift': ['Leg Curls', 'Good Mornings', 'Back Extensions', 'Single-Leg Deadlifts', 'Hip Thrusts', 'Glute Bridges', 'Hamstring Curls', 'Kettlebell Swings'],
  'Sumo deadlift': ['Romanian Deadlift', 'Good Mornings', 'Back Extensions', 'Hip Thrusts', 'Single-Leg Deadlifts', 'Shrugs', 'Kettlebell Swings', 'Leg Press'],
  'stiff-leg deadlift': ['Romanian Deadlift', 'Good Mornings', 'Back Extensions', 'Single-Leg Deadlifts', 'Hip Thrusts', 'Glute Bridges', 'Hamstring Curls', 'Kettlebell Swings'],
  'trap bar deadlift': ['Romanian Deadlift', 'Good Mornings', 'Back Extensions', 'Single-Leg Deadlifts', 'Hip Thrusts', 'Glute Bridges', 'Hamstring Curls', 'Kettlebell Swings'],
  
  'clean and press': ['Power Clean', 'Hang Clean', 'Push Press', 'Overhead Squat', 'Front Squat', 'Deadlift', 'Romanian Deadlift', 'Snatch'],
  'snatch': ['Power Snatch', 'High Pull', 'Overhead Squat', 'Front Squat', 'Romanian Deadlift', 'Clean and Press', 'Hang Clean', 'Snatch-Grip High Pull'],
  'power clean': ['Clean and Press', 'Hang Clean', 'Front Squat', 'Romanian Deadlift', 'Overhead Squat', 'Push Press', 'High Pull', 'Snatch'],
  'hang clean': ['Clean and Press', 'Power Clean', 'Front Squat', 'Romanian Deadlift', 'Overhead Squat', 'Push Press', 'High Pull', 'Snatch'],
  
  'power snatch': ['Snatch', 'High Pull', 'Overhead Squat', 'Front Squat', 'Romanian Deadlift', 'Clean and Press', 'Hang Clean', 'Snatch-Grip High Pull'],
  'high pull': ['Power Clean', 'Hang Clean', 'Snatch', 'Front Squat', 'Romanian Deadlift', 'Clean and Press', 'Snatch-Grip High Pull', 'Overhead Squat'],
  'snatch-grip high pull': ['High Pull', 'Snatch', 'Front Squat', 'Romanian Deadlift', 'Clean and Press', 'Hang Clean', 'Power Clean', 'Overhead Squat'],
  'clean pull': ['High Pull', 'Power Clean', 'Hang Clean', 'Snatch', 'Front Squat', 'Romanian Deadlift', 'Clean and Press', 'Overhead Squat'],
  
  'good morning': ['Romanian Deadlift', 'Back Extensions', 'Single-Leg Deadlifts', 'Hip Thrusts', 'Glute Bridges', 'Hamstring Curls', 'Kettlebell Swings', 'Cable Good Morning'],
  'seated good morning': ['Good Morning', 'Romanian Deadlift', 'Back Extensions', 'Single-Leg Deadlifts', 'Hip Thrusts', 'Glute Bridges', 'Hamstring Curls', 'Kettlebell Swings'],
  'cable good morning': ['Good Morning', 'Romanian Deadlift', 'Back Extensions', 'Single-Leg Deadlifts', 'Hip Thrusts', 'Glute Bridges', 'Hamstring Curls', 'Kettlebell Swings'],
  'banded good morning': ['Good Morning', 'Romanian Deadlift', 'Back Extensions', 'Single-Leg Deadlifts', 'Hip Thrusts', 'Glute Bridges', 'Hamstring Curls', 'Kettlebell Swings'],
  
  'Single-leg deadlift': ['Romanian Deadlift', 'Good Mornings', 'Hip Thrusts', 'Glute Bridges', 'Leg Press', 'Step-Ups', 'Hamstring Curls', 'Calf Raises'],
  'single-leg Romanian deadlift': ['Single-Leg Deadlift', 'Good Mornings', 'Hip Thrusts', 'Glute Bridges', 'Leg Press', 'Step-Ups', 'Hamstring Curls', 'Calf Raises'],
  'pistol squat': ['Single-Leg Deadlift', 'Bulgarian Split Squat', 'Step-Ups', 'Lunges', 'Hamstring Curls', 'Glute Bridges', 'Leg Press', 'Calf Raises'],
  'bulgarian split squat': ['Lunges', 'Step-Ups', 'Hamstring Curls', 'Calf Raises', 'Goblet Squats', 'Leg Press', 'Single-Leg Deadlifts', 'Leg Extensions'],
  
  'cable fly': ['Chest Fly', 'Bench Press', 'Incline Bench Press', 'Dumbbell Bench Press', 'Push-Ups', 'Tricep Dips', 'Incline Dumbbell Fly', 'Pec Deck Machine'],
  'low cable fly': ['Chest Fly', 'Bench Press', 'Incline Bench Press', 'Dumbbell Bench Press', 'Push-Ups', 'Tricep Dips', 'Incline Dumbbell Fly', 'Pec Deck Machine'],
  'high cable fly': ['Chest Fly', 'Bench Press', 'Incline Bench Press', 'Dumbbell Bench Press', 'Push-Ups', 'Tricep Dips', 'Incline Dumbbell Fly', 'Pec Deck Machine'],
  'cable crossover': ['Chest Fly', 'Bench Press', 'Incline Bench Press', 'Dumbbell Bench Press', 'Push-Ups', 'Tricep Dips', 'Incline Dumbbell Fly', 'Pec Deck Machine']
};

export const createLiftingPlan = async (req: Request, res: Response, next: NextFunction) => {
  const { height, weight, experienceLevel, gender, desiredExercise, targetWeight, numberOfWeeks } = req.body;

  try {
    const user = await User.findById(res.locals.jwtData.id);
    if (!user) {
      return res.status(401).json({ message: "User not registered OR Token malfunctioned" });
    }

    const isValidExercise = Object.keys(auxiliaryExercisesMapping).some(
      (keyword) => keyword.toLowerCase() === desiredExercise.toLowerCase()
    );
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

    const messages: ChatCompletionMessageParam[] = [
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
          -Include a disclaimer that says it may take longer then  ${numberOfWeeks} weeks to acheive their goal, the above plan is just a 
          outline 
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
        Liftingid: randomUUID(),
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
    } else {
      throw new Error('Unexpected API response format');
    }
  } catch (error) {
    console.error('Error creating lifting plan:', error.response ? error.response.data : error.message);
    return res.status(500).json({ message: 'Error creating lifting plan' });
  }
};

export const getLiftingPlan = async (req: Request, res: Response, next: NextFunction) => {
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

    res.status(200).json({ message: 'Lifting plan retrieved successfully', liftingPlan: liftingPlan.liftingPlan ,liftingPlanId: liftingPlan.liftingId});
  } catch (error) {
    console.error('Error retrieving lifting plan:', error);
    res.status(500).json({ message: 'Error retrieving lifting plan' });
  }
};
export const addSavedLiftingPlan = async (req: Request, res: Response, next: NextFunction) => {
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
  } catch (error) {
    console.error('Error saving lifting plan:', error);
    res.status(500).json({ message: 'Error saving lifting plan' });
  }
};


export const getAllSavedLiftingPlans = async (req: Request, res: Response, next: NextFunction) => {
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
  } catch (error) {
    console.error('Error retrieving saved lifting plans:', error);
    res.status(500).json({ message: 'Error retrieving saved lifting plans' });
  }
};
export const clearAllSavedLiftingPlans = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = await User.findById(res.locals.jwtData.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    //@ts-ignore
    user.savedLiftingPlans = [];
    await user.save();

    res.status(200).json({ message: 'All saved lifting plans cleared' });
  } catch (error) {
    console.error('Error clearing saved lifting plans:', error);
    res.status(500).json({ message: 'Error clearing saved lifting plans' });
  }
};



export const deleteSavedLiftingPlan = async (req: Request, res: Response, next: NextFunction) => {
  const { desiredExercise } = req.params;

  try {
    const user = await User.findById(res.locals.jwtData.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Filter out the lifting plan to be deleted based on desiredExercise
    //@ts-ignore
    user.savedLiftingPlans = user.savedLiftingPlans.filter(plan => plan.desiredExercise !== desiredExercise);
    await user.save();

    // Fetch the updated user document to ensure the lifting plan was removed
    const updatedUser = await User.findById(res.locals.jwtData.id);
    if (updatedUser.savedLiftingPlans.some(plan => plan.desiredExercise === desiredExercise)) {
      return res.status(500).json({ message: 'Error deleting saved lifting plan' });
    }

    res.status(200).json({ message: 'Lifting plan deleted successfully', savedLiftingPlans: updatedUser.savedLiftingPlans });
  } catch (error) {
    console.error('Error deleting saved lifting plan:', error);
    res.status(500).json({ message: 'Error deleting saved lifting plan' });
  }
};
export const getAboutDeveloper = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    return res.status(200).json({ message: "About the Developer page opened successfully" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "ERROR", cause: error.message });
  }
};