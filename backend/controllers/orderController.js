import orderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js";
import foodModel from "../models/foodModel.js";

// User: Place an order
export const placeOrder = async (req, res) => {
  try {
    const userId = req.user.id;
    const { address, paymentMethod, items, amount } = req.body;

    if (!items || Object.keys(items).length === 0) {
      return res.status(400).json({ success: false, message: "Cart is empty" });
    }

    // Build item details from food model
    const detailedItems = await Promise.all(
      Object.entries(items).map(async ([foodId, quantity]) => {
        const food = await foodModel.findById(foodId);
        if (!food) return null;
        return {
          foodId,
          name: food.name,
          image: food.image,
          price: food.price,
          quantity,
          total: food.price * quantity,
        };
      })
    );

    const finalItems = detailedItems.filter(Boolean);

    const newOrder = new orderModel({
      userId,
      address,
      paymentMethod,
      items: finalItems,
      amount,
      status: "Pending",
      payment: false,
      date: new Date(),
    });

    await newOrder.save();

    // Clear user cart
    await userModel.findByIdAndUpdate(userId, { cartData: {} });

    res.status(201).json({ success: true, message: "Order placed successfully" });
  } catch (error) {
    console.error("Order placement error:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// User: Mark order as paid
export const markOrderAsPaid = async (req, res) => {
  try {
    const { orderId } = req.body;
    const userId = req.user.id;

    const order = await orderModel.findById(orderId);
    if (!order) {
      return res.status(404).json({ success: false, message: "Order not found" });
    }

    if (order.userId.toString() !== userId.toString()) {
      return res.status(403).json({ success: false, message: "Unauthorized" });
    }

    order.status = "Paid";
    order.payment = true;
    await order.save();

    res.status(200).json({ success: true, message: "Order marked as paid" });
  } catch (error) {
    console.error("Payment simulation error:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// User: Get all orders for logged-in user
export const getUserOrders = async (req, res) => {
  try {
    const userId = req.user.id;
    const orders = await orderModel.find({ userId }).sort({ date: -1 });
    res.status(200).json({ success: true, orders });
  } catch (error) {
    console.error("Error fetching user orders:", error);
    res.status(500).json({ success: false, message: "Failed to fetch orders" });
  }
};

// User: Cancel order
export const cancelOrder = async (req, res) => {
  try {
    const userId = req.user.id;
    const { orderId } = req.body;

    const order = await orderModel.findById(orderId);
    if (!order) {
      return res.status(404).json({ success: false, message: "Order not found" });
    }

    if (order.userId.toString() !== userId.toString()) {
      return res.status(403).json({ success: false, message: "Unauthorized" });
    }

    if (order.status === "Cancelled") {
      return res.status(400).json({ success: false, message: "Order already cancelled" });
    }

    if (order.status === "Paid") {
      return res.status(400).json({ success: false, message: "Cannot cancel paid order" });
    }

    order.status = "Cancelled";
    await order.save();

    res.status(200).json({ success: true, message: "Order cancelled successfully" });
  } catch (error) {
    console.error("Cancel order error:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

//  Admin: Get all orders
export const getAllOrders = async (req, res) => {
  try {
    const orders = await orderModel
      .find()
      .populate("userId", "name email")
      .sort({ date: -1 });

    res.status(200).json({ success: true, data: orders });
  } catch (error) {
    console.error("Admin get all orders error:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// Admin: Update order status
export const updateOrderStatus = async (req, res) => {
  try {
    const { orderId, status } = req.body;

    const order = await orderModel.findById(orderId);
    if (!order) {
      return res.status(404).json({ success: false, message: "Order not found" });
    }

    order.status = status;
    await order.save();

    res.status(200).json({ success: true, message: "Order status updated" });
  } catch (error) {
    console.error("Order status update error:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};
