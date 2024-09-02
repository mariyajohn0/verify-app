const axios = require("axios");
const users = require("../Models/userSchema");

exports.verifyGst = async (req, res) => {
  const { gst, email } = req.body;
  console.log(gst, email);

  if (!gst || !email) {
    return res
      .status(400)
      .json({ message: "GST number and email are required" });
  }

  //   const gstPattern =
  //     /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}[Z]{1}[0-9A-Z]{1}$/;
  //   if (!gstPattern.test(gst)) {
  //     return res.status(400).json({ message: "Invalid GST number format" });
  //   }

  const options = {
    method: "POST",
    url: "https://gst-verification.p.rapidapi.com/v3/tasks/sync/verify_with_source/ind_gst_certificate",
    headers: {
      "x-rapidapi-key": "961a5b12ecmsh06628088916a8f5p17377djsna2999a8e5d6b",
      "x-rapidapi-host": "gst-verification.p.rapidapi.com",
      "Content-Type": "application/json",
    },
    data: {
      task_id: "74f4c926-250c-43ca-9c53-453e87ceacd1",
      group_id: "8e16424a-58fc-4ba4-ab20-5bc8e7c3c41e",
      data: {
        gstin: gst,
      },
    },
  };

  try {
    console.log("try");
    const response = await axios.request(options);
    if (response.status == 200) {
      // If GST verification is successful

      const userData = await users.findOneAndUpdate(
        { email },
        { gst, gst_verify: true },
        { new: true } // Return the updated document
      );

      if (!userData) {
        return res.status(404).json({ message: "User Not Found" });
      }
      return res.status(200).json({ message: "GST Verified" });
    } else {
      // If GST verification fails
      return res.status(404).json({ message: "Invalid GST ID" });
    }
  } catch (error) {
    // console.error(error);
    return res.status(500).json({ message: "Something Went Wrong" });
  }
};
