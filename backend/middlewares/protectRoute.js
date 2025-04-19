import User from "../models/userModel.js";
import jwt from "jsonwebtoken";

const protectRoute = async (req, res, next) => {
    try {

        //1.trying to get the JWT token from the user's cookies.
        const token = req.cookies.jwt;

        //1.1 If there is no token, you immediately send back a 401 Unauthorized response and stop further execution.
        if (!token) {
            return res.status(401).json({ message: "Unauthorized" });
        }
         
        //2.If the token is there, you use jwt.verify() to check if the token is valid.
        //3.You pass it the JWT_SECRET (the secret key you used when signing the token originally).
        //4.jwt.verify() decodes the token and returns the payload inside it (like userId, email, etc.).
        const decoded = await jwt.verify(token, process.env.JWT_SECRET);
        

        //5. You use the decoded userId to find the user in the database 
        // .select("-password") means you don't want to return the password field — good for security!
        const user = await User.findById(decoded.userId).select("-password");

        //You attach the user object (without password) to req.user.
        req.user = user;

        //After everything is good, you call next() to pass control to the next middleware or route handler.
        next();
    } catch (error) {
        res.status(500).json({ message: error.message });
        console.log("error in protectRoute", error);
    }
};

export default protectRoute;