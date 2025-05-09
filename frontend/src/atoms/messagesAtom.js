import { atom } from "recoil";

// State to hold all conversations of the current user
export const conversationsAtom = atom({
	key: "conversationsAtom",
	default: [],
});

// State to hold the selected conversation
export const selectedConversationAtom = atom({
	key: "selectedConversationAtom",
	default: {
		_id: "", // id of the conversation
		userId: "", // id of the other user in the conversation
		username: "", // username of the other user in the conversation
		userProfilePic: "", // profile picture of the other user in the conversation
	},
});