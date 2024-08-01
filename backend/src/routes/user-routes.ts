
import {Router} from 'express';
import { getAllUsers, getSavedVideos, userLogin, userSignup, userlogout, verifyUser,addSavedVideo, createLiftingPlan, getLiftingPlan, generateLiftingPlanResponse } from '../controllers/user-controllers.js';
import{ loginValidator, signupValidator, validate } from "../utils/validators.js";
import { verifyToken } from '../utils/token-manager.js';

const userRoutes = Router();

userRoutes.get("/",getAllUsers);
userRoutes.post("/signup",validate(signupValidator),userSignup);
userRoutes.post("/login",validate(loginValidator),userLogin);
userRoutes.get("/auth-status",verifyToken, verifyUser);
userRoutes.get("/logout",verifyToken, userlogout);
userRoutes.post('/lifting-plans', verifyToken, createLiftingPlan)
userRoutes.get('/lifting-plan-response', verifyToken, getLiftingPlan); 
userRoutes.post('/generate-lifting-plan-response', verifyToken, generateLiftingPlanResponse); // New route for generating the lifting plan response



export default userRoutes;
