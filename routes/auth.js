import express from "express";
import {
  forgetPassword,
  getUserProfile,
  login,
  logout,
  register,
  resetPassword,
} from "../controller/authController.js";
import { authChecker } from "../middleware/auth.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/logout",authChecker ,  logout);
router.post("/forget-password", forgetPassword);
router.post("/reset-password/:token", resetPassword);
router.get("/profile", authChecker, getUserProfile);



export default router;
