import mongoose from "mongoose";

// Define the schema for the Message model
const messageSchema = new mongoose.Schema(
	{
		// The conversation that this message belongs to
		conversationId: { type: mongoose.Schema.Types.ObjectId, ref: "Conversation" },

		// The user that sent this message
		sender: { type: mongoose.Schema.Types.ObjectId, ref: "User" },

		// The text of the message
		text: String,

		// Whether the message has been seen by the recipient
		seen: {
			type: Boolean,
			default: false,
		},

		// The image associated with the message (if any)
		img: {
			type: String,
			default: "",
		},
	},
	{
		// Add timestamps to the message (createdAt and updatedAt)
		timestamps: true,
	}
);

// Create the Message model
const Message = mongoose.model("Message", messageSchema);

export default Message;