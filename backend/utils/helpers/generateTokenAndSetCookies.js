import jwt from "jsonwebtoken";

const generateTokenAndSetCookies = (userId, res) => {
    const token = jwt.sign({ userId }, process.env.JWT_SECRET,{
        expiresIn: "15d",
    })

    res.cookie("jwt", token, {
        httpOnly: true, // Prevents access to the cookie from client-side scripts
        sameSite: "strict", // Prevents cross-site request forgery attacks
        maxAge: 15 * 24 * 60 * 60 * 1000, // 15 days in milliseconds
    });
 
    return token;
};

export default generateTokenAndSetCookies;