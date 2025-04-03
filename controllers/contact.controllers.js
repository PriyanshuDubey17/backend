const Contact = require("../models/contact.model");
const { find } = require("../models/user.model");
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

// add-contact controller start here

const addContact = async (req, res, next) => {
  console.log("hi iam here ", req.tokenData);
  const { fullName, email, phone, address, company, notes } = req.body;
  // validation if any contact field missing we not accept we give you error

  if (!fullName || !email || !phone || !address || !company || !notes) {
    return next(new apiError("contact field missing hai bro", 500));
  }
  if (!req.files || !req.files.photo) {
    return next(new apiError("Contact picture is missing", 400));
  }
  const uploadImage = await cloudinary.uploader.upload(
    req.files.photo.tempFilePath
  );

  const newContact = new Contact({
    user: req.tokenData.userId,
    fullName: fullName,
    email: email,
    phone: phone,
    address: address,
    company: company,
    notes: notes,
    contactImg: uploadImage.secure_url,
    contactImgId: uploadImage.public_id,
  });

  const saveContactData = await newContact.save();

  res
    .status(201)
    .json(new ApiResponse(201, saveContactData, "contact add successfully"));
};

// add-contact controller end here

// get -contact controller start here
const getContact = async (req, res, next) => {
  try {
    const userData = await Contact.find({ user: req.tokenData.userId });
    if (userData.length == 0) {
      return next(new apiError("empty contact "), 500);
    }

    res.status(200).json(new ApiResponse(200, userData, "here is all data lo"));
  } catch (error) {
    next(error);
  }
};

// get -contact controller end here

const updateContact = async (req, res, next) => {
  try {
    const { fullName, email, phone, address, company, notes } = req.body;
    if (req.files) {
      const findAndDeleteImg = await Contact.findOne({
        _id: req.params.contactId,
        user: req.tokenData.userId,
      });
      if (!findAndDeleteImg) {
        return next(new apiError("this id data not present"));
      }

      await cloudinary.uploader.destroy(findAndDeleteImg.contactImgId);

      const uploadPic = await cloudinary.uploader.upload(
        req.files.photo.tempFilePath
      );
      const updateData = await Contact.findOneAndUpdate(
        { _id: req.params.contactId, user: req.tokenData.userId },
        {
          fullName: fullName,
          email: email,
          phone: phone,
          address: address,
          company: company,
          notes: notes,
          contactImg: uploadPic.secure_url,
          contactId: uploadPic.public_id,
        },
        { new: true }
      );

      res
        .status(200)
        .json(new ApiResponse(200, updateData, "data updated successfully"));
    } else {
      const updateData = await Contact.findOneAndUpdate(
        { _id: req.params.contactId, user: req.tokenData.userId },
        {
          fullName: fullName,
          email: email,
          phone: phone,
          address: address,
          company: company,
          notes: notes,
        },
        { new: true }
      );
      if (!updateData) {
        return next(new apiError("this id data not present"));
      }
      res
        .status(200)
        .json(new ApiResponse(200, updateData, "data updated successfully"));
    }
  } catch (error) {
    next(error);
  }
};

const deleteUserAndPic = async (req, res, next) => {
  try {
    const findData = await Contact.find({ user: req.tokenData.userId });
    if (findData.length == 0) {
      return next(new apiError("there is not data available to delete"));
    }
    for (const obj of findData) {
      if (obj.contactImgId) {
        await cloudinary.uploader.destroy(obj.contactImgId);
      }
    }

    const dataFormDb = await Contact.deleteMany({ user: req.tokenData.userId });

    res.status(200).json(new ApiResponse(200, dataFormDb, "data delete"));
  } catch (error) {
    next(error);
  }
};

module.exports = { addContact, getContact, updateContact, deleteUserAndPic };
