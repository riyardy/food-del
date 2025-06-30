import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user", 
    required: true,
  },
  items: [
    {
      foodId: { type: mongoose.Schema.Types.ObjectId, ref: "food" },
      name: String,
      image: String,
      price: Number,
      quantity: Number,
      total: Number,
    }
  ],
  amount: {
    type: Number,
    required: true,
  },
  address: {
    type: Object,
    required: true,
  },
  status: {
    type: String,
    default: "Food Processing",
  },
  date: {
    type: Date,
    default: Date.now,
  },
  payment: {
    type: Boolean,
    default: false,
  },
});

const orderModel = mongoose.models.orders || mongoose.model("orders", orderSchema);
export default orderModel;
