import Address from "../models/addressModal.js";
import auth from "../models/auth.js";
import response from "../utils/responsehandler.js";

export const createAddress = async (req, res) => {
  try {
    const { name, phoneNo, street, city, state, pincode, landmark } = req.body;
    const userId = req.user;

    if (
      !name &&
      !phoneNo &&
      !street &&
      !city &&
      !state &&
      !pincode &&
      !landmark
    ) {
      response(res, 404, "All feild are required");
    }

    const existUser = await auth.findById(userId);

    if (!existUser) {
      return response(res, 404, "User not found");
    }

    const newAddress = await Address.create({
      userId,
      name,
      phoneNo,
      street,
      city,
      state,
      pincode,
      landmark,
    });

    const existAddress = await Address.find({ userId });
    console.log(existAddress);
    if (existAddress.length === 1) {
      newAddress.isDefault = true;
      await newAddress.save();
    }
    // console.log("object", newAddress.isDefault);
    return response(res, 200, "Address created successfully", newAddress);
  } catch (error) {
    return response(res, 500, error.message);
  }
};

export const getAddress = async (req, res) => {
  try {
    const userId = req.user;

    const existAddress = await Address.find({ userId });
    if (!existAddress) {
      return response(res, 404, "user with this Id not found");
    }
    console.log("addddd", existAddress);
    return response(res, 200, "address get successfully", existAddress);
  } catch (error) {
    return response(res, 500, error.message);
  }
};

export const removeAddress = async (req, res) => {
  try {
    const { id } = req.body;
    const userId = req.user;

    const deleteAddress = await Address.findOneAndDelete({ _id: id, userId });
    if (!deleteAddress) {
      return response(res, 404, "Address not found");
    }

    return response(res, 201, "Address deleted ", deleteAddress);
  } catch (error) {
    response(error.message);
  }
};

export const updateAddress = async (req, res) => {
  try {
    const userId = req.user;
    const { id, ...updateData } = req.body;

    if (!id) {
      response(res, 404, "Address id is required");
    }

    const updated = await Address.findOneAndUpdate(
      { _id: id, userId: userId }, // yahan object valid hai
      updateData,
      { new: true, runValidators: true }
    );

    return response(res, 200, "Address is updated", updated);
  } catch (error) {
    response(res, 500, error.message);
  }
};
