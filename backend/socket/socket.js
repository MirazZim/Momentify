import { Server } from "socket.io";
import http from "http";
import express from "express";
import Message from "../models/messageModel.js";
import Conversation from "../models/conversationModel.js";

const app = express();

// Create an HTTP server to attach Socket.IO
const server = http.createServer(app);

// Initialize Socket.IO server with CORS configuration
const io = new Server(server, {
    cors: {
        origin: "http://localhost:3000", // Allow frontend origin
        methods: ["GET", "POST"], // Allowed HTTP methods
    },
});


/* Socket Functions for RealTime New Message */
//1. Function to retrieve the socket ID for a given recipient ID from userSocketMap
export const getRecipientSocketId = (recipientId) => {
    return userSocketMap[recipientId];
}

// Store user IDs mapped to their socket IDs
const userSocketMap = {}

// Handle new socket connections
io.on("connection", (socket) => {
    // Log the unique socket ID when a user connects
    //console.log("a user connected", socket.id);



    /* Online Users */

    //1. Extract userId from socket handshake query
    const userId = socket.handshake.query.userId;
    //2. If userId is valid, map it to the socket ID
    if (userId != "undefined") userSocketMap[userId] = socket.id;
    //3. Broadcast the list of online users to all connected clients
    io.emit("getOnlineUsers", Object.keys(userSocketMap));


    /* Mark Messages as Seen */
    socket.on("markMessagesAsSeen", async ({ conversationId, userId }) => {
        try {
             // Update all unseen messages in the conversation to seen
            const updatedMessages = await Message.updateMany(
                { conversationId, seen: false },
                { $set: { seen: true } }
            );
            
             // Notify the client that messages are seen
            io.to(userSocketMap[userId]).emit("messagesSeen", { conversationId });

            // Update the conversation's lastMessage seen status
            await Conversation.updateOne(
                { _id: conversationId },
                { $set: { "lastMessage.seen": true } }
            );
        } catch (error) {
           // console.log("error in markMessagesAsSeen", error);
        }
    });

    socket.on("typing", ({ recipientId, isTyping }) => {
        const recipientSocketId = getRecipientSocketId(recipientId);
        if (recipientSocketId) {
          io.to(recipientSocketId).emit("typing", {
            senderId: socket.handshake.query.userId,
            isTyping
          });
        }
      });








    // Handle user disconnection
    socket.on("disconnect", () => {
        // Log the socket ID of the disconnected user
        console.log("user disconnected", socket.id);



        /* Disconnect Online Users */
        //1. When a user disconnects, remove their ID from the map
        delete userSocketMap[userId];
        //2. Update all clients with the new list of online users
        io.emit("getOnlineUsers", Object.keys(userSocketMap));
    });
});

export { io, server, app };
