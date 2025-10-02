import auth from "../models/auth.js";
import response from "../utils/responsehandler.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import { sendResetPasswordLinkToEmail } from "../config/emailConfig.js";

//Register

export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return response(res, 400, "All fields are required");
    }

    const existingUser = await auth.findOne({ email });

    if (existingUser) {
      return response(res, 400, "Email is already exists");
    }
    const hashPassword = await bcrypt.hash(password, 10);
    await auth.create({
      name,
      email,
      password: hashPassword,
    });
    return response(res, 200, "Signup successfully");
  } catch (error) {
    console.error(error.message);
  }
};

// Login
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const existingUser = await auth.findOne({ email });
    if (!existingUser) {
      return response(res, 400, "Invalid email");
    }
    const matchPassword = await bcrypt.compare(password, existingUser.password);
    if (!matchPassword) {
      return response(res, 400, "Invalid password");
    }

    if (!process.env.JWT_SECRET) {
      return response(res, 404, "JWT secret token in not avaiable in .env");
    }

    const accessToken = jwt.sign(
      { userID: existingUser._id },
      process.env.JWT_SECRET,
      { expiresIn: "30d" }
    );

    return response(res, 200, "Login successfully", {
      accessToken: accessToken,
      email: existingUser,
      id: existingUser._id,
    });
  } catch (error) {
    console.error(error.message);
  }
};

// Logout

export const logout = async (req, res) => {
  try {
    return response(res, 200, "Logout successfully");
  } catch (error) {
    return response(res, 500, "Internal Server Error", error.message);
  }
};

// Forget password

export const forgetPassword = async (req, res) => {
  try {
    const { email } = req.body;

    const existingUser = await auth.findOne({ email });
    if (!existingUser) {
      return response(res, 404, "Invalid email");
    }

    const resetPasswordToken = crypto.randomBytes(20).toString("hex");
    const resetPasswordExpires = new Date(Date.now() + 360000);

    existingUser.resetPasswordToken = resetPasswordToken;
    existingUser.resetPasswordExpires = resetPasswordExpires;
    await existingUser.save();
    try {
      await sendResetPasswordLinkToEmail(email, resetPasswordToken);
      return response(res, 200, "reset pass link have sent", {
        token: resetPasswordToken,
      });
    } catch (error) {
      existingUser.resetPasswordExpires = null;
      existingUser.resetPasswordToken = null;
      await existingUser.save();
      return response(res, 400, error.message);
    }
  } catch (error) {
    return response(res, 400, error.message);
  }
};

// Reset password

export const resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { newpassword, confirmpassword } = req.body;

    if (newpassword !== confirmpassword) {
      return response(res, 400, "Password does not match");
    }

    const existingUser = await auth.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!existingUser) {
      return response(res, 400, "Invalid or reset link has expired");
    }

    const hashPassword = await bcrypt.hash(newpassword, 10);

    existingUser.password = hashPassword;

    existingUser.resetPasswordExpires = undefined;
    existingUser.resetPasswordToken = undefined;

    await existingUser.save();
    return response(res, 200, "password changed successfully", {
      newpassword: newpassword,
    });
  } catch (error) {
    return response(res, 400, error.message);
  }
};

export const getUserProfile = async (req, res) => {
  const userID = req.user;
  try {
    if (!userID) {
      return response(res, 404, "User not found");
    }
    const user = await auth.findById({_id : userID}).select("-password");
    if (!user) {
      return response(res, 404, "user not found");
    }
    return response(res, 200, "Profile data fetch successfully", {
      user: user,
    });
  } catch (error) {
    response(res, 400, error.message);
  }
};
