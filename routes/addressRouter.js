import express from "express";
import { authChecker } from "../middleware/auth.js";
import { createAddress } from "../controller/addressController.js";

const router = express.Router();

router.post("/create", authChecker, createAddress);

export default router;
