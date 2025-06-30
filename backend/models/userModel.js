import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },

  cartData: { type: Object, default: {} },   // { foodId: quantity }
  address: {
    firstName: String,
    lastName: String,
    phone: String,
    street: String,
    city: String,
    state: String,
    postalCode: String,
    coordinates: {
      lat: Number,
      lng: Number,
    }
  },
  
 
  
}, { minimize: false });

const userModel = mongoose.models.user || mongoose.model("user", userSchema);
export default userModel;
