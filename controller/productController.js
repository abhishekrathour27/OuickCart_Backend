import response from "../utils/responsehandler.js";
import Product from "../models/productModel.js";
import cloudinary from "../config/cloudinary.js";

export const createProduct = async (req, res) => {
  try {
    const { name, price, offerPrice, category, description, images } = req.body;

    // 🔹 Validation
    if (!name || !price || !category || !description) {
      return response(res, 400, "All fields are required");
    }

    // 🔹 Cloudinary Upload (Base64 se)
    let uploadedImages = [];
    if (images && Array.isArray(images) && images.length > 0) {
      const uploadPromises = images.map(async (base64Image) => {
        const result = await cloudinary.uploader.upload(base64Image, {
          folder: "productImage",
        });
        return result.secure_url;
      });

      uploadedImages = await Promise.all(uploadPromises);
    }

    // 🔹 Save product
    const newProduct = await Product.create({
      name,
      price,
      offerPrice,
      category,
      description,
      images: uploadedImages, // array of URLs
    });

    return response(res, 201, "Product created successfully", newProduct);
  } catch (error) {
    console.error(error);
    return response(res, 500, error.message);
  }
};

export const getProduct = async (req, res) => {
  try {
    const existProduct = await Product.find();
    // console.log(existProduct);
    return response(res, 201, "product get successfully", existProduct);
  } catch (error) {
    response(res, 500, error.message);
  }
};

export const getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    const productById = await Product.findById(id);

    // console.log("pro",productById)
    if (!productById) {
      return response(res, 404, "Product with this Id not found");
    }
    return response(
      res,
      201,
      "product with this Id get successfully",
      productById
    );
  } catch (error) {
    response(res, 500, error.message);
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    // console.log("Deleting product with ID:", id);

    const deletedProduct = await Product.findByIdAndDelete(id);

    if (!deletedProduct) {
      return response(res, 404, "Product not found");
    }

    return response(res, 200, "Product deleted successfully", deletedProduct);
  } catch (error) {
    return response(res, 500, error.message);
  }
};

export const addToWishlistProduct = async (req, res) => {
  try {
    const userID = req.user;

    const { productId } = req.body;
    // console.log("id", userID);

    const productData = await Product.findById(productId);
    // console.log("pId", productData);

    if (productData.wishlistProduct.includes(userID)) {
      return response(res, 200, "Product is already in wishlist");
    }

    console.log("data", productData);
    productData.wishlistProduct.push(userID);
    productData.save();

    return response(res, 201, "Successfully added to wishlist");
  } catch (error) {
    return response(res, 500, error.message);
  }
};

export const getWishlistProduct = async (req, res) => {
  try {
    const userID = req.user;

    const wishlistProduct = await Product.find({
      wishlistProduct: userID,
    });
    // .populate("wishlistProduct");

    // console.log("wish",wishlistProduct);

    return response(
      res,
      201,
      "wishlist product get successfully",
      wishlistProduct
    );
  } catch (error) {
    return response(res, 500, error.message);
  }
};

export const removeFromWishlist = async (req, res) => {
  try {
    const userID = req.user;
    const { productId } = req.body;
    console.log("object", userID);

    const productData = await Product.findById(productId);
    if (!productData) {
      response(res, 404, "product with this Id not found");
    }

    console.log(productData.wishlistProduct);

    if (!productData.wishlistProduct.includes(userID)) {
      response(res, 404, "Product is not in wishlist");
    }

    productData.wishlistProduct = productData.wishlistProduct?.filter(
      (id) => id.toString() !== userID.toString()
    );
    await productData.save();
    return response(res, 201, "Successfullyremove from wishlist ");
  } catch (error) {
    response(res, 500, error.message);
  }
};

// Bulk Upload Products
export const bulkUploadProducts = async (req, res) => {
  try {
    const products = req.body.products; // products array frontend se aayega

    if (!products || !Array.isArray(products) || products.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Products array is required and should not be empty",
      });
    }

    // MongoDB me insertMany use hota hai ek sath multiple docs insert karne ke liye
    const newProducts = await Product.insertMany(products);

    return res.status(201).json({
      success: true,
      message: "Products uploaded successfully",
      data: newProducts,
    });
  } catch (error) {
    console.error("Bulk upload error:", error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong while uploading products",
      error: error.message,
    });
  }
};
