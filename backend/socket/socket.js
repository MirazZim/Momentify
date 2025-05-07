import { Server } from "socket.io";
import http from "http";
import Message from "../models/messageModel.js";
import Conversation from "../models/conversationModel.js";

let ioInstance = null;
const userSocketMap = {};

export const getRecipientSocketId = (recipientId) => {
    return userSocketMap[recipientId];
};

export const initializeSocket = (app) => {
    const server = http.createServer(app);
    ioInstance = new Server(server, {
        cors: {
            origin: process.env.FRONTEND_URL || "http://localhost:3000",
            methods: ["GET", "POST"],
            credentials: true
        },
    });

    ioInstance.on("connection", (socket) => {
        console.log("User connected:", socket.id);

        const userId = socket.handshake.query.userId;
        if (userId && userId !== "undefined") {
            userSocketMap[userId] = socket.id;
        }

        ioInstance.emit("getOnlineUsers", Object.keys(userSocketMap));

        socket.on("markMessagesAsSeen", async ({ conversationId, userId }) => {
            try {
                await Message.updateMany(
                    { conversationId, seen: false },
                    { $set: { seen: true } }
                );
                
                const recipientSocketId = getRecipientSocketId(userId);
                if (recipientSocketId) {
                    ioInstance.to(recipientSocketId).emit("messagesSeen", { conversationId });
                }

                await Conversation.updateOne(
                    { _id: conversationId },
                    { $set: { "lastMessage.seen": true } }
                );
            } catch (error) {
                console.error("Error marking messages as seen:", error);
            }
        });

        socket.on("typing", ({ recipientId, isTyping }) => {
            const recipientSocketId = getRecipientSocketId(recipientId);
            if (recipientSocketId) {
                ioInstance.to(recipientSocketId).emit("typing", {
                    senderId: socket.handshake.query.userId,
                    isTyping
                });
            }
        });

        socket.on("disconnect", () => {
            console.log("User disconnected:", socket.id);
            if (userId) {
                delete userSocketMap[userId];
                ioInstance.emit("getOnlineUsers", Object.keys(userSocketMap));
            }
        });
    });

    return { server, io: ioInstance };
};

export const getIo = () => {
    if (!ioInstance) {
        throw new Error("Socket.IO not initialized");
    }
    return ioInstance;
};