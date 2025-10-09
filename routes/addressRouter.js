import express from "express";
import { authChecker } from "../middleware/auth.js";
import { createAddress, getAddress, removeAddress, updateAddress } from "../controller/addressController.js";

const router = express.Router();

router.post("/create", authChecker, createAddress);
router.delete("/delete", authChecker,removeAddress);
router.get("/get",authChecker , getAddress)
router.put('/update',authChecker , updateAddress)

export default router;
