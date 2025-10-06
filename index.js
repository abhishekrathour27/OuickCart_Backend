import express from "express";
import authRouter from "./routes/auth.js";
import dotenv from "dotenv";
import { connectDB } from "./config/dbConnect.js";
import productRouter from "./routes/productRouter.js";
import carRouter from "./routes/cartRouter.js";
import addressRouter from "./routes/addressRouter.js";
dotenv.config({ debug: true }); // Enable debug logging for dotenv
import cors from "cors";

const app = express();
app.use(express.json());

app.use(cors("*"));

app.use("/api/auth", authRouter);

app.use("/api/product", productRouter);

app.use("/api/cart", carRouter);

app.use("/api/address", addressRouter);

const PORT = process.env.PORT || 8000;

const startServer = async () => {
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log(`server is running on the port  http://localhost:${PORT}`);
    });
  } catch (error) {
    console.log("failed to connect your mongodb");
    process.exit(1);
  }
};
startServer();
