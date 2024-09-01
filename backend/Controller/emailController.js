const users = require("../Models/userSchema");
const nodemailer = require("nodemailer");
const otpGenerator = require("otp-generator");

exports.emailVerify = async (req, res) => {
  const { email } = req.body;
  try {
    const existingUser = await users.findOne({ email });
    if (existingUser) {
      const otp = otpGenerator.generate(6, {
        lowerCaseAlphabets: false,
        upperCaseAlphabets: false,
        specialChars: false,
      });
      const otpExpiry = Date.now() + 4 * 60 * 1000;

      req.session.otp = otp;
      req.session.email = email;
      req.session.otpExpiry = otpExpiry;

      const auth = nodemailer.createTransport({
        service: "gmail",
        secure: true,
        port: 465,
        auth: {
          user: process.env.email_id,
          pass: process.env.pass_key,
        },
      });

      const receiver = {
        from: "mailtosreyas.s@gmail.com",
        to: email,
        subject: "OTP for Verification",
        text: `Hi,
                
                Thank you for registering. Please use the following OTP to verify your email address:
                
                OTP: ${otp}`,
      };

      auth.sendMail(receiver, (error, emailResponse) => {
        if (error) {
          console.error("Error sending email:", error);
          return res.status(500).send("Error sending email");
        }
        res.send("Email sent successfully!");
      });
    } else {
      res.status(404).send("User not found");
    }
  } catch (err) {
    res.status(500).json(err);
  }
};

exports.verifyOtp = async (req, res) => {
  const { email, otp } = req.body;

  if (!req.session.otp || !req.session.email || !req.session.otpExpiry) {
    return res.status(400).json("No OTP found. Please request a new one.");
  }

  const currentTime = Date.now();
  if (currentTime > req.session.otpExpiry) {
    req.session.otp = null;
    req.session.email = null;
    req.session.otpExpiry = null;
    return res.status(400).json("OTP has expired. Please request a new one.");
  }

  if (req.session.otp === otp && req.session.email === email) {
    try {
      console.log(
        `Attempting to update email verification for user with email: ${req.session.email}`
      );

      const updateResult = await users.findOneAndUpdate(
        { email: req.session.email }, 
        { $set: { email_verify: true } }, 
        { new: true } 
      );

      console.log("Database update result:", updateResult);

      if (updateResult) {
        res.send("OTP verified successfully!");

        req.session.otp = null;
        req.session.email = null;
        req.session.otpExpiry = null;
      } else {
        res.status(500).json("Failed to update email verification status.");
      }
    } catch (error) {
      console.error("Error updating email verification status:", error);
      res.status(500).json("Error updating email verification status.");
    }
  } else {
    res.status(400).json("Invalid OTP or email.");
  }
};
