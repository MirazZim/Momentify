import Conversation from "../models/conversationModel.js";
import { v2 as cloudinary } from "cloudinary";
import Message from "../models/messageModel.js";
import { getRecipientSocketId, io } from "../socket/socket.js";



async function sendMessage(req, res) {
    try {
        const { recipientId, message } = req.body;
        // If there is an image in the request body, we upload it to Cloudinary
        let { img } = req.body;
        const senderId = req.user._id;

        // Check if a conversation between the sender and recipient already exists
        let conversation = await Conversation.findOne({
            // Find a conversation which has both the sender and recipient as participants
            participants: { $all: [senderId, recipientId] },
        });

        // If no conversation exists, we create a new one
        if (!conversation) {
            conversation = new Conversation({
                // Add the sender and recipient as participants
                participants: [senderId, recipientId],
                // Set the last message to the one sent in the request body
                lastMessage: {
                    text: message,
                    sender: senderId,
                },
            });
            await conversation.save();
        }

        // If there is an image in the request body, we upload it to Cloudinary
        if (img) {
            const uploadedResponse = await cloudinary.uploader.upload(img);
            // Set the img property of the new message to the secure url of the uploaded image
            img = uploadedResponse.secure_url;
        }

        // Create a new message with the conversationId, senderId, text and img
        const newMessage = new Message({
            conversationId: conversation._id,
            sender: senderId,
            text: message,
            img: img || "",
        });

        // Save the new message and update the last message of the conversation
        await Promise.all([
            newMessage.save(),
            conversation.updateOne({
                // Set the last message of the conversation to the new message
                lastMessage: {
                    text: message,
                    sender: senderId,
                },
            }),
        ]);

        /* Implementing Socket for RealTime New Message */


        //1. Get the socket ID of the recipient using their user ID
        const recipientSocketId = getRecipientSocketId(recipientId);
        //2. If the recipient is online, send the new message to their socket
        if (recipientSocketId) {
            //3. Send the new message to the recipient's socket
            io.to(recipientSocketId).emit("newMessage", newMessage);

        }

        res.status(201).json(newMessage);
    } catch (error) {
        // If there is an error, return a 500 status with the error message
        res.status(500).json({ error: error.message });
    }
}

async function getMessages(req, res) {
    const { otherUserId } = req.params;
    const userId = req.user._id;

    try {
        // Find the conversation with the given user IDs
        const conversation = await Conversation.findOne({
            // The participants array must contain both the current user and the other user
            participants: { $all: [userId, otherUserId] },
        });

        if (!conversation) {
            // If the conversation is not found, return a 404 error
            return res.status(404).json({ error: "Conversation not found" });
        }

        // Find all messages in the conversation
        const messages = await Message.find({
            // The conversationId field of the messages must match the conversation ID
            conversationId: conversation._id,
        }).sort({ createdAt: 1 }); // Sort messages by createdAt date

        // Return the messages in the response
        res.status(200).json(messages);
    } catch (error) {
        // If there is an error, return a 500 status with the error message
        res.status(500).json({ error: error.message });
    }
}

async function getConversations(req, res) {
    // Get the conversations of the current user
    const userId = req.user._id;
    try {
        // Find all conversations that the current user is a participant in
        const conversations = await Conversation.find({ participants: userId }).populate({
            path: "participants",
            select: "username profilePic",
        });

        // Remove the current user from the participants array
        // So that the recipient is the only one left in the array
        conversations.forEach((conversation) => {
            conversation.participants = conversation.participants.filter(
                (participant) => participant._id.toString() !== userId.toString()
            );
        });

        // Return the conversations in the response
        res.status(200).json(conversations);
    } catch (error) {
        // If there is an error, return a 500 status with the error message
        res.status(500).json({ error: error.message });
    }
}

async function addReaction(req, res) {
    try {
        const { messageId, emoji } = req.body;
        const userId = req.user._id;

        // Find the message
        const message = await Message.findById(messageId);
        if (!message) {
            return res.status(404).json({ error: "Message not found" });
        }

        // Initialize reactions array if it doesn't exist
        message.reactions = message.reactions || [];

        // Check if the user already has any reaction
        const userReactionIndex = message.reactions.findIndex(r => r.users.includes(userId));

        if (userReactionIndex >= 0) {
            // User already has a reaction, check if it's the same emoji (toggle off) or different (replace)
            if (message.reactions[userReactionIndex].emoji === emoji) {
                // Toggle off: remove the user's reaction
                const userIndex = message.reactions[userReactionIndex].users.indexOf(userId);
                message.reactions[userReactionIndex].users.splice(userIndex, 1);
                if (message.reactions[userReactionIndex].users.length === 0) {
                    message.reactions.splice(userReactionIndex, 1);
                }
            } else {
                // Replace existing reaction with new emoji
                message.reactions[userReactionIndex].emoji = emoji;
                message.reactions[userReactionIndex].users = [userId]; // Reset users to only the current user
            }
        } else {
            // User has no reaction, add the new one
            message.reactions.push({ emoji, users: [userId] });
        }

        // Save the updated message
        const updatedMessage = await message.save();

        // Convert to plain object and ensure _id is string
        const messageObject = updatedMessage.toObject();
        messageObject._id = messageObject._id.toString();

        // Emit the updated message to all clients
        const io = req.app.get('io');
        if (!io) {
            throw new Error("Socket.io instance not available");
        }
        io.emit('messageReaction', messageObject);

        res.status(200).json({ success: true, message: updatedMessage });
    } catch (error) {
        console.error("Error in addReaction:", error);
        res.status(500).json({ error: error.message });
    }
}
export { sendMessage, getMessages, getConversations, addReaction };