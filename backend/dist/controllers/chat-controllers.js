import User from "../models/User.js";
import { configureOpenAI } from "../config/openai-config.js";
export const generateChatCompletion = async (req, res, next) => {
    const { message } = req.body;
    try {
        const user = await User.findById(res.locals.jwtData.id);
        if (!user)
            return res
                .status(401)
                .json({ message: "User not registered OR Token malfunctioned" });
        // grab chats of user
        const chats = user.chats.map(({ role, content }) => ({
            role,
            content,
        }));
        chats.push({ content: message, role: "user" });
        user.chats.push({ content: message, role: "user" });
        // send all chats with new one to OpenAI API
        const openai = configureOpenAI();
        // get latest response
        const chatResponse = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: chats,
        });
        user.chats.push(chatResponse.choices[0].message);
        await user.save();
        return res.status(200).json({ chats: user.chats });
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Something went wrong" });
    }
};
export const sendChatstoUser = async (req, res, next) => {
    try {
        //user token check 
        const user = await User.findById(res.locals.jwtData.id);
        if (!user) {
            return res.status(401).send("User not registered or Token Malfunction");
        }
        console.log(user._id.toString(), res.locals.jwtData.id);
        if (user._id.toString() !== res.locals.jwtData.id) {
            return res.status(401).send("Permissons Did not Match");
        }
        return res
            .status(201).json({ message: "OK", chats: user.chats });
    }
    catch (error) {
        console.log(error);
        return res.status(200).json({ message: "ERROR", cause: error.message });
    }
};
export const deleteChats = async (req, res, next) => {
    try {
        //user token check 
        const user = await User.findById(res.locals.jwtData.id);
        if (!user) {
            return res.status(401).send("User not registered or Token Malfunction");
        }
        console.log(user._id.toString(), res.locals.jwtData.id);
        if (user._id.toString() !== res.locals.jwtData.id) {
            return res.status(401).send("Permissons Did not Match");
        }
        //@ts-ignore
        user.chats = [];
        await user.save();
        return res
            .status(201).json({ message: "OK" });
    }
    catch (error) {
        console.log(error);
        return res.status(200).json({ message: "ERROR", cause: error.message });
    }
};
//# sourceMappingURL=chat-controllers.js.map