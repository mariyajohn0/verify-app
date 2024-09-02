const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  email_verify: {
    type: Boolean,
    required: false,
    default: false,
  },
  phone: {
    type: String,
    required: true,
  },
  phone_verify: {
    type: Boolean,
    required: false,
    default: false,
  },
  aadhar: {
    type: String,
    required: true,
  },
  aadhar_verify: {
    type: Boolean,
    required: false,
    default: false,
  },
  dob: {
    type: Date,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  pan: {
    type: String,
    required: false,
    default: "",
  },
  pan_verify: {
    type: Boolean,
    default: false,
    required: false,
  },
  gst: {
    type: String,
    required: false,
    default: "",
  },
  gst_verify: {
    type: Boolean,
    default: false,
    required: false,
  },
  pincode: {
    type: String,
    required: false,
    default: "",
  },
  pincode_verify: {
    type: Boolean,
    default: false,
    required: false,
  },
  accountNumber: {
    type: String,
    required: false,
    default: "",
  },
  ifsc: {
    type: String,
    required: false,
    default: "",
  },
  account_verify: {
    type: Boolean,
    default: false,
    required: false,
  },
});

const users = mongoose.model("users", userSchema);
module.exports = users;
