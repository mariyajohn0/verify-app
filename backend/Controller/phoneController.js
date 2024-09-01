

const users = require('../Models/userSchema');
const otpGenerator = require('otp-generator');
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = require('twilio')(accountSid, authToken);

// Function to validate and format phone number
const validateAndFormatPhoneNumber = (phoneNumber) => {
    return `+91${phoneNumber}`;
};

exports.sendPhoneOtp = async (req, res) => {
    let { phoneNumber } = req.body;
    const formattedPhone = validateAndFormatPhoneNumber(phoneNumber);
    
    if (!formattedPhone) {
        return res.status(400).json({ error: 'Invalid phone number format.' });
    }

    console.log('Received phoneNumber:', phoneNumber);
    console.log('Formatted phone:', formattedPhone);

    const phoneOtp = otpGenerator.generate(6, { 
        lowerCaseAlphabets: false, 
        upperCaseAlphabets: false, 
        specialChars: false 
    });

    const otpExpiry = Date.now() + 4 * 60 * 1000; // OTP expiry time set to 4 minutes

    if (req.session.phoneOtp) {
        delete req.session.phoneOtp; // Remove the old OTP from the session
    }

    req.session.phoneOtp = phoneOtp;
    req.session.phone = formattedPhone;
    req.session.otpExpiry = otpExpiry;

    console.log(req.session.phoneOtp)
    console.log(req.session.phone)

    try {
        await client.messages.create({
            body: `Your OTP for phone verification is ${phoneOtp}`,
            messagingServiceSid: 'MG7a6ceda6417fb31a0eeb00f7b5936b16',
            to: formattedPhone
        });

        res.json({ message: "OTP sent successfully!" });
    } catch (twilioError) {
        console.error("Twilio Error:", twilioError);
        res.status(500).json({ error: "Failed to send OTP via Twilio." });
    }
};

    
// Function to remove country code from the phone number
const removeCountryCode = (phoneNumber) => {
    return phoneNumber.replace(/^\+91/, '');
};

exports.verifyPhoneOtp = async (req, res) => {
    const { phone, otp } = req.body;

    // Format the phone number for comparison
    const formattedPhone = removeCountryCode(validateAndFormatPhoneNumber(phone));

    console.log('Body Phone:', formattedPhone);
    console.log('Body OTP:', otp);
    console.log('Session Phone:', removeCountryCode(req.session.phone));
    console.log('Session OTP:', req.session.phoneOtp);

    if (!req.session.phoneOtp || !req.session.phone || !req.session.otpExpiry) {
        return res.status(400).json("No OTP found. Please request a new one.");
    }

    const currentTime = Date.now();
    if (currentTime > req.session.otpExpiry) {
        req.session.phoneOtp = null;
        req.session.phone = null;
        req.session.otpExpiry = null;
        return res.status(400).json("OTP has expired. Please request a new one.");
    }

    if (req.session.phoneOtp === otp && removeCountryCode(req.session.phone) === formattedPhone) {
        try {
            console.log(req.session.phone)
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