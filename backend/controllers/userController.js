import User from "../models/userModel.js";
import bcrypt from "bcryptjs";
import generateTokenAndSetCookies from "../utils/helpers/generateTokenAndSetCookies.js";
import { v2 as cloudinary } from "cloudinary";
import mongoose from "mongoose";
import Post from "../models/postModel.js";


const getUserProfile = async (req, res) => {
    // We will fetch user profile either with username or userId
    // query is either username or userId
    const { query } = req.params; 

    try {

        let user;

		// query is userId
		if (mongoose.Types.ObjectId.isValid(query)) {
			user = await User.findOne({ _id: query }).select("-password").select("-updatedAt");
		} else {
			// query is username
			user = await User.findOne({ username: query }).select("-password").select("-updatedAt");
		}
        
        if (!user) return res.status(404).json({ error: "User not found" });
        res.status(200).json(user);
    } catch (err) {
        res.status(500).json({ error: err.message });
        console.log("Error in getUserProfile: ", err.message);
    }
};

const signupUser = async (req, res) => {
    try {

        //Extracting Data from req.body
        const { name, email, username, password } = req.body;

        //check if user already exists
        const user = await User.findOne({ $or: [{ email }, { username }] })

        //If it exists then it sends me a message saying user already exists
        if (user) {
            return res.status(400).json({ message: "User already exists" });
        }

        // This generates a salt for hashing the password. A salt is a random value added to the password before hashing, making it more secure. The number 10 indicates the cost factor for generating the salt (higher numbers make the hashing process slower but more secure).
        const salt = await bcrypt.genSalt(10);

        // the hashed password. This ensures that the password is stored securely in the database, not as plain text.
        const hashedPassword = await bcrypt.hash(password, salt);

        //create user
        const newUser = new User({
            name,
            email,
            username,
            password: hashedPassword,
        })


        //Saving the User to the Database:
        await newUser.save();

        //If the user is successfully saved to the database, this block is executed. The server responds with a 201 status code
        if (newUser) {

            generateTokenAndSetCookies(newUser._id, res);

            return res.status(201).json({
                _id: newUser._id,
                name: newUser.name,
                email: newUser.email,
                username: newUser.username,
            });
        } else {
            return res.status(400).json({ message: "User creation failed" });
        }

    } catch (error) {
        res.status(500).json({ message: error.message });
        console.log("error in signupUser", error);
    }
};

const loginUser = async (req, res) => {
    try {
        //Extracting Data from req.body
        const { email, password } = req.body;

        //check if user already exists
        const user = await User.findOne({ email })

        //If user not found
        if (!user) {
            return res.status(400).json({ message: "User not found" });
        }

        // Compare the provided password with the hashed password in the database
        const isPasswordCorrect = await bcrypt.compare(password, user?.password || "");
        if (!user || !isPasswordCorrect) {
            return res.status(400).json({ message: "Invalid UserName or Password" });
        }

        // Generate a token and set cookies for the user
        generateTokenAndSetCookies(user._id, res);

        return res.status(200).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            username: user.username,
            profilePic: user.profilePic,
            bio: user.bio,
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
        console.log("error in loginUser", error);
    }
}

const logoutUser = async (req, res) => {
    try {
        // Clear the token and cookies from the response
        res.cookie("jwt", "", { maxAge: 1 });

        // Send a 200 response with a message
        return res.status(200).json({
            message: "User logged out successfully"
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
        console.log("error in logoutUser", error);
    }
}

const followUnfollowUser = async (req, res) => {
    try {
        // Destructure the 'id' parameter from the request URL
        const { id } = req.params;

        // Find the user that you want to follow/unfollow
        const userToModify = await User.findById(id);

        // Find the current logged-in user using req.user._id
        const currentUser = await User.findById(req.user._id);

        // Check if user is trying to follow/unfollow themselves
        if (id === req.user._id.toString()) return res.status(400).json({ message: "You cannot follow/unfollow yourself" });

        // If either user is not found in the database, return an error
        if (!userToModify || !currentUser) return res.status(400).json({ error: "User not found" });

        // Check if the current user is already following the target user
        const isFollowing = currentUser.following.includes(id);

        if (isFollowing) {
            // If already following, remove the current user from the target user's followers
            await User.findByIdAndUpdate(id, { $pull: { followers: req.user._id } });

            // Also remove the target user from the current user's following list
            await User.findByIdAndUpdate(req.user._id, { $pull: { following: id } });
            res.status(200).json({ message: "User unfollowed successfully" });
        } else {
            // If not following, add the current user to the target user's followers
            await User.findByIdAndUpdate(id, { $push: { followers: req.user._id } });

            // Also add the target user to the current user's following list
            await User.findByIdAndUpdate(req.user._id, { $push: { following: id } });
            res.status(200).json({ message: "User followed successfully" });
        }

    } catch (error) {
        res.status(500).json({ message: error.message });
        console.log("error in followUnfollowUser", error);
    }
}

const updateUser = async (req, res) => {
	const { name, email, username, password, bio } = req.body;
	let { profilePic } = req.body;

	const userId = req.user._id;
	try {
		let user = await User.findById(userId);
		if (!user) return res.status(400).json({ error: "User not found" });

		if (req.params.id !== userId.toString())
			return res.status(400).json({ error: "You cannot update other user's profile" });

		if (password) {
			const salt = await bcrypt.genSalt(10);
			const hashedPassword = await bcrypt.hash(password, salt);
			user.password = hashedPassword;
		}

		if (profilePic) {
			if (user.profilePic) {
				await cloudinary.uploader.destroy(user.profilePic.split("/").pop().split(".")[0]);
			}

			const uploadedResponse = await cloudinary.uploader.upload(profilePic);
			profilePic = uploadedResponse.secure_url;
		}

		user.name = name || user.name;
		user.email = email || user.email;
		user.username = username || user.username;
		user.profilePic = profilePic || user.profilePic;
		user.bio = bio || user.bio;

		user = await user.save();

        // Find all posts that this user replied and update username and userProfilePic fields
        await Post.updateMany(
			{ "replies.userId": userId },
			{
				$set: {
					"replies.$[reply].username": user.username,
					"replies.$[reply].userProfilePic": user.profilePic,
				},
			},
			{ arrayFilters: [{ "reply.userId": userId }] }
		);

		// password should be null in response
		user.password = null;

		res.status(200).json(user);
	} catch (err) {
		res.status(500).json({ error: err.message });
		console.log("Error in updateUser: ", err.message);
	}
};

const getSuggestedUsers = async (req, res) => {
	try {
		// exclude the current user from suggested users array and exclude users that current user is already following
		const userId = req.user._id;

		const usersFollowedByYou = await User.findById(userId).select("following");

		const users = await User.aggregate([
			{
				$match: {
					_id: { $ne: userId },
				},
			},
			{
				$sample: { size: 10 },
			},
		]);
		const filteredUsers = users.filter((user) => !usersFollowedByYou.following.includes(user._id));
		const suggestedUsers = filteredUsers.slice(0, 4);

		suggestedUsers.forEach((user) => (user.password = null));

		res.status(200).json(suggestedUsers);
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
};

const getAllUsers = async (req, res) => {
    try {
        const userId = req.user._id;
        
        // Get current user's following list
        const currentUser = await User.findById(userId).select("following");
        
        // Find users not in following list and not the current user
        const users = await User.find({ 
            _id: { 
                $ne: userId, 
                $nin: currentUser.following 
            } 
        }).select("-password");

        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


export { signupUser, loginUser, logoutUser, followUnfollowUser, updateUser, getUserProfile,
    getSuggestedUsers, getAllUsers
 };