"use client";

import { useEffect, useState, useRef } from "react";
import { verifyEmailAPI, verifyOtpAPI } from "../Services/allAPI";
import { useSelector } from "react-redux";
import { RootState } from "../Redux/store";
import styles from "./email.module.css";
import PhoneVerification from "../VerifyPhone/page";

function Page() {
  const [otp, setOtp] = useState<string[]>(["", "", "", "", "", ""]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isResending, setIsResending] = useState(false);
  const [isOtpVerified, setIsOtpVerified] = useState(false);

  // Access email from Redux store
  const email = useSelector((state: RootState) => state.user.email);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (email) {
      verifyEmail();
    }
  }, [email]);

  const verifyEmail = async () => {
    console.log(12343434);
    const reqBody = { email };
    try {
      const response = await verifyEmailAPI(reqBody); // Call API to send verification email
      console.log(response);
    } catch (error) {
      console.log(error);
      setError("Failed to send verification email.");
    }
  };

  const verifyOtp = async () => {
    const otpString = otp.join("");
    console.log("Typed OTP:", otpString);
    const reqBody = { email, otp: otpString };
    try {
      const response = await verifyOtpAPI(reqBody); // Call API to verify OTP
      console.log(response);
      if (response.status === 200) {
        setSuccess("Email verified successfully!");
        setError("");
        setIsOtpVerified(true); // Set OTP verification status to true
      } else {
        setError("Failed to verify OTP. Please check the OTP and try again.");
        setSuccess("");
      }
    } catch (error) {
      console.log(error);
      setError("An error occurred during verification.");
      setSuccess("");
    }
  };

  const resendOtp = async () => {
    setIsResending(true);
    await verifyEmail(); // Attempt to resend OTP
    setIsResending(false);
  };

  const handleChange = (index: number, value: string) => {
    const newOtp = [...otp];
    newOtp[index] = value;

    // Move focus to next input if value is entered
    if (value && index < otp.length - 1) {
      inputRefs.current[index + 1]?.focus();
    }

    // Move focus to previous input if value is deleted
    if (!value && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }

    setOtp(newOtp); // Update OTP state
  };

  return (
    <div>
      {!isOtpVerified ? (
        <div className={styles.container}>
          <h1 className={styles.header}>Email Verification</h1>
          <p className={styles.subheader}>
            A verification code has been sent to your email:{" "}
            <strong>{email}</strong>
          </p>

          <div className={styles.verification}>
            <div className={styles.inputfields}>
              {otp.map((value, index) => (
                <input
                  key={index}
                  type="tel"
                  maxLength={1}
                  value={value}
                  onChange={(e) => handleChange(index, e.target.value)}
                  ref={(el) => {
                    inputRefs.current[index] = el;
                  }}
                />
              ))}
            </div>

            <div className={styles.buttons}>
              <button onClick={verifyOtp}>Verify Email</button>
              <br />
              <button onClick={resendOtp} disabled={isResending}>
                {isResending ? "Resending..." : "Resend OTP"}
              </button>
            </div>
          </div>

          {error && <p className={styles.errorMessage}>{error}</p>}
          {success && <p className={styles.successMessage}>{success}</p>}
        </div>
      ) : (
        <PhoneVerification /> // Render PhoneVerification component after successful OTP verification
      )}
    </div>
  );
}

export default Page;
