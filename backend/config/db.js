import mongoose from "mongoose";

export const connectDB = () => {
  mongoose
    .connect(process.env.MONGO_URL)
    .then(() => {
      console.log(" MongoDB connected successfully");
    })
    .catch((error) => {
      console.error(" MongoDB connection failed:", error.message);
      process.exit(1); 
    });
};
