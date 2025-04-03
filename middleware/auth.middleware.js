const bcrypt = require("bcrypt");
const User = require("../models/user.model");
const apiError = require("../utils/api.error");
const jwt = require("jsonwebtoken");

// validate register user which are all ready our user to nhi

const validateRegister = async (req, res, next) => {
  try {
    const { fullName, fatherName, batch, address, email, phone, password } =
      req.body;
    // console.log("hiii file data:", req.files.photo.tempFilePath);

    // Check for missing fields
    if (
      !(
        fullName &&
        fatherName &&
        batch &&
        address &&
        email &&
        phone &&
        password
      )
    ) {
      return next(new apiError("field missing fill all field ", 400));
    }

    // Check if profile picture
    if (!req.files || !req.files.photo) {
      return next(new apiError("Profile picture is missing", 400));
    }

    // Check if user already exists
    const existingUser = await User.findOne({
      $or: [{ email: email }, { phone: phone }],
    });

    // console.log(existingUser);
    if (existingUser) {
      return next(
        new apiError(
          existingUser.email == email
            ? "Email already exists."
            : "Phone number already exists.",
          401
        )
      );
    }
    next(); // Validation pass ho gaya, toh aage badho
  } catch (error) {
    next(error);
  }
};

// validate login user account hai ya nhi ahi to password sahi hai kya

const validateLogin = async (req, res, next) => {
  try {
    const { email, phone, password } = req.body;

    // checking all required data come from frontend n
    if (!email || !phone || !password) {
      return next(new apiError("field missing fill all field ", 400));
    }

    // checking user existence of user
    const exitUser = await User.findOne({ email: email, phone: phone });

    if (!exitUser) {
      return next(
        new apiError("account not found with your phone and email", 400)
      );
    }

    // matching password of user
    console.log("req.body 222222222", exitUser);
    const verifiedPassword = await bcrypt.compare(password, exitUser.password);
    console.log("req.body 333333");
    if (!verifiedPassword) {
      return next(new apiError("password is incorrect", 401));
    }

    // ✅ Store user data in req.exitUser
    req.exitUser = exitUser;
    next();
  } catch (error) {
    next(error);
  }
};

// yeh check kre ga ki jo user login hai aur jiske pass token hai ya bina token ka data get post delete krna cha rha hoga to ushko nhi krne denge

const tokenVerified = async (req, res, next) => {
  try {
  
    if (!req.headers.authorization) {
      return next(new apiError("bsdk bina token ke aa gye ", 500));
    }
    console.log("tokenData.userId");
    const tokenData = await jwt.verify(
      req.headers.authorization.split(" ")[1],
      process.env.JWT_SECRET_KEY
    );
    
    console.log("tokenData.userId");
 
   
    const userVerification = await User.findOne({ _id: tokenData.userId });
    if (!userVerification) {
      return next(
        new apiError(
          "bsdk token kahi se chura liya to kya bina user bane data add krega aur delete update krega bagg edha se"
        )
      );
    }
    req.tokenData= tokenData ;
    next();
  } catch (error) {
    next(error);
  }
};
module.exports = { validateLogin, validateRegister, tokenVerified };
