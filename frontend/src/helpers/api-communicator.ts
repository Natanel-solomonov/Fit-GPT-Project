import axios from "axios"


export const loginUser= async (email:string,password:string) => {
    const res = await axios.post("/user/login", {email,password});
    if(res.status!==201&&res.status!==200){
        throw new Error("Unable to login");
    }
    const data= await res.data;
    document.cookie = `auth_token=${data.token}; path=/;`; // Set the token in the cookies
    return data;

};

export const signupUser= async (name:string, email:string,password:string) => {
    const res = await axios.post("/user/signup", {name, email,password});
    if(res.status!==201&&res.status!==200){
        throw new Error("Unable to Signup");
    }
    const data= await res.data;
    document.cookie = `auth_token=${data.token}; path=/;`; // Set the token in the cookies
    return data;

};

export const checkAuthStatus= async () => {
    const res = await axios.get("/user/auth-status");
    if(res.status!==201&&res.status!==200){
        throw new Error("Unable to Authenticate");
    }
    const data= await res.data;
    return data;

};

export const sendChatRequest= async (message:string) => {
    try {
        const res = await axios.post("/chat/new", {message});
        if(res.status!==201&&res.status!==200){
            throw new Error("Unable to send chat");
        }
        const data= await res.data;
        return data;
    } catch (error) {
        console.error("Error in sendChatRequest:", error);
        throw error;
    }
};

export const getUserChats= async () => {
    const res = await axios.get("/chat/all-chats");
    if(res.status!==201&&res.status!==200){
        throw new Error("Unable to send chat");
    }
    const data= await res.data;
    return data;

};

export const deleteUserChats= async () => {
    const res = await axios.delete("/chat/delete");
    if(res.status!==201&&res.status!==200){
        throw new Error("Unable to delete chat");
    }
    const data= await res.data;
    return data;

};

export const logoutUser= async () => {
    const res = await axios.get("/user/logout");
    if(res.status!==201&&res.status!==200){
        throw new Error("Unable to delete chat");
    }
    const data= await res.data;
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
//@ts-ignore
export const createLiftingPlan = async (liftingPlanData) => {
    try {
      const response = await axios.post('/user/lifting-plans', liftingPlanData, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
  
      if (response.status !== 201 && response.status !== 200) {
        throw new Error('Failed to create lifting plan');
      }
  
      return response.data;
    } catch (error) {
      console.error('Error creating lifting plan:', error);
      throw error;
    }
  };
  
  export const getLiftingPlan = async () => {
    try {
      const res = await axios.get("/user/lifting-plan-response");
      if (res.status !== 201 && res.status !== 200) {
        throw new Error("Unable to retrieve lifting plan");
      }
      const data = res.data;
      return data;
    } catch (error) {
      console.error("Error retrieving lifting plan:", error);
      throw error;
    }
  };
  export const generateLiftingPlanResponse = async (liftingPlanData: { weight: number; experienceLevel: string; targetWeight: number; numberOfWeeks: number }) => {
    try {
      const response = await axios.post('/user/generate-lifting-plan-response', liftingPlanData, {
        headers: {
          'Content-Type': 'application/json',
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