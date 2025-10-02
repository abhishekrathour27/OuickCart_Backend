import express from "express";
import {
  addToWishlistProduct,
  bulkUploadProducts,
  createProduct,
  deleteProduct,
  getProduct,
  getProductById,
  getWishlistProduct,
  removeFromWishlist,
} from "../controller/productController.js";
import { authChecker } from "../middleware/auth.js";

const router = express.Router();

router.post("/create", createProduct);
router.get("/get", getProduct);
router.delete("/delete/:id", deleteProduct);
router.get("/get/:id", getProductById);
router.post("/addToWishlist", authChecker, addToWishlistProduct);
router.delete("/removeFromWishlist", authChecker, removeFromWishlist);
router.get("/getWishlistProduct", authChecker, getWishlistProduct);
router.post("/bulkupload", bulkUploadProducts)

export default router;
