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


export { createPost };