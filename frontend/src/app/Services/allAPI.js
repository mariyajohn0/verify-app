import { serverURL } from "./serverURL";
import { commonAPI } from "./commonAPI";
import axios from "axios";

// register user
export const registerAPI = async (user) => {
  return await commonAPI("post", `${serverURL}/register`, user, "");
};

// verify-email
export const verifyEmailAPI = async (email) => {
  return await commonAPI("post", `${serverURL}/verify-email`, email, "");
};

// verify-otp
export const verifyOtpAPI = async (body) => {
  return await commonAPI("post", `${serverURL}/verify-otp`, body, "");
};

// Send phone OTP
export const sendPhoneOtpAPI = async (phone) => {
  return await commonAPI("post", `${serverURL}/send-phone-otp`, phone, "");
};

// Verify phone OTP
export const verifyPhoneOtpAPI = async (body) => {
  return await commonAPI("post", `${serverURL}/verify-phone-otp`, body, "");
};

// login
export const loginAPI = async (user) => {
  return await commonAPI("post", `${serverURL}/login`, user, "");
};

export const verifyAadharAPI = async (reqBody) => {
  try {
    const response = await axios.post(`${serverURL}/verify-aadhaar`, reqBody);
    return response;
  } catch (error) {
    throw new Error("Failed to verify Aadhar");
  }
};

export const verifyPANAPI = async (reqBody) => {
  try {
    const response = await axios.post(`${serverURL}/verify-pan`, reqBody);
    return response;
  } catch (error) {
    throw new Error("Failed to verify PAN");
  }
};
