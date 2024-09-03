"use client";

import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/app/Redux/store";
import { useRouter } from "next/navigation";
import { setUserDetails } from "../Redux/userSlice";
import styles from "./dashboard.module.css";

const Dashboard = () => {
  const user = useSelector((state: RootState) => state.user);
  const dispatch = useDispatch();
  const router = useRouter();

  useEffect(() => {
    const sessionUser = sessionStorage.getItem("user");
    if (sessionUser) {
      dispatch(setUserDetails(JSON.parse(sessionUser)));
    }
  }, [dispatch]);

  const handleCardClick = (path: string) => {
    router.push(path);
  };

  const handleLogout = () => {
    sessionStorage.clear();
    router.push("/login");
  };

  const handleVerifyAadhar = () => {
    router.push("/Aadhar");
  };

  const handleVerifyPAN = () => {
    router.push("/VerifyPan");
  };

  const handleVerifyGST = () => {
    router.push("/VerifyGst");
  };

  const handleVerifyPincode = () => {
    router.push("/VerifyPincode");
  };

  const handleVerifyAccount = () => {
    router.push("/VerifyAccount");
  };

  const renderCard = (
    title: string,
    verified: boolean,
    path: string,
    info: string,
    showVerifyButton: boolean,
    verifyFunction?: () => void
  ) => (
    <div
      className={`${styles.card} ${verified ? styles.verified : ""}`}
      onClick={() => !verified && handleCardClick(path)}
    >
      <h3>{title}</h3>
      <p>{info}</p>
      <div
        className={`${styles.checkmark} ${
          verified ? styles.checked : styles.notChecked
        }`}
      ></div>
      <p>{verified ? "Verified" : "Not Verified"}</p>
      {showVerifyButton && !verified && (
        <button className={styles.verifyButton} onClick={verifyFunction}>
          Verify {title}
        </button>
      )}
    </div>
  );

  return (
    <div className={styles.container}>
      <button className={styles.Btn} onClick={handleLogout}>
        <div className={styles.sign}>
          <svg viewBox="0 0 512 512">
            <path d="M377.9 105.9L500.7 228.7c7.2 7.2 11.3 17.1 11.3 27.3s-4.1 20.1-11.3 27.3L377.9 406.1c-6.4 6.4-15 9.9-24 9.9c-18.7 0-33.9-15.2-33.9-33.9l0-62.1-128 0c-17.7 0-32-14.3-32-32l0-64c0-17.7 14.3-32 32-32l128 0 0-62.1c0-18.7 15.2-33.9 33.9-33.9c9 0 17.6 3.6 24 9.9zM160 96L96 96c-17.7 0-32 14.3-32 32l0 256c0 17.7 14.3 32 32 32l64 0c17.7 0 32 14.3 32 32s-14.3 32-32 32l-64 0c-53 0-96-43-96-96L0 128C0 75 43 32 96 32l64 0c17.7 0 32 14.3 32 32s-14.3 32-32 32z"></path>
          </svg>
        </div>
        <div className={styles.text}>Logout</div>
      </button>
      <h1 className={styles.header}>Dashboard</h1>
      <div className={styles.cardsContainer}>
        {renderCard(
          "Email",
          user.email_verify ?? false,
          "/verify-email",
          `Email: ${user.email}`,
          false
        )}
        {renderCard(
          "Phone",
          user.phone_verify ?? false,
          "/verify-phone",
          `Phone: ${user.phone}`,
          false
        )}
        {renderCard(
          "Aadhar",
          user.aadhar_verify ?? false,
          "/Aadhar",
          `Aadhar: ${user.aadhar}`,
          true,
          handleVerifyAadhar
        )}
        {renderCard(
          "PAN",
          user.pan_verify ?? false,
          "/VerifyPan",
          `PAN: ${user.pan}`,
          true,
          handleVerifyPAN
        )}
        {renderCard(
          "GST",
          user.gst_verify ?? false,
          "/VerifyGst",
          `GST: ${user.gst}`,
          true,
          handleVerifyGST
        )}
        {renderCard(
          "Pincode",
          user.pincode_verify ?? false,
          "/VerifyPincode",
          `Pincode: ${user.pincode}`,
          true,
          handleVerifyPincode
        )}
        {renderCard(
          "BankAccount",
          user.account_verify ?? false,
          "/VerifyAccount",
          `account: ${user.account}`,
          true,
          handleVerifyAccount
        )}
      </div>
    </div>
  );
};

export default Dashboard;
