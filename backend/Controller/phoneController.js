const users = require("../Models/userSchema");
const otpGenerator = require("otp-generator");
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = require("twilio")(accountSid, authToken);

// Adding country code to the phone number
const validateAndFormatPhoneNumber = (phoneNumber) => {
  return `+91${phoneNumber}`;
};

exports.sendPhoneOtp = async (req, res) => {
  let { phoneNumber } = req.body; // Extract phone number from the request body
  const formattedPhone = validateAndFormatPhoneNumber(phoneNumber);

  // Check if the formatted phone number is valid
  if (!formattedPhone) {
    return res.status(400).json({ error: "Invalid phone number format." });
  }

  console.log("Received phoneNumber:", phoneNumber);
  console.log("Formatted phone:", formattedPhone);

  // Generating 6-digit OTP
  const phoneOtp = otpGenerator.generate(6, {
    lowerCaseAlphabets: false,
    upperCaseAlphabets: false,
    specialChars: false,
  });

  const otpExpiry = Date.now() + 4 * 60 * 1000; // OTP expiry time set to 4 minutes

  // Remove the old OTP from the session
  if (req.session.phoneOtp) {
    delete req.session.phoneOtp;
  }

  // Store OTP, formatted phone number, and expiry time in the session
  req.session.phoneOtp = phoneOtp;
  req.session.phone = formattedPhone;
  req.session.otpExpiry = otpExpiry;

  console.log(req.session.phoneOtp);
  console.log(req.session.phone);

  try {
    // Sending OTP using Twilio's messaging service
    await client.messages.create({
      body: `Your OTP for phone verification is ${phoneOtp}`,
      messagingServiceSid: "MG350f0c12abebf770804b6bd956f6c16d",
      to: formattedPhone,
    });

    res.json({ message: "OTP sent successfully!" });
  } catch (twilioError) {
    console.error("Twilio Error:", twilioError);
    res.status(500).json({ error: "Failed to send OTP via Twilio." });
  }
};

// Function to remove country code from the phone number
const removeCountryCode = (phoneNumber) => {
  return phoneNumber.replace(/^\+91/, "");
};

exports.verifyPhoneOtp = async (req, res) => {
  const { phone, otp } = req.body;

  // Format the phone number for comparison
  const formattedPhone = removeCountryCode(validateAndFormatPhoneNumber(phone));

  console.log("Body Phone:", formattedPhone); // Log the phone number from the request
  console.log("Body OTP:", otp); // Log the OTP from the request
  console.log("Session Phone:", removeCountryCode(req.session.phone)); // Log the phone number from the session
  console.log("Session OTP:", req.session.phoneOtp); // Log the OTP from the session

  // Check if OTP, phone number, or expiry time are not stored in the session
  if (!req.session.phoneOtp || !req.session.phone || !req.session.otpExpiry) {
    return res.status(400).json("No OTP found. Please request a new one.");
  }

  const currentTime = Date.now();
  // Check if the OTP has expired
  if (currentTime > req.session.otpExpiry) {
    req.session.phoneOtp = null;
    req.session.phone = null;
    req.session.otpExpiry = null;
    return res.status(400).json("OTP has expired. Please request a new one.");
  }

  // Verify if the provided OTP matches the session OTP and phone number matches
  if (
    req.session.phoneOtp === otp &&
    removeCountryCode(req.session.phone) === formattedPhone
  ) {
    try {
      console.log(req.session.phone);
      const updateResult = await users.findOneAndUpdate(
        { phone: formattedPhone },
        { $set: { phone_verify: true } },
        { new: true }
      );

      if (updateResult) {
        req.session.phoneOtp = null;
        req.session.phone = null;
        req.session.otpExpiry = null;
        res.send("Phone verified successfully!");
      } else {
        res.status(500).json("Failed to update phone verification status.");
      }
    } catch (error) {
      console.error("Error updating phone verification status:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  } else {
    res.status(400).json("Invalid OTP or phone number.");
  }
};
