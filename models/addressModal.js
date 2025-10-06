import mongoose from "mongoose";

const addressSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "auth", // ✅ Reference to the user who owns the address
      required: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    phoneNo: {
      type: String,
      required: true,
      match: /^[6-9]\d{9}$/, // ✅ 10-digit Indian mobile number
    },
    street: {
      type: String,
      required: true,
      trim: true,
    },
    city: {
      type: String,
      required: true,
      trim: true,
    },
    state: {
      type: String,
      required: true,
      trim: true,
    },
    pincode: {
      type: String,
      required: true,
      match: /^\d{6}$/, // ✅ 6-digit Indian postal code
    },
    landmark: {
      type: String,
      trim: true,
    },
    isDefault: {
      type: Boolean,
      default: false, // ✅ Mark one address as default for checkout
    },
  },
  { timestamps: true }
);


 const Address =  mongoose.model("Address", addressSchema);

 export default Address;
