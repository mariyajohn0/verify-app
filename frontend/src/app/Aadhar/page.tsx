"use client";

import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/app/Redux/store';
import { useRouter } from 'next/navigation';
import { verifyAadharAPI } from '../Services/allAPI'; // Assuming you have an API function for Aadhar verification
import { setUserDetails } from '../Redux/userSlice'; // Assuming you have this action
import styles from './aadhar.module.css'; // Add styles for this page

const VerifyAadhar = () => {
  const user = useSelector((state: RootState) => state.user);
  const [aadharInput, setAadharInput] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const router = useRouter();
  const dispatch = useDispatch();

  const handleAadharChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAadharInput(e.target.value);
  };

  const handleVerify = async () => {
    // You can uncomment this if you want to check if aadharInput matches the current user Aadhar
    // if (aadharInput !== user.aadhar) {
    //   setError('Aadhar numbers do not match.');
    //   return;
    // }

    const reqBody = { aadhar: aadharInput };
    console.log(aadharInput);

    try {
      const response = await verifyAadharAPI(reqBody);
      if (response.status === 200) {
        setSuccess('Aadhar verified successfully!');
        setError('');
        
        // Optionally update user details in the Redux store
        dispatch(setUserDetails({ ...user, aadhar_verify: true }));
        
        // Save verification status to session storage
        sessionStorage.setItem('aadhar_verified', 'true');

        // Wait for 2 seconds before redirecting
        setTimeout(() => {
          router.push('/Dashboard'); // Redirect to dashboard
        }, 2000);
      } else {
        setError('Failed to verify Aadhar. Please try again.');
        setSuccess('');
      }
    } catch (error) {
      setError('An error occurred during verification.');
      setSuccess('');
    }
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.header}>Verify Aadhar</h1>
      <p className={styles.subheader}>Please re-enter your Aadhar number for verification.</p>
      <input
        type="text"
        placeholder="Enter Aadhar number"
        value={aadharInput}
        onChange={handleAadharChange}
        className={styles.input}
      />
      <button onClick={handleVerify} className={styles.verifyButton}>Verify Aadhar</button>
      {error && <p className={styles.errorMessage}>{error}</p>}
      {success && <p className={styles.successMessage}>{success}</p>}
    </div>
  );
};

export default VerifyAadhar;