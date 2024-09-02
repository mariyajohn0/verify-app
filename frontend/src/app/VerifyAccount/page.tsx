"use client";

import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/app/Redux/store";
import { useRouter } from "next/navigation";
import { verifyAccountAPI } from "../Services/allAPI"; 
import { setUserDetails } from "../Redux/userSlice";
import styles from "./account.module.css"; 

const VerifyAccount= () => {
  const user = useSelector((state: RootState) => state.user);
  const [accountInput, setAccountInput] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const router = useRouter();
  const dispatch = useDispatch();

  const handleAccountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAccountInput(e.target.value);
  };

  const handleVerify = async () => {
    const reqBody = { account: accountInput, email: user.email };
    console.log(reqBody);

    try {
      const response = await verifyAccountAPI(reqBody);
      if (response.status === 200) {
        setSuccess("Bank Account verified successfully!");
        setError("");

        dispatch(setUserDetails({ ...user, account_verify: true }));

        sessionStorage.setItem("account_verified", "true");

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
      <h1 className={styles.header}>Verify Account</h1>
      <p className={styles.subheader}>
        Please enter your Account number for verification.
      </p>
      <input
        type="text"
        placeholder="Enter Account number"
        value={accountInput}
        onChange={handleAccountChange}
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

export default VerifyAccount;
