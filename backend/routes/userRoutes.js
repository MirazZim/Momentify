import express from "express";
import { followUnfollowUser, getSuggestedUsers, getUserProfile, loginUser, logoutUser, signupUser, updateUser, getAllUsers } from "../controllers/userController.js";
import protectRoute from "../middlewares/protectRoute.js";

const router = express.Router();

router.get("/profile/:query", getUserProfile)
router.get("/suggested", protectRoute, getSuggestedUsers);
router.get("/all", protectRoute, getAllUsers);
router.post("/signup", signupUser);
router.post("/login", loginUser);
router.post("/logout", logoutUser);
router.post("/follow/:id", protectRoute, followUnfollowUser);
router.put("/update/:id", protectRoute, updateUser);

export default router;
