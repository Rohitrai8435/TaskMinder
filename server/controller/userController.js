import { catchAsyncErrors } from "../middlewares/catchAsyncErrors.js";
import ErrorHandler from "../middlewares/error.js";
import { User } from "../models/userSchema.js";
import cloudinary from "cloudinary";
import { sendToken } from "../utils/jwtToken.js";

export const register = catchAsyncErrors(async (req, res, next) => {
  // if (!req.files || Object.keys(req.files).length === 0) {
  //   return next(new ErrorHandler("User Avatar Required!", 400));
  // }
  // const { avatar } = req.files;
  // const allowedFormats = [
  //   "image/png",
  //   "image/jpeg",
  //   "image/webp",
  //   "image/avif",
  // ];
  // if (!allowedFormats.includes(avatar.mimetype)) {
  //   return next(
  //     new ErrorHandler(
  //       "Please provide avatar in png,jpg,webp or avif format!",
  //       400
  //     )
  //   );
  // }
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    return next(new ErrorHandler("Please fill full form!", 400));
  }
  let user = await User.findOne({ email });
  if (user) {
    return next(new ErrorHandler("User already exists!", 400));
  }
  // const cloudinaryResponse = await cloudinary.uploader.upload(
  //   avatar.tempFilePath
  // );
  // if (!cloudinaryResponse || cloudinary.error) {
  //   console.error(
  //     "Cloudinary Error:",
  //     cloudinaryResponse.error || "Unknown cloudinary error!"
  //   );
  // }
  user = await User.create({
    name,
    email,
    password,
  });
  sendToken("User Registered!", user, res, 200);
});

export const login = catchAsyncErrors(async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return next(new ErrorHandler("Please provide email and password!", 400));
  }
  const user = await User.findOne({ email }).select("+password");

  if (!user) {
    return next(new ErrorHandler("Invalid email  or password!", 400));
  }
  const isPasswordMatched = await user.comparePassword(password);
  if (!isPasswordMatched) {
    return next(new ErrorHandler("Invalid email  or password!", 400));
  }
  sendToken("User Logged In!", user, res, 200);
});
export const alluser = catchAsyncErrors(async (req, res, next) => {
  const users = await User.find().select("-password");
  if (!users) {
    return next(new ErrorHandler("user not present!", 400));
  }
  return res
    .status(200)
    .json({ success: true, message: "alluser fetch", users });
});
export const singleuser = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    return next(new ErrorHandler("user not present!", 400));
  }
  return res
    .status(200)
    .json({ success: true, message: "user feteched", user });
});
export const deleteuser = catchAsyncErrors(async (req, res, next) => {
  const users = await User.findByIdAndDelete(req.params.id);
  if (!users) {
    return next(new ErrorHandler("user not present!", 400));
  }
  return res.status(200).json({ success: true, message: "user Deleted" });
});

export const logout = catchAsyncErrors((req, res, next) => {
  res
    .status(200)
    .cookie("token", "", {
      expires: new Date(Date.now()),
      httpOnly: true,
    })
    .json({
      success: true,
      message: "User Logged Out!",
    });
});
export const myProfile = catchAsyncErrors((req, res, next) => {
  const user = req.user;
  res.status(200).json({
    success: true,
    user,
  });
});
