import express from "express";
import {
  forgetPassword,
  getUserProfile,
  login,
  logout,
  register,
  resetPassword,
  updateProfile,
} from "../controller/authController.js";
import { authChecker } from "../middleware/auth.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/logout", authChecker, logout);
router.post("/forget-password", forgetPassword);
router.post("/reset-password/:token", resetPassword);
router.get("/profile", authChecker, getUserProfile);
router.put("/update", authChecker, updateProfile);

export default router;
