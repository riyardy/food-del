import userModel from "../models/userModel.js";

// Add item to cart (increment count)
const addToCart = async (req, res) => {
  try {
    const user = await userModel.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    let cartData = user.cartData || {};

    if (!cartData[req.body.itemId]) {
      cartData[req.body.itemId] = 1;
    } else {
      cartData[req.body.itemId] += 1;
    }

    await userModel.findByIdAndUpdate(req.user.id, { cartData });

    res.json({ success: true, message: "Item added to cart" });
  } catch (error) {
    console.error("Add to cart error:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// Remove item from cart (decrement count, but keep item even if 0)
const removeFromCart = async (req, res) => {
  try {
    const user = await userModel.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    let cartData = user.cartData || {};

    if (cartData[req.body.itemId]) {
      cartData[req.body.itemId] = Math.max(cartData[req.body.itemId] - 1, 0); // don't go below 0

      await userModel.findByIdAndUpdate(req.user.id, { cartData });
      res.json({ success: true, message: "Item removed from cart" });
    } else {
      // If item doesn't exist in cart, set it to 0
      cartData[req.body.itemId] = 0;
      await userModel.findByIdAndUpdate(req.user.id, { cartData });
      res.status(200).json({ success: true, message: "Item count is 0" });
    }
  } catch (error) {
    console.error("Remove from cart error:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// Get current cart data
const getCart = async (req, res) => {
  try {
    const user = await userModel.findById(req.user.id);
    const cartData = user?.cartData || {};
    res.json({ success: true, cartData });
  } catch (error) {
    console.error("Get cart error:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export { addToCart, removeFromCart, getCart };
