const mongoose = require("mongoose");

const contactStructure = new mongoose.Schema(
  {
    user: { type: String, required: true },
    fullName: { type: String, trim: true, required:true },
    email: { type: String, trim: true, lowercase: true, required: true },
    phone: { type: String, trim: true, required: true },
    address: { type: String, trim: true, required: true },
    company: { type: String, trim: true, required: true },
    notes: { type: String, trim: true, required: true },
    contactImg: { type: String, required: true },
    contactImgId: { type: String, required: true }
  },
  { timestamps: true }
);

module.exports = mongoose.model("contactCollection", contactStructure);
