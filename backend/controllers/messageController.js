import Conversation from "../models/conversationModel.js";
import { v2 as cloudinary } from "cloudinary";
import Message from "../models/messageModel.js";




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

        // const recipientSocketId = getRecipientSocketId(recipientId);
        // if (recipientSocketId) {
        // 	// Send the new message to the recipient's socket
        // 	io.to(recipientSocketId).emit("newMessage", newMessage);
        // }

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

export { sendMessage, getMessages };