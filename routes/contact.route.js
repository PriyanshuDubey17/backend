const express = require("express");
const router = express.Router();
const { tokenVerified } = require("../middleware/auth.middleware");
const {
  addContact,
  getContact,
  updateContact,
  deleteUserAndPic
} = require("../controllers/contact.controllers");

router.post("/add-contact", tokenVerified, addContact);

router.get("/all-contact", tokenVerified, getContact);
router.put("/update-contact/:contactId", tokenVerified, updateContact);
router.delete("/delete-contact", tokenVerified, deleteUserAndPic);
module.exports = router;
