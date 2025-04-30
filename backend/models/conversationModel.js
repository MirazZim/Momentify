import mongoose from "mongoose";

// Define the schema for the Conversation model
const conversationSchema = new mongoose.Schema(
	{
		// The users participating in the conversation
		participants: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: "User",
			},
		],

		// The last message sent in the conversation
		lastMessage: {
			text: String, // The text of the last message
			sender: {
				type: mongoose.Schema.Types.ObjectId,
				ref: "User",
			}, // The user who sent the last message
			seen: {
				type: Boolean,
				default: false,
			}, // Whether the last message has been seen by the recipient
		},
	},
	{
		// Add timestamps to the conversation (createdAt and updatedAt)
		timestamps: true,
	}
);

// Create the Conversation model
const Conversation = mongoose.model("Conversation", conversationSchema);

export default Conversation;