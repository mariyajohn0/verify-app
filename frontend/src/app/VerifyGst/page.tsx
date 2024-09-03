"use client";

import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/app/Redux/store";
import { useRouter } from "next/navigation";
import { verifyGstAPI } from "../Services/allAPI";
import { setUserDetails } from "../Redux/userSlice";
import styles from "./gst.module.css";

const VerifyGst = () => {
  const user = useSelector((state: RootState) => state.user);
  const [gstInput, setGstInput] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const router = useRouter();
  const dispatch = useDispatch();

  const handleGstChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setGstInput(e.target.value);
  };

  const handleVerify = async () => {
    const reqBody = { gst: gstInput, email: user.email };
    console.log(reqBody);

    try {
      const response = await verifyGstAPI(reqBody);
      if (response.status === 200) {
        setSuccess("GST verified successfully!");
        setError("");

        dispatch(setUserDetails({ ...user, gst_verify: true }));

        sessionStorage.setItem("gst_verified", "true");

        setTimeout(() => {
          router.push("/Dashboard"); // Redirect to dashboard
        }, 2000);
      } else {
        setError("Failed to verify GST. Please try again.");
        setSuccess("");
      }
    } catch (error) {
      setError("An error occurred during verification.");
      setSuccess("");
    }
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.header}>Verify GST</h1>
      <p className={styles.subheader}>
        Please enter your GST number for verification.
      </p>
      <input
        type="text"
        placeholder="Enter GST number"
        value={gstInput}
        onChange={handleGstChange}
        className={styles.input}
      />
      <button onClick={handleVerify} className={styles.verifyButton}>
        Verify GST
      </button>
      {error && <p className={styles.errorMessage}>{error}</p>}
      {success && <p className={styles.successMessage}>{success}</p>}
    </div>
  );
};

export default VerifyGst;
