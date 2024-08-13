import React from 'react';
import Header from "./components/Header";
import { Routes, Route } from 'react-router-dom';
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Chat from "./pages/Chat";
import SavedVideos from "./pages/SavedVideos";
import LiftingPlanSurvey from "./pages/LiftingPlans"; 
import NotFound from "./pages/NotFound";
import { useAuth } from "./context/AuthContext";
import LiftingPlanResponse from './pages/LiftingPlan-Respnse';
import SavedPlans from './pages/savedLiftingPlans';
import AboutDeveloper from './pages/aboutDeveloper';
import PlanOptions from './pages/PlanOptions';
import CalisthenicsPlanSurvey from './pages/Calisthenics';
import BalancePlanSurvey from './pages/balancePlanForm';
import FlexibilityPlanSurvey from './pages/FlexibilityPlanForm';
import EndurancePlanSurvey from './pages/endurancePlanForm';
import CalesthenicsPlanResponse from './pages/CalesthenicsPlanResponse';
import EndurancePlanResponse from './pages/endurancePlanResponse';
import BalancePlanResponse from './pages/balanceplanResponse';
import FlexibilityPlanResponse from './pages/flexibilityPlanResponse';

const App: React.FC = () => {
  const auth = useAuth();

  return (
    <main>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        {auth?.isLoggedIn && auth.user && (
          <>
            <Route path="/chat" element={<Chat />} />
            <Route path="/plan-options" element={<PlanOptions />} /> 
            <Route path="/saved-videos" element={<SavedVideos />} />
            <Route path="/lifting-plans" element={<LiftingPlanSurvey />} /> 
            <Route path= "/lifting-plan-response" element= {<LiftingPlanResponse/>}/>
            <Route path="/saved-plans" element={<SavedPlans />} />
            <Route path="/about-developer" element={<AboutDeveloper />} />
            <Route path="/calisthenics-plans" element={<CalisthenicsPlanSurvey />} /> 
            <Route path="/calisthenics-plan-response" element={< CalesthenicsPlanResponse/>} /> 
            <Route path="/endurance-plans" element={<EndurancePlanSurvey />} /> 
            <Route path="/endurance-plan-response" element={<EndurancePlanResponse/>} /> 
            <Route path="/balance-plans" element={<BalancePlanSurvey />} /> 
            <Route path="/balance-plan-response" element={< BalancePlanResponse/>} /> 
            <Route path="/flexibility-plans" element={<FlexibilityPlanSurvey />} /> 
            <Route path="/flexibility-plan-response" element={<FlexibilityPlanResponse />} />
          </>
        )}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </main>
  );
};

export default App;
