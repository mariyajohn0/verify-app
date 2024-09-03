"use client";

import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/app/Redux/store";
import { useRouter } from "next/navigation";
import { verifyPANAPI } from "../Services/allAPI";
import { setUserDetails } from "../Redux/userSlice";
import styles from "./pan.module.css";

const VerifyPAN = () => {
  const user = useSelector((state: RootState) => state.user);
  const [panInput, setPanInput] = useState("");
  const [confirmPanInput, setConfirmPanInput] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const router = useRouter();
  const dispatch = useDispatch();

  const handlePanChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPanInput(e.target.value);
  };

  const handleConfirmPanChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setConfirmPanInput(e.target.value);
  };

  // Handle verification process
  const handleVerify = async () => {
    if (panInput !== confirmPanInput) {
      setError("PAN numbers do not match. Please try again.");
      setSuccess("");
      return;
    }

    const reqBody = { pan: panInput, email: user.email };
    console.log(reqBody);

    try {
      // Call API to verify PAN number
      const response = await verifyPANAPI(reqBody);
      if (response.status === 200) {
        setSuccess("PAN verified successfully!");
        setError("");

        // Update user details in the Redux store
        dispatch(setUserDetails({ ...user, pan_verify: true }));

        // Save verification status to session storage
        sessionStorage.setItem("pan_verified", "true");

        setTimeout(() => {
          router.push("/Dashboard"); // Redirect to dashboard
        }, 2000);
      } else {
        setError("Failed to verify PAN. Please try again.");
        setSuccess("");
      }
    } catch (error) {
      setError("An error occurred during verification.");
      setSuccess("");
    }
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.header}>Verify PAN</h1>
      <p className={styles.subheader}>
        Please enter your PAN number for verification.
      </p>
      <input
        type="text"
        placeholder="Enter PAN number"
        value={panInput}
        onChange={handlePanChange}
        className={styles.input}
      />
      <input
        type="text"
        placeholder="Re-enter PAN number"
        value={confirmPanInput}
        onChange={handleConfirmPanChange}
        className={styles.input}
      />
      <button onClick={handleVerify} className={styles.verifyButton}>
        Verify PAN
      </button>
      {error && <p className={styles.errorMessage}>{error}</p>}
      {success && <p className={styles.successMessage}>{success}</p>}
    </div>
  );
};

export default VerifyPAN;
