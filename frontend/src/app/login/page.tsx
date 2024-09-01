"use client";
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import { loginAPI } from "../Services/allAPI";
import { setUserDetails } from "../Redux/userSlice";
import styles from "./login.module.css";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const dispatch = useDispatch();
  const router = useRouter();

  const handleLogin = async () => {
    const loginDetails = { email, password };
    try {
      const response = await loginAPI(loginDetails);
      const user = response.data.user;

      console.log(user);

      // Store user details in Redux store
      dispatch(setUserDetails(user));

      // Store user details in session storage
      sessionStorage.setItem("user", JSON.stringify(user));

      // Navigate to dashboard after login
      router.push("/Dashboard");
    } catch (err) {
      setError("Login failed. Please check your credentials.");
    }
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.header}>Login</h1>
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className={styles.input}
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className={styles.input}
      />
      <button onClick={handleLogin} className={styles.button}>
        Login
      </button>
      {error && <p className={styles.error}>{error}</p>}
    </div>
  );
};

export default LoginPage;
