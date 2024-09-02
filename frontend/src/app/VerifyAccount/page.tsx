"use client";

import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/app/Redux/store";
import { useRouter } from "next/navigation";
import { verifyAccountAPI } from "../Services/allAPI"; 
import { setUserDetails } from "../Redux/userSlice";
import styles from "./account.module.css"; 

const VerifyAccount = () => {
  const user = useSelector((state: RootState) => state.user);
  const [accountNumber, setAccountNumber] = useState("");
  const [ifsc, setIfsc] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const router = useRouter();
  const dispatch = useDispatch();

  const handleAccountNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAccountNumber(e.target.value);
  };

  const handleIfscChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIfsc(e.target.value);
  };

  const handleVerify = async () => {
    const reqBody = { accountNumber, ifsc, email: user.email };
    console.log(reqBody);

    try {
      const response = await verifyAccountAPI(reqBody);
      if (response.status === 200) {
        setSuccess("Bank account verified successfully!");
        setError("");

        dispatch(setUserDetails({ ...user, account_verify: true }));

        sessionStorage.setItem("account_verified", "true");

        setTimeout(() => {
          router.push("/Dashboard"); // Redirect to dashboard
        }, 2000);
      } else {
        setError("Failed to verify bank account. Please try again.");
        setSuccess("");
      }
    } catch (error) {
      setError("An error occurred during verification.");
      setSuccess("");
    }
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.header}>Verify Bank Account</h1>
      <p className={styles.subheader}>
        Please enter your bank account number and IFSC code for verification.
      </p>
      <input
        type="text"
        placeholder="Enter Bank Account Number"
        value={accountNumber}
        onChange={handleAccountNumberChange}
        className={styles.input}
      />
      <input
        type="text"
        placeholder="Enter IFSC Code"
        value={ifsc}
        onChange={handleIfscChange}
        className={styles.input}
      />
      <button onClick={handleVerify} className={styles.verifyButton}>
        Verify Bank Account
      </button>
      {error && <p className={styles.errorMessage}>{error}</p>}
      {success && <p className={styles.successMessage}>{success}</p>}
    </div>
  );
};

export default VerifyAccount;
