import express from "express";
import {
  loginUser,
  registerUser,
  getUserProfile,
  saveCart,
  updateUserAddress,   
} from "../controllers/userController.js";
import authMiddleware from "../middleware/auth.js";

const userRouter = express.Router();

// Public routes
userRouter.post("/register", registerUser);
userRouter.post("/login", loginUser);

// Authenticated routes
userRouter.get("/profile", authMiddleware, getUserProfile);
userRouter.post("/save-cart", authMiddleware, saveCart);
userRouter.put("/update-address", authMiddleware, updateUserAddress); 

export default userRouter;
