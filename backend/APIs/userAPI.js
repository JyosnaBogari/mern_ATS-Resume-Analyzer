import exp from "express";
import jwt from "jsonwebtoken";
import { authenticate, register } from "../Services/authService.js";
import { UserTypeModel } from "../models/UserTypeModel.js";
import bcrypt from "bcryptjs";
import { uploadImage } from "../config/multer.js"; // 👈 separate multer
import cloudinary from "../config/cloudinary.js";
import { uploadToCloudinary } from "../config/CloudinaryUpload.js";

export const userRoute = exp.Router();

//  Register user
userRoute.post(
  "/users",
  uploadImage.single("profileImage"),
  async (req, res, next) => {
    let cloudinaryResult;

    try {
      let userObj = req.body;

      // upload image
      if (req.file) {
        cloudinaryResult = await uploadToCloudinary(req.file.buffer);
      }

      const newUserObj = await register({
        ...userObj,
        role: "USER",
        profileImageUrl: cloudinaryResult?.secure_url,
      });

      res.status(201).json({
        message: "user created",
        payload: newUserObj,
      });
    } catch (err) {
      // rollback
      if (cloudinaryResult?.public_id) {
        await cloudinary.uploader.destroy(cloudinaryResult.public_id);
      }
      next(err);
    }
  }
);

//  Login
userRoute.post("/authenticate", async (req, res) => {
  let userCred = req.body;

  let { token, user } = await authenticate(userCred);

  res.cookie("token", token, {
    httpOnly: true,
    sameSite: "lax",
    secure: false,
  });

  res.status(200).json({
    message: "user authenticated successfully",
    payload: user,
  });
});

//  Logout
userRoute.get("/logout", (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: false,
    sameSite: "lax",
  });

  res.status(200).json({ message: "logged out successfully" });
});

//  Change password
userRoute.put("/change-password", async (req, res) => {
  let { email, password, newpassword } = req.body;

  let user = await UserTypeModel.findOne({ email });
  if (!user) {
    return res.status(401).json({ message: "user email not found" });
  }

  let isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return res.status(401).json({ message: "password not matched" });
  }

  const hashed = await bcrypt.hash(newpassword, 10);

  let updatedUser = await UserTypeModel.findByIdAndUpdate(
    user._id,
    { password: hashed },
    { new: true }
  );

  res.status(200).json({
    message: "password updated successfully",
    payload: updatedUser,
  });
});

//  Refresh token
userRoute.post("/refresh", async (req, res) => {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }

  try {
    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    const user = await UserTypeModel.findById(decoded.userId);

    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    const newToken = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.SECRET_KEY,
      { expiresIn: "1h" }
    );

    res.cookie("token", newToken, {
      httpOnly: true,
      sameSite: "lax",
      secure: false,
    });

    const userObj = user.toObject();
    delete userObj.password;

    res.status(200).json({
      message: "Token refreshed",
      payload: userObj,
    });
  } catch (err) {
    res.status(403).json({ message: "Invalid token" });
  }
});