import { Router } from 'express';
import { getAllUsers, userLogin, userSignup, userlogout, verifyUser, createLiftingPlan, getLiftingPlan, addSavedLiftingPlan, getAllSavedLiftingPlans, clearAllSavedLiftingPlans, getAboutDeveloper, getPlanOptions, createCalisthenicsPlan, createEndurancePlan, createBalancePlan, createFlexibilityPlan, getCalisthenicsPlan, addSavedCalisthenicsPlan, getSavedCalisthenicsPlans, clearAllSavedCalisthenicsPlans, getEndurancePlan, addSavedEndurancePlan, getSavedEndurancePlans, clearAllSavedEndurancePlans, getBalancePlan, getSavedBalancePlans, addSavedBalancePlan, clearAllSavedBalancePlans, getFlexibilityPlan, addSavedFlexibilityPlan, getSavedFlexibilityPlans, clearAllSavedFlexibilityPlans } from '../controllers/user-controllers.js';
import { loginValidator, signupValidator, validate } from "../utils/validators.js";
import { verifyToken } from '../utils/token-manager.js';
const userRoutes = Router();
const noCache = (req, res, next) => {
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
    res.setHeader('Surrogate-Control', 'no-store');
    next();
};
// User routes
userRoutes.get("/", getAllUsers);
userRoutes.post("/signup", validate(signupValidator), userSignup);
userRoutes.post("/login", validate(loginValidator), userLogin);
userRoutes.get("/auth-status", verifyToken, verifyUser);
userRoutes.get("/logout", verifyToken, userlogout);
userRoutes.get('/plan-options', verifyToken, noCache, getPlanOptions);
// Lifting plan routes
userRoutes.post('/lifting-plans', verifyToken, noCache, createLiftingPlan);
userRoutes.get('/lifting-plan-response', verifyToken, noCache, getLiftingPlan);
userRoutes.post('/save-lifting-plan', verifyToken, noCache, addSavedLiftingPlan);
userRoutes.get('/saved-lifting-plans', verifyToken, noCache, getAllSavedLiftingPlans);
userRoutes.delete('/clear-saved-lifting-plans', verifyToken, noCache, clearAllSavedLiftingPlans); //really for all plans 
// Calisthenics plan routes
userRoutes.post('/calisthenics-plan', verifyToken, createCalisthenicsPlan);
userRoutes.get('/calisthenics-plan-response', verifyToken, noCache, getCalisthenicsPlan);
userRoutes.post('/save-calisthenics-plan', verifyToken, noCache, addSavedCalisthenicsPlan);
userRoutes.get('/saved-calisthenics-plans', verifyToken, noCache, getSavedCalisthenicsPlans);
userRoutes.delete('/clear-saved-calisthenics-plans', verifyToken, noCache, clearAllSavedCalisthenicsPlans);
//Endurnace Plan Routes
userRoutes.post('/endurance-plan', verifyToken, createEndurancePlan);
userRoutes.get('/endurance-plan-response', verifyToken, noCache, getEndurancePlan);
userRoutes.post('/save-endurance-plan', verifyToken, noCache, addSavedEndurancePlan);
userRoutes.get('/saved-endurance-plans', verifyToken, noCache, getSavedEndurancePlans);
userRoutes.delete('/clear-saved-endurance-plans', verifyToken, noCache, clearAllSavedEndurancePlans);
//balance Plans
userRoutes.post('/balance-plan', verifyToken, createBalancePlan);
userRoutes.get('/balance-plan-response', verifyToken, getBalancePlan);
userRoutes.get('/saved-balance-plans', verifyToken, getSavedBalancePlans);
userRoutes.post('/save-balance-plan', verifyToken, addSavedBalancePlan);
userRoutes.delete('/clear-saved-balance-plans', verifyToken, clearAllSavedBalancePlans);
//Flexibility Plan Routes
userRoutes.post('/flexibility-plan', verifyToken, createFlexibilityPlan);
userRoutes.get('/flexibility-plan-response', verifyToken, noCache, getFlexibilityPlan);
userRoutes.post('/save-flexibility-plan', verifyToken, noCache, addSavedFlexibilityPlan);
userRoutes.get('/saved-flexibility-plans', verifyToken, noCache, getSavedFlexibilityPlans);
userRoutes.delete('/clear-saved-flexibility-plans', verifyToken, noCache, clearAllSavedFlexibilityPlans);
// Developer route
userRoutes.get('/about-developer', getAboutDeveloper);
// Other form routes
userRoutes.post('/flexibility-plan', verifyToken, createFlexibilityPlan);
export default userRoutes;
//# sourceMappingURL=user-routes.js.map