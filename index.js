import express from "express";
import authRouter from "./routes/auth.js";
import dotenv from "dotenv";
import { connectDB } from "./config/dbConnect.js";
import productRouter from "./routes/productRouter.js";
import carRouter from "./routes/cartRouter.js";
import addressRouter from "./routes/addressRouter.js";
import cors from "cors";
import bodyParser from "body-parser";

dotenv.config({ debug: true });

const app = express();

// ✅ Increase payload limit for large Base64 images
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));
app.use(bodyParser.json({ limit: "10mb" }));
app.use(bodyParser.urlencoded({ limit: "10mb", extended: true }));

// ✅ Enable CORS properly
app.use(
  cors({
    origin: "*", // or ["http://localhost:3000"]
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// ✅ Routes
app.use("/api/auth", authRouter);
app.use("/api/product", productRouter);
app.use("/api/cart", carRouter);
app.use("/api/address", addressRouter);

const PORT = process.env.PORT || 8000;

const startServer = async () => {
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log(`✅ Server running: http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("❌ Failed to connect MongoDB:", error);
    process.exit(1);
  }
};

startServer();
