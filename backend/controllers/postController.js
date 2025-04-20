import User from "../models/userModel.js";
import Post from "../models/postModel.js";

const createPost = async (req, res) => {
    try {
        //Destructure from the body
        const { postedBy, text, img } = req.body;

        // Check if 'postedBy' and 'text' are provided, if not, send a 400 error
        if (!postedBy || !text) {
            return res.status(400).json({ message: "Missing required fields" });
        }

        // Find the user by the 'postedBy' ID
        const user = await User.findById(postedBy)

        // If no user is found, send a 400 error
        if (!user) {
            return res.status(400).json({ message: "User not found" });
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

        // Create a new Post instance with 'postedBy', 'text', and 'img'
        const newPost = new Post({ postedBy, text, img });

        // Save the newly created post to the database
        await newPost.save();
        res.status(201).json({ message: "Post created successfully", newPost })


    } catch (error) {
        res.status(500).json({ message: error.message });
        console.log("error in createPost", error);
    }

}

const getPost = async (req, res) => {
    try {

        const post = await Post.findById(req.params.id)

        if (!post) {
            return res.status(404).json({ message: "Post not found" });
        }

        res.status(200).json({ post });

    } catch (error) {
        res.status(500).json({ message: error.message });
        console.log("error in getPost", error);
    }
}

const deletePost = async (req, res) => {
    try {



        // Find the post by the 'id'
        const post = await Post.findById(req.params.id);

        // If no post is found, send a 400 error
        if (!post) {
            return res.status(400).json({ message: "Post not found" });
        }

        // Check if the authenticated user is the same as the 'postedBy' user
        if (post.postedBy.toString() !== req.user._id.toString()) {
            return res.status(401).json({ error: "You are not Unauthorized to delete this post" });
        }

        // Delete the post from the database
        await Post.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: "Post deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
        console.log("error in deletePost", error);
    }
}

export { createPost, getPost, deletePost };