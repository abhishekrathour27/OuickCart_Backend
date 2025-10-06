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
    if (existAddress.length === 0) {
      newAddress.isDefault = true;
      await newAddress.save();
    }
    return response(res, 200, "Address created successfully", newAddress);
  } catch (error) {
    return response(res, 500, error.message);
  }
};
