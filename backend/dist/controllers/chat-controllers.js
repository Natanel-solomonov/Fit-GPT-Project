import User from "../models/User.js";
import { configureOpenAI } from "../config/openai-config.js";
import { searchYouTube } from "../config/youtubeAPI.js";
// Sort keywords by length in descending order to prioritize longer phrases
export const generateChatCompletion = async (req, res, next) => {
    const { message } = req.body;
    try {
        const user = await User.findById(res.locals.jwtData.id);
        if (!user) {
            return res.status(401).json({ message: "User not registered OR Token malfunctioned" });
        }
        const chats = user.chats.map(({ role, content, videoId }) => ({
            role,
            content,
            videoId
        }));
        chats.push({ content: message, role: "user" });
        user.chats.push({ content: message, role: "user" });
        const openai = configureOpenAI();
        // Step 1: Ask if the message is fitness-related
        const fitnessCheckResponse = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [
                { role: "system", content: "You are an assistant specialized in fitness-related queries." },
                { role: "user", content: `Is the following message related to fitness, health, wellness, exercise, nutrition, or sports? Please respond with only "Yes" or "No": "${message}"` }
            ],
        });
        const isFitnessRelated = fitnessCheckResponse.choices[0].message.content.trim().toLowerCase() === "yes";
        // Step 2: If fitness-related, extract the keyword
        let ExtractedKeyword = "";
        if (isFitnessRelated) {
            const keywordExtractionResponse = await openai.chat.completions.create({
                model: "gpt-3.5-turbo",
                messages: [
                    { role: "system", content: "You are an assistant that helps users with fitness-related queries." },
                    { role: "user", content: `Please analyze this message: "${message}". Extract and return the most relevant keyword or phrase that is important for the query. Keep in mind that this extracted keyword/phrase will be used to search youtube with that phrase so try and make it as applicable to the user question as possible` }
                ],
            });
            ExtractedKeyword = keywordExtractionResponse.choices[0].message.content.trim();
        }
        // Log the extracted keyword to the console for debugging purposes
        console.log("Extracted Keyword:", ExtractedKeyword);
        if (!isFitnessRelated) {
            const warningMessage = {
                role: "assistant",
                content: "Hmmm, I am not trained to answer your question as it does not seem to be related to fitness or health. If this is a mistake, I apologize. Try asking something else. Often times an input may include a spelling or grammar mistake, check your input and try again. If this is a mistake, to help better train fitgpt, please email fit.gpts@gmail.com with your input as well as your response. Include in the subject line, FitGPT Mistake"
            };
            user.chats.push(warningMessage);
            await user.save();
            return res.status(200).json({ chats: user.chats });
        }
        // Continue with generating a chat response
        const chatResponse = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: chats,
        });
        user.chats.push(chatResponse.choices[0].message);
        if (ExtractedKeyword) {
            const videos = await searchYouTube(ExtractedKeyword);
            const videoMessages = videos.slice(0, 3).map((video, index) => {
                let content;
                switch (index) {
                    case 0:
                        content = `I found a video regarding your ${ExtractedKeyword} query.\nYou can click the download button to save the video.`;
                        break;
                    case 1:
                        content = `Here's a second video in case the first one didn't meet your needs.\nYou can click the download button to save the video.`;
                        break;
                    case 2:
                        content = `And here's another option for you to consider.\nYou can click the download button to save the video.`;
                        break;
                    default:
                        content = `I found another video for you.\nYou can click the download button to save the video.`;
                        break;
                }
                return {
                    role: "assistant",
                    content,
                    videoId: video.id.videoId
                };
            });
            videoMessages.push({
                role: "assistant",
                content: "If these videos were not what you were looking for, I apologize, I am still being trained as a model. If you are unsatisfied with your video generation, and would like to help train me better, email fit.gpts@gmail.com with your video outputs along with what types of videos you were expecting."
            });
            user.chats.push(...videoMessages);
        }
        else {
            const noVideoMessage = {
                role: "assistant",
                content: "I couldn't find any videos related to your query."
            };
            user.chats.push(noVideoMessage);
        }
        await user.save();
        return res.status(200).json({ chats: user.chats });
    }
    catch (error) {
        return res.status(500).json({ message: "Something went wrong", error: error.message });
    }
};
export const sendChatstoUser = async (req, res, next) => {
    try {
        const user = await User.findById(res.locals.jwtData.id);
        if (!user) {
            return res.status(401).send("User not registered or Token Malfunction");
        }
        if (user._id.toString() !== res.locals.jwtData.id) {
            return res.status(401).send("Permissions Did not Match");
        }
        return res.status(201).json({ message: "OK", chats: user.chats });
    }
    catch (error) {
        console.error('Error retrieving chats:', error);
        return res.status(500).json({ message: "ERROR", cause: error.message });
    }
};
export const deleteChats = async (req, res, next) => {
    try {
        const user = await User.findById(res.locals.jwtData.id);
        if (!user) {
            return res.status(401).send("User not registered or Token Malfunction");
        }
        if (user._id.toString() !== res.locals.jwtData.id) {
            return res.status(401).send("Permissions Did not Match");
        }
        //@ts-ignore
        user.chats = [];
        await user.save();
        return res.status(201).json({ message: "OK" });
    }
    catch (error) {
        console.error('Error deleting chats:', error);
        return res.status(500).json({ message: "ERROR", cause: error.message });
    }
};
//# sourceMappingURL=chat-controllers.js.map