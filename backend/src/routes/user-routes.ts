
import {Router} from 'express';
import { getAllUsers, getSavedVideos, userLogin, userSignup, userlogout, verifyUser,addSavedVideo, createLiftingPlan, getLiftingPlan, addSavedLiftingPlan, getAllSavedLiftingPlans,clearAllSavedLiftingPlans, getAboutDeveloper} from '../controllers/user-controllers.js';
import{ loginValidator, signupValidator, validate } from "../utils/validators.js";
import { verifyToken } from '../utils/token-manager.js';



const userRoutes = Router();
const noCache = (req, res, next) => {
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
    res.setHeader('Surrogate-Control', 'no-store');
    next();
  };

userRoutes.get("/",getAllUsers);
userRoutes.post("/signup",validate(signupValidator),userSignup);
userRoutes.post("/login",validate(loginValidator),userLogin);
userRoutes.get("/auth-status", verifyUser);
userRoutes.get("/logout", userlogout);

//lifting plan routes
userRoutes.post('/lifting-plans', noCache, createLiftingPlan)
userRoutes.get('/lifting-plan-response',noCache, getLiftingPlan); 
userRoutes.post('/save-lifting-plan', noCache, addSavedLiftingPlan)
userRoutes.get('/saved-lifting-plans',noCache, getAllSavedLiftingPlans); 
userRoutes.delete('/clear-saved-lifting-plans', noCache, clearAllSavedLiftingPlans)


//developer route 
userRoutes.get('/about-developer', getAboutDeveloper)




export default userRoutes;