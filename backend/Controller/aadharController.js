const axios = require("axios");
const users = require("../Models/userSchema");

// Function to verify Aadhaar number
exports.verifyaadhaar = async (req, res) => {
  const { aadhar } = req.body;

  // Request options for Aadhaar API
  const options = {
    method: "POST",
    url: process.env.AADHAAR_API,
    headers: {
      "apy-token": process.env.AADHAAR_API_TOKEN,
      "Content-Type": "application/json",
    },
    data: { aadhaar: aadhar },
  };

  try {
    // Send request to Aadhaar API and await response
    const response = await axios.request(options);

    if (response.data.data) {
      // If valid, find the user by Aadhar number and update their verification status
      const user = await users.findOneAndUpdate(
        { aadhar: aadhar },
        { $set: { aadhar_verify: true } },
        { new: true }
      );
      if (!user) {
        return res.status(404).json({ message: "User Not Found" });
      }
      return res.status(200).json({ message: "Aadhar Verified" });
    } 
    else {
      return res.status(404).json({ message: "Invalid Aadhar ID" });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Something Went Wrong" });
  }
};
