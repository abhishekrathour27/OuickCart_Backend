import express from "express";
import { authChecker } from "../middleware/auth.js";
import { createAddress, removeAddress } from "../controller/addressController.js";

const router = express.Router();

router.post("/create", authChecker, createAddress);
router.delete("/delete", authChecker,removeAddress);

export default router;
