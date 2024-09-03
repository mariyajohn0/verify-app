const express = require("express");
const aadharController = require("../Controller/aadharController");
const userController = require("../Controller/userController");
const emailController = require("../Controller/emailController");
const phoneController = require("../Controller/phoneController");
const panController = require("../Controller/panController");
const gstController = require("../Controller/gstController");
const pincodeController = require("../Controller/pincodeController");
const accountController = require("../Controller/accountController");

const router = express.Router();

// Register user
router.post("/register", userController.register);

// Login
router.post("/login", userController.login);

// Verify email address
router.post("/verify-email", emailController.emailVerify);

// Verify entered OTP for email
router.post("/verify-otp", emailController.verifyOtp);

// Send OTP to phone for verification
router.post("/send-phone-otp", phoneController.sendPhoneOtp);

// Verify entered OTP for phone
router.post("/verify-phone-otp", phoneController.verifyPhoneOtp);

// Validate aadhar
router.post("/verify-aadhaar", aadharController.verifyaadhaar);

// Validate PAN
router.post("/verify-pan", panController.verifyPanCard);

// Validate GST
router.post("/verify-gst", gstController.verifyGst);

// Validate pincode
router.get("/verify-pincode", pincodeController.verifyPincode);

// Validate Bank account number
router.post("/verify-account", accountController.verifyAccount);

module.exports = router;
