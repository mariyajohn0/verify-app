"use client";

import { useEffect, useState, useRef } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../Redux/store';
import { verifyPhoneOtpAPI, sendPhoneOtpAPI } from '../Services/allAPI';
import styles from './phone.module.css';
import { useRouter } from 'next/navigation'; // Import useRouter

function PhoneVerification() {
    const [otp, setOtp] = useState<string[]>(['', '', '', '', '', '']); // Array to hold each digit
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [isResending, setIsResending] = useState(false);
    const [isOtpVerified, setIsOtpVerified] = useState(false); // Track if OTP is verified

    const phone = useSelector((state: RootState) => state.user.phone);
    const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
    const router = useRouter(); // Initialize router

    useEffect(() => {
        if (phone) {
            sendPhoneOtp();
        }
    }, [phone]);

    const sendPhoneOtp = async () => {
        if (!phone || phone.length !== 10) {
            setError('Invalid phone number.');
            return;
        }
    
        const reqBody = { phoneNumber: phone }; // Ensure the phone number is correctly named
        try {
            const response = await sendPhoneOtpAPI(reqBody);
            console.log(response);
            console.log(reqBody);
        } catch (error) {
            console.log(error);
            setError('Failed to send OTP.');
        }
    };
    
    

    const verifyOtp = async () => {
        const otpString = otp.join('');
        console.log('Typed OTP:', otpString);
        const reqBody = { phone, otp: otpString };
        try {
            const response = await verifyPhoneOtpAPI(reqBody);
            console.log(response);
            if (response.status === 200) {
                setSuccess('Phone verified successfully!');
                setError('');
                setIsOtpVerified(true); // Set OTP verification status to true
                setTimeout(() => {
                    router.push('/Dashboard'); // Redirect to dashboard after success
                }, 1000); 
            } else {
                setError('Failed to verify OTP. Please check the OTP and try again.');
                setSuccess('');
            }
        } catch (error) {
            console.log(error);
            setError('An error occurred during verification.');
            setSuccess('');
        }
    };

    const resendOtp = async () => {
        setIsResending(true);
        await sendPhoneOtp();
        setIsResending(false);
    };

    const handleChange = (index: number, value: string) => {
        const newOtp = [...otp];
        newOtp[index] = value;

        if (value && index < otp.length - 1) {
            inputRefs.current[index + 1]?.focus();
        }

        if (!value && index > 0) {
            inputRefs.current[index - 1]?.focus();
        }

        setOtp(newOtp);
    };

    return (
        <div className={styles.container}>
            <div className={styles.card}>
                <h1 className={styles.header}>Phone Verification</h1>
                <p className={styles.subheader}>
                    A verification code has been sent to your phone: <strong>{phone}</strong>
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
                                ref={(el) => { inputRefs.current[index] = el; }}
                            />
                        ))}
                    </div>

                    <div className={styles.buttons}>
                        <button onClick={verifyOtp}>Verify Phone</button>
                        <br />
                        <button
                            onClick={resendOtp}
                            disabled={isResending}
                        >
                            {isResending ? 'Resending...' : 'Resend OTP'}
                        </button>
                    </div>
                </div>

                {error && <p className={styles.errorMessage}>{error}</p>}
                {success && <p className={styles.successMessage}>{success}</p>}
                {isOtpVerified && <p className={styles.verifiedMessage}>Phone number verified!</p>}
            </div>
        </div>
    );
}

export default PhoneVerification;