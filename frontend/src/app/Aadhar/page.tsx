"use client";

import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/app/Redux/store";
import { useRouter } from "next/navigation";
import { verifyAadharAPI } from "../Services/allAPI";
import { setUserDetails } from "../Redux/userSlice";
import styles from "./aadhar.module.css";

const VerifyAadhar = () => {
  const user = useSelector((state: RootState) => state.user);
  const [aadharInput, setAadharInput] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const router = useRouter();
  const dispatch = useDispatch();

  const handleAadharChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAadharInput(e.target.value);
  };

  // Handle verification process
  const handleVerify = async () => {
    const reqBody = { aadhar: aadharInput };
    console.log(aadharInput);

    try {
      // Call API to verify Aadhar number
      const response = await verifyAadharAPI(reqBody);
      if (response.status === 200) {
        setSuccess("Aadhar verified successfully!");
        setError("");

        // Update user details in the Redux store
        dispatch(setUserDetails({ ...user, aadhar_verify: true }));

        // Save verification status to session storage
        sessionStorage.setItem("aadhar_verified", "true");

        setTimeout(() => {
          router.push("/Dashboard"); // Redirect to dashboard
        }, 2000);
      } 
      else {
        setError("Failed to verify Aadhar. Please try again.");
        setSuccess("");
      }
    } catch (error) {
      setError("An error occurred during verification.");
      setSuccess("");
    }
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.header}>Verify Aadhar</h1>
      <p className={styles.subheader}>
        Please re-enter your Aadhar number for verification.
      </p>
      <input
        type="text"
        placeholder="Enter Aadhar number"
        value={aadharInput}
        onChange={handleAadharChange}
        className={styles.input}
      />
      <button onClick={handleVerify} className={styles.verifyButton}>
        Verify Aadhar
      </button>
      {error && <p className={styles.errorMessage}>{error}</p>}
      {success && <p className={styles.successMessage}>{success}</p>}
    </div>
  );
};

export default VerifyAadhar;
