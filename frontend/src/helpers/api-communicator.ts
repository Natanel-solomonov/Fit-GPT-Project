// helpers/api-communicator.ts

import axios from 'axios';
import toast from 'react-hot-toast'
interface FormData {
  height: string;
  weight: string;
  experienceLevel: string;
  gender: string;
  desiredExercise: string;
  targetWeight: string;
  numberOfWeeks: string;
}

interface LiftingPlanData {
  height: number;
  weight: number;
  experienceLevel: string;
  gender: string;
  desiredExercise: string;
  targetWeight: number;
  numberOfWeeks: number;
}
interface CalisthenicsPlanData {
  height: number;
  weight: number;
  experienceLevel: string;
  gender: string;
  desiredMovement: string;
  repsGoal: number;
  numberOfWeeks: number;
}
 interface EndurancePlanData {
  age: number;
  weight: number;
  fitnessLevel: string; // e.g., "Beginner", "Intermediate", "Advanced"
  gender: string; // e.g., "Male", "Female"
  preferredActivity: string; // e.g., "Running", "Cycling"
  distanceGoal: number; // e.g., in miles or kilometers
  timeGoal: string; // e.g., "60 minutes"
  numberOfWeeks: number; // The number of weeks for the plan
}
export interface FlexibilityPlanData {
  age: number;
  fitnessLevel: string;
  gender: string;
  targetArea: string;
  flexibilityGoal: string;
  numberOfWeeks: number;
}

const convertFormDataToLiftingPlanData = (formData: FormData): LiftingPlanData => {
  return {
    height: Number(formData.height),
    weight: Number(formData.weight),
    experienceLevel: formData.experienceLevel,
    gender: formData.gender,
    desiredExercise: formData.desiredExercise,
    targetWeight: Number(formData.targetWeight),
    numberOfWeeks: Number(formData.numberOfWeeks),
  };
};

export const loginUser = async (email: string, password: string) => {
  const res = await axios.post("/user/login", { email, password });
  if (res.status !== 201 && res.status !== 200) {
    throw new Error("Unable to login");
  }
  const data = await res.data;
  document.cookie = `auth_token=${data.token}; path=/;`;
  return data;
};

export const signupUser = async (name: string, email: string, password: string) => {
  const res = await axios.post("/user/signup", { name, email, password });
  if (res.status !== 201 && res.status !== 200) {
    throw new Error("Unable to Signup");
  }
  const data = await res.data;
  document.cookie = `auth_token=${data.token}; path=/;`;
  return data;
};

export const checkAuthStatus = async () => {
  const res = await axios.get("/user/auth-status");
  if (res.status !== 201 && res.status !== 200) {
    throw new Error("Unable to Authenticate");
  }
  const data = await res.data;
  return data;
};

export const sendChatRequest = async (message: string) => {
  try {
    const res = await axios.post("/chat/new", { message });
    if (res.status !== 201 && res.status !== 200) {
      throw new Error("Unable to send chat");
    }
    const data = await res.data;
    return data;
  } catch (error) {
    console.error("Error in sendChatRequest:", error);
    throw error;
  }
};

export const getUserChats = async () => {
  const res = await axios.get("/chat/all-chats");
  if (res.status !== 201 && res.status !== 200) {
    throw new Error("Unable to send chat");
  }
  const data = await res.data;
  return data;
};

export const deleteUserChats = async () => {
  const res = await axios.delete("/chat/delete");
  if (res.status !== 201 && res.status !== 200) {
    throw new Error("Unable to delete chat");
  }
  const data = await res.data;
  return data;
};

export const logoutUser = async () => {
  const res = await axios.get("/user/logout");
  if (res.status !== 201 && res.status !== 200) {
    throw new Error("Unable to logout");
  }
  const data = await res.data;
  return data;
};

export const saveVideo = async (videoId: string) => {
  try {
    const res = await axios.post("/chat/saved-videos", { videoId });
    if (res.status !== 201 && res.status !== 200) {
      throw new Error("Unable to save video");
    }
    return res.data;
  } catch (error) {
    console.error("Error in saveVideo:", error);
    throw error;
  }
};

export const getSavedVideos = async () => {
  try {
    const res = await axios.get("/chat/saved-videos");
    if (res.status !== 201 && res.status !== 200) {
      throw new Error("Unable to fetch saved videos");
    }
    const data = res.data;
    return data;
  } catch (error) {
    console.error("Error in getSavedVideos:", error);
    throw error;
  }
};

export const createLiftingPlan = async (formData: FormData) => {
  try {
    const liftingPlanData = convertFormDataToLiftingPlanData(formData);

    console.log('Sending Data:', liftingPlanData);

    const response = await axios.post('/user/lifting-plans', liftingPlanData, {
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache',
      },
    });

    if (response.status !== 201 && response.status !== 200) {
      throw new Error('Failed to generate lifting plan response');
    }

    return response.data;
  } catch (error) {
    console.error('Error generating lifting plan response:', error);
    throw error;
  }
};

export const getLiftingPlan = async () => {
  try {
    const res = await axios.get("/user/lifting-plan-response", {
      headers: {
        'Cache-Control': 'no-cache',
      },
    });
    if (res.status !== 201 && res.status !== 200) {
      throw new Error("Unable to retrieve lifting plan");
    }
    return res.data;
  } catch (error) {
    console.error("Error retrieving lifting plan:", error);
    throw error;
  }
};
export const saveLiftingPlan = async (liftingPlanId: string) => {
  try {
    const res = await axios.post("/user/save-lifting-plan", { liftingPlanId });
    if (res.status !== 201 && res.status !== 200) {
      throw new Error("Unable to save lifting plan");
    }
    return res.data;
  } catch (error) {
    console.error("Error in saveLiftingPlan:", error);
    throw error;
  }
};
export const getSavedLiftingPlans = async () => {
  try {
    const res = await axios.get("/user/saved-lifting-plans");
    if (res.status !== 200) {
      throw new Error("Unable to retrieve saved lifting plans");
    }
    return res.data;
  } catch (error) {
    console.error("Error in getSavedLiftingPlans:", error);
    throw error;
  }
};
export const clearAllSavedLiftingPlans = async () => {
  await axios.delete('/user/clear-saved-lifting-plans');
};
export const deleteSavedLiftingPlan = async (liftingPlanId: string) => {
  try {
    const response = await axios.delete(`/user/delete-saved-lifting-plan/${liftingPlanId}`);
    if (response.status === 200) {
      toast.success('Lifting plan deleted successfully');
      return response.data;
    } else {
      toast.error('Failed to delete lifting plan');
      return null;
    }
  } catch (error) {
    //@ts-ignore
    console.error('Error deleting lifting plan:', error.response || error.message || error);
    toast.error('Failed to delete lifting plan');
    return null;
  }
};

export const createCalisthenicsPlan = async (formData: CalisthenicsPlanData) => {
  try {
    const response = await axios.post('/user/calisthenics-plan', formData, {
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error creating calisthenics plan:', error);
    throw error;
  }
};

export const getCalisthenicsPlan = async () => {
  try {
    const response = await axios.get('/user/calisthenics-plan-response', {
      headers: {
        'Cache-Control': 'no-cache',
      },
    });
    return response.data
  } catch (error) {
    console.error('Error retrieving calisthenics plan:', error);
    throw error;
  }
};
export const saveCalisthenicsPlan = async (calisthenicsPlanId: string) => {
  try {
    const res = await axios.post("/user/save-calisthenics-plan", { calisthenicsPlanId });
    if (res.status !== 201 && res.status !== 200) {
      throw new Error("Unable to save calisthenics plan");
    }
    return res.data;
  } catch (error) {
    console.error("Error in saveCalisthenicsPlan:", error);
    throw error;
  }
};

export const getSavedCalisthenicsPlans = async () => {
  try {
    const res = await axios.get("/user/saved-calisthenics-plans");
    if (res.status !== 200) {
      throw new Error("Unable to retrieve saved calisthenics plans");
    }
    return res.data
  } catch (error) {
    console.error("Error in getSavedCalisthenicsPlans:", error);
    throw error;
  }
};

export const clearAllSavedCalisthenicsPlans = async () => {
  try {
    await axios.delete('/user/clear-saved-calisthenics-plans');
  } catch (error) {
    console.error("Error clearing saved calisthenics plans:", error);
    throw error;
  }
};




export const createEndurancePlan = async (formData: EndurancePlanData) => {
  try {
    const response = await axios.post('/user/endurance-plan', formData, {
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error creating endurance plan:', error);
    throw error;
  }
};

export const getEndurancePlan = async () => {
  try {
    const response = await axios.get('/user/endurance-plan-response', {
      headers: {
        'Cache-Control': 'no-cache',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error retrieving endurance plan:', error);
    throw error;
  }
};

export const saveEndurancePlan = async (endurancePlanId: string) => {
  try {
    const res = await axios.post("/user/save-endurance-plan", { endurancePlanId });
    if (res.status !== 201 && res.status !== 200) {
      throw new Error("Unable to save endurance plan");
    }
    return res.data;
  } catch (error) {
    console.error("Error in saveEndurancePlan:", error);
    throw error;
  }
};

export const getSavedEndurancePlans = async () => {
  try {
    const res = await axios.get("/user/saved-endurance-plans");
    if (res.status !== 200) {
      throw new Error("Unable to retrieve saved endurance plans");
    }
    return res.data;
  } catch (error) {
    console.error("Error in getSavedEndurancePlans:", error);
    throw error;
  }
};

export const clearAllSavedEndurancePlans = async () => {
  try {
    await axios.delete('/user/clear-saved-endurance-plans');
  } catch (error) {
    console.error("Error clearing saved endurance plans:", error);
    throw error;
  }
};


export const createBalancePlan = async (formData: any) => {
  try {
    const response = await axios.post('/user/balance-plan', formData, {
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error creating balance plan:', error);
    throw error;
  }
};
export const getBalancePlan = async () => {
  try {
    const response = await axios.get('/user/balance-plan-response', {
      headers: {
        'Cache-Control': 'no-cache',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error retrieving balance plan:', error);
    throw error;
  }
};

export const getSavedBalancePlans = async () => {
  try {
    const response = await axios.get('/user/saved-balance-plans', {
      headers: {
        'Cache-Control': 'no-cache',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error retrieving saved balance plans:', error);
    throw error;
  }
};

export const saveBalancePlan = async (balancePlanId: string) => {
  try {
    const response = await axios.post('/user/save-balance-plan', { balancePlanId });
    return response.data;
  } catch (error) {
    console.error('Error saving balance plan:', error);
    throw error;
  }
};

export const clearAllSavedBalancePlans = async () => {
  try {
    await axios.delete('/user/clear-saved-balance-plans');
  } catch (error) {
    console.error('Error clearing saved balance plans:', error);
    throw error;
  }
};

export const createFlexibilityPlan = async (formData: FlexibilityPlanData) => {
  try {
    const response = await axios.post('/user/flexibility-plan', formData, {
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error creating flexibility plan:', error);
    throw error;
  }
};
export const getFlexibilityPlan = async () => {
  try {
    const response = await axios.get('/user/flexibility-plan-response', {
      headers: {
        'Cache-Control': 'no-cache',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error retrieving flexibility plan:', error);
    throw error;
  }
};
export const getSavedFlexibilityPlans = async () => {
  try {
    const res = await axios.get("/user/saved-flexibility-plans");
    if (res.status !== 200) {
      throw new Error("Unable to retrieve saved flexibility plans");
    }
    return res.data
  } catch (error) {
    console.error("Error in getSavedFlexibilityPlans:", error);
    throw error;
  }
};
export const saveFlexibilityPlan = async (flexibilityPlanId: string) => {
  try {
    const res = await axios.post("/user/save-flexibility-plan", { flexibilityPlanId });
    if (res.status !== 201 && res.status !== 200) {
      throw new Error("Unable to save flexibility plan");
    }
    return res.data;
  } catch (error) {
    console.error("Error in saveFlexibilityPlan:", error);
    throw error;
  }
};
export const clearAllSavedFlexibilityPlans = async () => {
  try {
    await axios.delete('/user/clear-saved-flexibility-plans');
  } catch (error) {
    console.error("Error clearing saved flexibility plans:", error);
    throw error;
  }
};


export const getPlanOptions = async () => {
  try {
    const response = await axios.get('/user/plan-options');
    if (response.status !== 200) {
      throw new Error('Failed to retrieve plan options');
    }
    return response.data.options;
  } catch (error) {
    console.error('Error fetching plan options:', error);
    throw error;
  }
};
export const getAboutDeveloper = async () => {
  try {
    const res = await axios.get("/user/about-developer");
    if (res.status !== 200) {
      throw new Error("Unable to retrieve About the Developer page");
    }
    return res.data;
  } catch (error) {
    console.error("Error in getAboutDeveloper:", error);
    throw error;
  }
};