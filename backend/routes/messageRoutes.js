import express from "express";
import protectRoute from "../middlewares/protectRoute.js";
import { addReaction, getConversations, getMessages, sendMessage } from "../controllers/messageController.js";



const router = express.Router();

router.get("/conversations", protectRoute, getConversations);
router.post("/", protectRoute, sendMessage);
router.get("/:otherUserId", protectRoute, getMessages);
router.post("/reactions", protectRoute, addReaction);


export default router;