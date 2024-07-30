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
      // Safely extract the token from cookies
      const cookieString = document.cookie.split('; ').find(row => row.startsWith('auth_token'));
      if (!cookieString) throw new Error('No token found');
  
      const token = cookieString.split('=')[1];
      if (!token) throw new Error('Token is undefined');
  
      const res = await axios.post("/chat/saved-videos", { videoId }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
  
      if (res.status !== 201 && res.status !== 200) {
        throw new Error("Unable to save video");
      }
      const data = await res.data;
      return data;
    } catch (error) {
      console.error("Error in saveVideo:", error);
      throw error;
    }
  };

export const getSavedVideos = async () => {
    try {
        const res = await axios.get("/chat/saved-videos", {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
        });
        if (res.status !== 201 && res.status !== 200) {
            throw new Error("Unable to fetch saved videos");
        }
        const data = await res.data;
        return data;
    } catch (error) {
        console.error("Error in getSavedVideos:", error);
        throw error;
    }
};