const users = require("../Models/userSchema");
const nodemailer = require("nodemailer");
const otpGenerator = require("otp-generator");

exports.register = async (req, res) => {
  const { name, email, phone, aadhar, dob, password } = req.body;
  try {
    const existingUser = await users.findOne({ email });
    if (existingUser) {
      res.status(406).json("User already exsists");
    } else {
      const newUser = new users({
        name,
        email,
        phone,
        aadhar,
        dob,
        password,
      });
      await newUser.save();
      res.status(200).json(newUser);
    }
  } catch (err) {
    res.status(500).json(err);
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await users.findOne({ email });
    if (!user) {
      return res.status(404).json("User not found");
    }

    if (password !== user.password) {
      return res.status(400).json("Invalid credentials");
    }

    // Store user details in session
    req.session.user = {
      _id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      aadhar: user.aadhar,
      email_verify: user.email_verify,
      phone_verify: user.phone_verify,
      aadhar_verify: user.aadhar_verify,
    };

    res.status(200).json({ user: req.session.user });
  } catch (err) {
    res.status(500).json("Server error");
  }
};
