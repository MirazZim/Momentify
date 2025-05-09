import path from "path";
import express from "express";
import dotenv from "dotenv";
import connectDB from "./db/connectDB.js";
import cookieParser from "cookie-parser";
import userRoutes from "./routes/userRoutes.js";
import postRoutes from "./routes/postRoutes.js";
import { v2 as cloudinary } from "cloudinary";
import messageRoutes from "./routes/messageRoutes.js";
import { app, server } from "./socket/socket.js";
import job from "./cron/cron.js";

dotenv.config();
connectDB();
job.start();

const PORT = process.env.PORT || 5000;
const __dirname = path.resolve();


cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});


//To parse json data in the body of the request
//This middleware parses the body of the request and converts it into a JSON object
//This is required because the body of the request is sent as a stream and not as a JSON object
//After this middleware is used, the body of the request is available as a JSON object in the request object
app.use(express.json({ limit: '50mb' }));


//This middleware parses the urlencoded data sent in the body of the request
//urlencoded data is sent when a form is submitted
//extended: false means that the query string will only contain simple key/value pairs
//extended: true means that the query string can contain arrays and objects
app.use(express.urlencoded({ extended: true }));

//This middleware parses the cookie data sent in the body of the request
app.use(cookieParser());

// API routes

//routesd
app.use("/api/users", userRoutes);

app.use("/api/posts", postRoutes);
app.use("/api/messages", messageRoutes);



// Production setup
if (process.env.NODE_ENV === "production") {
    app.use(express.static(path.join(__dirname, "/frontend/dist")));
    app.get("*", (req, res) => {
        res.sendFile(path.resolve(__dirname, "frontend", "dist", "index.html"));
    });
}

// Start the server on the specified port
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});