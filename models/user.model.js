const mongoose = require("mongoose");

const userStructure = new mongoose.Schema(
  {
    fullName: {
      type: String,
      unique: true,
      trim: true,
      required: true,
    },
    fatherName: {
      type: String,
      unique: true,
      trim: true,
      required: true,
    },
    batch: {
      type: String,
      trim: true,
      required: true,
    },
    address: {
      type: String,
      trim: true,
      required: true,
    },
    email: {
      type: String,
      unique: true,
      lowercase: true,
      trim: true,
      required: true,
    },
    phone: {
      type: Number,
      unique: true,
      minlength: 10,
      maxlength: 10,
      trim: true,
      required: true,
    },

    password: {
      type: String,
      minlength: 6,
      trim: true,
      required: true
     
    },

    profilePicUrl: {
      type: String,
      required: true,
    },
    profilePicId: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("userCollection", userStructure);
