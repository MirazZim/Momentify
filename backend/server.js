import express from "express";
import dotenv from "dotenv";
import connectDB from "./db/connectDB.js";
import cookieParser from "cookie-parser";
import userRoutes from "./routes/userRoutes.js";





dotenv.config();
connectDB();
const app = express();

const PORT = process.env.PORT || 5000;

//To parse json data in the body of the request
//This middleware parses the body of the request and converts it into a JSON object
//This is required because the body of the request is sent as a stream and not as a JSON object
//After this middleware is used, the body of the request is available as a JSON object in the request object
app.use(express.json());


//This middleware parses the urlencoded data sent in the body of the request
//urlencoded data is sent when a form is submitted
//extended: false means that the query string will only contain simple key/value pairs
//extended: true means that the query string can contain arrays and objects
app.use(express.urlencoded({ extended: true }));

//This middleware parses the cookie data sent in the body of the request
app.use(cookieParser());


//routes
app.use("/api/users", userRoutes);


app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

