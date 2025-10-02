import express from "express";
import {
  addToCart,
  decreaseFromCart,
  getCartData,
  removeFromCart,
} from "../controller/cartController.js";
import { authChecker } from "../middleware/auth.js";

const router = express.Router();

router.post("/addtocart", authChecker, addToCart);
router.get("/get", authChecker, getCartData);
router.delete("/remove", authChecker, removeFromCart);
router.post("/decrease", authChecker, decreaseFromCart);

export default router;
