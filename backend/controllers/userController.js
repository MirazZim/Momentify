import User from "../models/userModel.js";
import bcrypt from "bcryptjs";
import generateTokenAndSetCookies from "../utils/helpers/generateTokenAndSetCookies.js";



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
        const { username, password } = req.body;

        //check if user already exists
        const user = await User.findOne({ username })

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

    // 1.Destructure fields from the request body
    const { name, email, username, password, profilePic, bio } = req.body;

    //2. Get the current user's ID from the authenticated request
    const userId = req.user._id;

    try {
        //3. Find the user in the database by ID
        let user = await User.findById(userId);
        if (!user) return res.status(400).json({ message: "User Not Found" })
            
        //4.you can not update others profile only yours can
        if (req.params.id !== userId.toString())
            return res.status(400).json({ error: "You cannot update other user's profile" });

        //5. If a new password is provided, hash it securely
        if (password) {
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);
            user.password = hashedPassword;
        }

        //6. Update user's profile fields if provided, otherwise keep existing values
        user.name = name || user.name;
        user.email = email || user.email;
        user.username = username || user.username;
        user.profilePic = profilePic || user.profilePic;
        user.bio = bio || user.bio;

        //7. Save the updated user document back to the database
        user = await user.save();
        res.status(200).json({ message: "Profile updated Successfully", user });


    } catch (error) {
        res.status(500).json({ message: error.message });
        console.log("error in updateUser", error);
    }
};



export { signupUser, loginUser, logoutUser, followUnfollowUser, updateUser };