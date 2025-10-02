import mongoose from "mongoose";

const cartSchema = new mongoose.Schema({
  items: [
    {
      productId: {
        type: mongoose.Schema.Types.ObjectId, // Product ka id
        ref: "Product", // Product collection ko refer karega
      },
      quantity: {
        type: Number,
        default: 1,
      },
    },
  ],
  userId: {
    type: mongoose.Schema.Types.ObjectId, // User ka id
    ref: "auth", // User collection ko refer karega
  },
});

const cart = mongoose.model("cart", cartSchema);

export default cart;
