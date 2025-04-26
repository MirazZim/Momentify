import User from "../models/userModel.js";
import Post from "../models/postModel.js";
import { v2 as cloudinary } from "cloudinary";

const createPost = async (req, res) => {
    try {
        //Destructure from the body
        const { postedBy, text } = req.body;

        let { img } = req.body;
        
        // Check if 'postedBy' and 'text' are provided, if not, send a 400 error
        if (!postedBy || !text) {
            return res.status(400).json({ error: "Postedby and text fields are required" });
        }

        // Find the user by the 'postedBy' ID
        const user = await User.findById(postedBy)

        // If no user is found, send a 400 error
        if (!user) {
            return res.status(400).json({ error: "User not found" });
        }

        // Check if the authenticated user is the same as the 'postedBy' user
        if (user._id.toString() !== req.user._id.toString()) {
            return res.status(401).json({ error: "You are not Unauthorized to create post for someonelse" });
        }

        // If the text exceeds the maximum length, send a 400 error
        const maxLength = 500;
        if (text.length > maxLength) {
            return res.status(400).json({ error: `Text must be less than ${maxLength} characters` });
        }

        if (img) {
            const uploadedResponse = await cloudinary.uploader.upload(img);
            img = uploadedResponse.secure_url;
        }

        // Create a new Post instance with 'postedBy', 'text', and 'img'
        const newPost = new Post({ postedBy, text, img });

        // Save the newly created post to the database
        await newPost.save();
        res.status(201).json(newPost);

    } catch (error) {
        res.status(500).json({ error: error.message });
        console.log("error in createPost", error);
    }

}

const getPost = async (req, res) => {
    try {

        const post = await Post.findById(req.params.id)

        if (!post) {
            return res.status(404).json({ error: "Post not found" });
        }

        res.status(200).json({ post });

    } catch (error) {
        res.status(500).json({ error: error.message });
        console.log("error in getPost", error);
    }
}

const deletePost = async (req, res) => {
    try {



        // Find the post by the 'id'
        const post = await Post.findById(req.params.id);

        // If no post is found, send a 400 error
        if (!post) {
            return res.status(400).json({ error: "Post not found" });
        }

        // Check if the authenticated user is the same as the 'postedBy' user
        if (post.postedBy.toString() !== req.user._id.toString()) {
            return res.status(401).json({ error: "You are not Unauthorized to delete this post" });
        }

        // Delete the post from the database
        await Post.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: "Post deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
        console.log("error in deletePost", error);
    }
}

const likeUnlikePost = async (req, res) => {
    try {
        //1. Get the post id from the request parameters
        const { id: postId } = req.params;

        //2. Get the user id from the request user object
        const userId = req.user._id;

        //3. Find the post by the given id
        const post = await Post.findById(postId);

        //3.1 If no post is found, send a 404 error
        if (!post) {
            return res.status(404).json({ error: "Post not found" });
        }

        //4. Check if the user has already liked the post
        const userLikedPost = post.likes.includes(userId);

        //4.1 If the user has already liked the post, unlike it
        if (userLikedPost) {
            //4.1.1 Update the post document by removing the user id from the likes array
            await Post.updateOne({ _id: postId }, { $pull: { likes: userId } });
            //4.1.2 Send a 200 response with a message
            res.status(200).json({ message: "Post unliked successfully" });
        } else {
            //4.2 If the user has not liked the post, like it
            //4.2.1 Add the user id to the likes array of the post document
            post.likes.push(userId);
            //4.2.2 Save the updated post document
            await post.save();
            //4.2.3 Send a 200 response with a message
            res.status(200).json({ message: "Post liked successfully" });
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

const replyToPost = async (req, res) => {
    try {
        //This gets the "text" from the request that the user sent.
        const { text } = req.body;

        //This gets the ID of the post from the URL that the user wants to reply to.
        const postId = req.params.id;

        //This gets the ID of the user from the request object.
        const userId = req.user._id;

        //This gets the profile picture of the user from the request object.
        const userProfilePic = req.user.profilePic;

        //This gets the username of the user from the request object.
        const username = req.user.username;

        if (!text) {
            return res.status(400).json({ error: "Text field is required" });
        }


        //This checks if the "text" is missing. If it is, it sends an error message saying "Text is required"
        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({ error: "Post not found" });
        }

        const reply = { userId, text, userProfilePic, username };

        //This creates a new reply object that includes the user's ID, text, profile picture, and username.
        post.replies.push(reply);
        await post.save();

        res.status(200).json(reply);
    } catch (error) {
        res.status(500).json({ error: error.message });
        console.log("error in replyToPost", error);
    }
}

const getFeedPosts = async (req, res) => {
    try {
        // The userId is retrieved from the authenticated request (req.user._id). 
        const userId = req.user._id;

        // We find the user in the database using the userId.
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        // Get the list of users that the current user is following. This is an array of user IDs.
        const following = user.following;


        // Query the Post collection to find all posts made by the users that the current user is following.
        // This will return posts where the 'postedBy' field matches any of the IDs in the 'following' array.
        // The posts are sorted by the 'createdAt' field in descending order (newest posts first).
        const feedPosts = await Post.find({ postedBy: { $in: following } }).sort({ createdAt: -1 });

        res.status(200).json(feedPosts);
    } catch (error) {
        res.status(500).json({ error: error.message });
        console.log("error in getFeedPosts", error);
    }
}

const getUserPosts = async (req, res) => {
	const { username } = req.params;
	try {
		const user = await User.findOne({ username });
		if (!user) {
			return res.status(404).json({ error: "User not found" });
		}

		const posts = await Post.find({ postedBy: user._id }).sort({ createdAt: -1 });

		res.status(200).json(posts);
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
};

export { createPost, getPost, deletePost, likeUnlikePost, replyToPost, getFeedPosts, getUserPosts };
