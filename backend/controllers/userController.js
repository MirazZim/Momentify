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
        if (!user ||!isPasswordCorrect) {
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
        res.cookie("jwt","",{maxAge:1});

        // Send a 200 response with a message
        return res.status(200).json({
            message: "User logged out successfully"
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
        console.log("error in logoutUser", error);
    }
}



export { signupUser, loginUser, logoutUser, followUnfollowUser };