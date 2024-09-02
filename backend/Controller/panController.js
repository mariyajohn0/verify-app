const axios = require('axios');
const users = require('../Models/userSchema'); 

exports.verifyPanCard = async (req, res) => {
    const { pan,email } = req.body; 
    console.log(pan, email);

    if (!pan|| !email) {
        return res.status(400).json({ message: "PAN Card number and email are required" });
    }

    const panCardPattern = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
    if (!panCardPattern.test(pan)) {
        return res.status(400).json({ message: "Invalid PAN Card format" });
    }

    const options = {
        method: 'POST',
        url: process.env.X_RAPIDAPI_PANCARD_URL_VERIFY,
        headers: {
          'x-rapidapi-key': process.env.X_RAPIDAPI_PANCARD_API_KEY,
          'x-rapidapi-host': process.env.X_RAPIDAPI_HOST_PANCARD,
          'Content-Type': 'application/json'
        },
        data: {
          pan,
          consent: 'y',
          consent_text: 'I hear by declare my consent agreement for fetching my information via AITAN Labs API'
        }
      };

    try {
        const response = await axios.request(options);
        console.log(response)
        if (response.status != 200) {
            return res.status(response.status).json({ message: "Failed to verify PAN Card", details: response.data });
        }

        if (response.data.pan) {
            const userData = await users.findOneAndUpdate(
                { email },  
                { pan: pan, pan_verify: true },
                { new: true } // Return the updated document
            );

            if (!userData) {
                return res.status(404).json({ message: "User not found" });
            }

            // Update session storage if necessary
            req.session.user = {
                ...req.session.user,
                pan: pan,
                pan_verify: true
            };

            return res.json(response.data);
        } else {
            return res.status(404).json({ message: "PAN Card does not exist" });
        }
    } catch (error) {
        console.error('Error verifying PAN:', error);
        res.status(500).json({ message: 'Server error' });
    }
};