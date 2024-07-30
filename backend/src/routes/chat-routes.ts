import { Router } from "express";
import { verifyToken } from "../utils/token-manager.js";
import { chatCompletionValidator, validate } from "../utils/validators.js";
import { deleteChats, generateChatCompletion, sendChatstoUser,} from "../controllers/chat-controllers.js";
import { addSavedVideo, getSavedVideos } from "../controllers/user-controllers.js";

//Protected API
const chatRoutes = Router();

chatRoutes.post(
  "/new",
  validate(chatCompletionValidator),
  verifyToken,
  generateChatCompletion
);

chatRoutes.get("/all-chats", verifyToken, sendChatstoUser);
chatRoutes.delete("/delete", verifyToken, deleteChats);
chatRoutes.post("/saved-videos", verifyToken, addSavedVideo);
chatRoutes.get("/saved-videos", verifyToken, getSavedVideos);



export default chatRoutes;