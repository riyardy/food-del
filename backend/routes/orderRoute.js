import express from "express";
import authMiddleware from "../middleware/auth.js";
import {
  placeOrder,
  markOrderAsPaid,
  getUserOrders,
  cancelOrder,
  getAllOrders,
  updateOrderStatus
} from "../controllers/orderController.js";

const router = express.Router();

// User Routes
router.post("/place", authMiddleware, placeOrder);
router.post("/pay", authMiddleware, markOrderAsPaid);
router.get("/user", authMiddleware, getUserOrders);
router.post("/cancel", authMiddleware, cancelOrder);

// Admin Routes
router.get("/list", authMiddleware, getAllOrders);
router.post("/status", authMiddleware, updateOrderStatus);

export default router;
