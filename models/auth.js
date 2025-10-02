import mongoose from "mongoose";

const authSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  resetPasswordExpires: { type: Date, default: null },
  resetPasswordToken: { type: String, default: null },
  role: {
    type: String,
    enum: ["user", "admin"], // only these values allowed
    default: "user", // default role if not provided
  }
});

const auth = mongoose.model("auth", authSchema);

export default auth;
