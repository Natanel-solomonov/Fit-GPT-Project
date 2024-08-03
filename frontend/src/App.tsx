import React from 'react';
import Header from "./components/Header";
import { Routes, Route } from 'react-router-dom';
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Chat from "./pages/Chat";
import SavedVideos from "./pages/SavedVideos";
import LiftingPlanSurvey from "./pages/LiftingPlans"; // Import the LiftingPlanSurvey component
import NotFound from "./pages/NotFound";
import { useAuth } from "./context/AuthContext";
import LiftingPlanResponse from './pages/LiftingPlan-Respnse';
import SavedPlans from './pages/savedLiftingPlans';

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
            <Route path="/saved-videos" element={<SavedVideos />} />
            <Route path="/lifting-plans" element={<LiftingPlanSurvey />} /> 
            <Route path= "/lifting-plan-response" element= {<LiftingPlanResponse/>}/>
            <Route path="/saved-plans" element={<SavedPlans />} />
            


          </>
        )}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </main>
  );
};

export default App;