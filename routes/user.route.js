const express = require("express");
const router = express.Router();
const { registerUser, loginUser } = require("../controllers/user.controllers");
const {
  validateLogin,
  validateRegister,
} = require("../middleware/auth.middleware");

router.post("/signup", validateRegister, registerUser);
router.post("/login", validateLogin, loginUser);


module.exports = router;
