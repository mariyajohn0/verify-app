const axios = require("axios");
const users = require("../Models/userSchema");


exports.verifyPincode = async (req, res) => {
 // const { pincode } = req.body;
  const { email,pincode } = req.query;
  console.log(`Pincode received: ${pincode}`);

  if (!pincode) {
    return res.status(400).json({ message: "Pincode is required" });
  }
  const url = `https://india-pincode-with-latitude-and-longitude.p.rapidapi.com/api/v1/pincode/${pincode}`;

  const options = {
    method: 'GET',
    url: url,
    headers: {
      'x-rapidapi-key': '961a5b12ecmsh06628088916a8f5p17377djsna2999a8e5d6b',
      'x-rapidapi-host': 'india-pincode-with-latitude-and-longitude.p.rapidapi.com'
    }
  };

  try {
    const response = await axios.request(options);
    console.log(`response received: ${response.status}`);
    if (response.status === 200  && response.data && response.data.length > 0) {
      const { area, district, state, pincode } = response.data[0];
    
      const userData = await users.findOneAndUpdate(
        { email },
        { pincode, pincode_verify: true },
        { new: true } // Return the updated document
      );

      if (!userData) {
        return res.status(404).json({ message: "User Not Found" });
      }

      // Assuming response.data contains city, district, state, and postalCode
      return res.status(200).json({
        message: "Pincode verified successfully",
        area,
        district,
        state,
        pincode,
        status:"SUCCESS"
      });
    } else {
      return res.status(404).json({ message: "Invalid pincode" });
    }
  } catch (error) {
    console.error("Error during pincode verification:", error);
    return res.status(500).json({ message: "Something went wrong" });
  }
};
