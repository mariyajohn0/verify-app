"use client";

import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/app/Redux/store";
import { useRouter } from "next/navigation";
import { setUserDetails } from "../Redux/userSlice";
import styles from "./pincode.module.css"; 
import { verifyPincodeAPI } from "../Services/allAPI";

const VerifyPincode = () => {
  const user = useSelector((state: RootState) => state.user);
  const [pincodeInput, setPincodeInput] = useState("");
  const [addressDetails, setAddressDetails] = useState<{
    area?: string;
    district?: string;
    state?: string;
    pincode?: string;
  }>({});
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const router = useRouter();
  const dispatch = useDispatch();

  const handlePincodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPincodeInput(e.target.value);
  };

  const handleVerify = async () => {
    if (!pincodeInput) {
      setError("Please enter a valid pincode.");
      setSuccess("");
      return;
    }

    // const reqBody = { pincode: pincodeInput, email: user.email };
    // console.log(reqBody);
    const email= user.email
      console.log(email);
    try {
      const response = await verifyPincodeAPI(pincodeInput,email);
      console.log(response);
      if (response.status == 'SUCCESS') {
       // const data = await response.json();
        setAddressDetails(response);
        setSuccess("Pincode verified successfully!");
        setError("");

        dispatch(setUserDetails({ ...user, pincode_verify: true }));

        sessionStorage.setItem("pincode_verified", "true");

        setTimeout(() => {
          router.push("/Dashboard"); // Redirect to dashboard
        }, 2000);
      } else {
        setError("Failed to verify pincode. Please try again.");
        setSuccess("");
      }
    } catch (error) {
      setError("An error occurred during verification.");
      setSuccess("");
    }
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.header}>Verify Pincode</h1>
      <p className={styles.subheader}>
        Please enter your pincode for verification.
      </p>
      <input
        type="text"
        placeholder="Enter Pincode"
        value={pincodeInput}
        onChange={handlePincodeChange}
        className={styles.input}
      />
      <button onClick={handleVerify} className={styles.verifyButton}>
        Verify Pincode
      </button>
      {error && <p className={styles.errorMessage}>{error}</p>}
      {success && <p className={styles.successMessage}>{success}</p>}

      {/* Display address details if successfully fetched */}
      {addressDetails && success && (
        <div className={styles.addressDetails}>
          <p><strong>City:</strong> {addressDetails.area}</p>
          <p><strong>District:</strong> {addressDetails.district}</p>
          <p><strong>State:</strong> {addressDetails.state}</p>
          <p><strong>Postal Code:</strong> {addressDetails.pincode}</p>
        </div>
      )}
    </div>
  );
};

export default VerifyPincode;
