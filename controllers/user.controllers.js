const User = require("../models/user.model");
const Contact = require("../models/contact.model");
const apiError = require("../utils/api.error");
const ApiResponse = require("../utils/api.response");
const bcrypt = require("bcrypt");
const cloudinary = require("cloudinary").v2;
require("dotenv").config({ path: "./config/config.env" });
const jwt = require("jsonwebtoken");
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_SECRET_KEY,
});

// register controller start here

const registerUser = async (req, res, next) => {
  try {
    const { fullName, fatherName, batch, address, email, phone, password } =
      req.body;

    // Upload profile picture to Cloudinary
    const afterFileUploadData = await cloudinary.uploader.upload(
      req.files.photo.tempFilePath
    );

    // Hash password
    const hashPassword = await bcrypt.hash(password, 10);

    // console.log(hashPassword);

    // Save new user data
    const newDataForSave = new User({
      fullName: fullName,
      fatherName: fatherName,
      batch: batch,
      address: address,
      email: email,
      phone: phone,
      password: hashPassword,
      profilePicUrl: afterFileUploadData.secure_url,
      profilePicId: afterFileUploadData.public_id,
    });

    const finalSaveData = await newDataForSave.save();

    res
      .status(201)
      .json(new ApiResponse(201, finalSaveData, "user successful register"));
  } catch (error) {
    next(error);
  }
};
// register controller end here

// login controller start here

const loginUser = async (req, res, next) => {
  console.log(req.exitUser);
  const {
    fullName,
    _id,
    fatherName,
    batch,
    address,
    email,
    phone,
    profilePicUrl,
    profilePicId,
  } = req.exitUser;
  const token = await jwt.sign(
    {
      fullName: fullName,
      userId: _id,
      fatherName: fatherName,
      batch: batch,
      address: address,
      email: email,
      phone: phone,
      profilePicUrl: profilePicUrl,
      profilePicId: profilePicId,
    },
    process.env.JWT_SECRET_KEY,
    { expiresIn: "1d" }
  );

  const userLoginData = {
    fullName: fullName,
    userId: _id,
    fatherName: fatherName,
    batch: batch,
    address: address,
    email: email,
    phone: phone,
    profilePicUrl: profilePicUrl,
    profilePicId: profilePicId,
    token: token,
  };
  res
    .status(201)
    .json(new ApiResponse(201, userLoginData, "user logged in successfully"));
};

// login controller end here



module.exports = { registerUser, loginUser };
