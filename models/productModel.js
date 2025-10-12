import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  userId: {
    type: String, // agar auth ka reference chahiye to mongoose.Schema.Types.ObjectId bhi kar sakte ho
  },
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  offerPrice: {
    type: Number,
    default: null,
  },
  images: [
    {
      type: String,
      required: true,
    },
  ],
  category: {
    type: String,
    required: true,
  },
  date: {
    type: Number, // tumhare data me timestamp aa raha hai
    default: Date.now,
  },
  wishlistProduct: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "auth",
    },
  ],
});

const Product = mongoose.model("Product", productSchema);

export default Product;
