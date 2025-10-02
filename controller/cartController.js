import cart from "../models/cartModel.js";
import response from "../utils/responsehandler.js";

export const addToCart = async (req, res) => {
  try {
    const { productId } = req.body;
    const userId = req.user;

    // console.log('idu',userId)

    let userCart = await cart.findOne({ userId });
    console.log("cart", userCart);

    if (!userCart) {
      userCart = await cart.create({
        userId,
        items: [{ productId, quantity: 1 }],
      });
    } else {
      const cartIndex = userCart.items.findIndex(
        (item) => item.productId.toString() === productId
      );

      if (cartIndex > -1) {
        userCart.items[cartIndex].quantity += 1;
      } else {
        userCart.items.push({ productId, quantity: 1 });
      }
    }

    await userCart.save();

    return response(res, 200, "successfully added to cart", userCart);
  } catch (error) {
    return response(res, 500, error.message);
  }
};

export const getCartData = async (req, res) => {
  try {
    const userId = req.user;
    const cartData = await cart.findOne({ userId }).populate("items.productId");

    console.log("cartData", cartData);

    // cartData.save();
    return response(res, 200, "successfully get cart data", cartData);
  } catch (error) {
    return response(res, 500, error.message);
  }
};

export const decreaseFromCart = async (req, res) => {
  try {
    const userId = req.user;
    const { productId } = req.body;

    const cartData = await cart.findOne({ userId });
    if (!cartData) return response(res, 404, "Cart not found");

    const cartIndex = cartData.items.findIndex(
      (item) => item.productId.toString() === productId.toString()
    );

    if (cartIndex > -1) {
      cartData.items[cartIndex].quantity -= 1;
    }

    await cartData.save();

    return response(res, 200, "item decrease by one");
  } catch (error) {
    response(res, 500, error.message);
  }
};

import mongoose from "mongoose";

export const removeFromCart = async (req, res) => {
  try {
    const userId = req.user;
    const { productId } = req.body;

    if (!productId) {
      return response(res, 400, "ProductId is required");
    }

    // string -> ObjectId convert
    const id = new mongoose.Types.ObjectId(productId);

    const userCart = await cart
      .findOneAndUpdate(
        { userId },
        { $pull: { items: { productId: id } } }, // ✅ ObjectId check
        { new: true }
      )
      .populate("items.productId"); // ✅ populate kar do

    if (!userCart) {
      return response(res, 404, "Cart data is empty");
    }

    return response(res, 200, "Item removed from cart", userCart);
  } catch (error) {
    return response(res, 500, error.message);
  }
};
