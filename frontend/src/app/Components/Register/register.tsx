"use client";

import React, { useState, ChangeEvent, FormEvent } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../Redux/store";
import { setUserDetails } from "../../Redux/userSlice";
import styles from "./register.module.css";
import { registerAPI } from "../../Services/allAPI";
import { useRouter } from "next/navigation";

function RegisterPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    dob: "",
    aadhar: "",
    password: "",
  });

  const [errors, setErrors] = useState({
    name: "",
    email: "",
    phone: "",
    dob: "",
    aadhar: "",
    password: "",
  });

  const dispatch = useDispatch();
  const router = useRouter();
  const userReduxState = useSelector((state: RootState) => state.user);

  // Function to validate each field based on its name and value
  const validateField = (name: string, value: string) => {
    let error = "";
    switch (name) {
      case "name":
        if (!/^[a-zA-Z\s]+$/.test(value)) {
          error = "Name must contain only letters and spaces.";
        }
        break;
      case "email":
        if (!/^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/.test(value)) {
          error = "Invalid email format.";
        }
        break;
      case "phone":
        if (!/^\d{10}$/.test(value)) {
          error = "Phone number must be 10 digits.";
        }
        break;
      case "aadhar":
        if (!/^\d{12}$/.test(value)) {
          error = "Aadhar number must be 12 digits.";
        }
        break;
      case "password":
        if (value.length < 6) {
          error = "Password must be at least 6 characters long.";
        }
        break;
      default:
        break;
    }
    return error;
  };

  // Handle input field changes
  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));

    // Validate the changed field and update error state
    const error = validateField(name, value);
    setErrors((prevState) => ({
      ...prevState,
      [name]: error,
    }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const isAnyFieldEmpty = Object.values(formData).some(
      (value) => value.trim() === ""
    );
    const isAnyFieldInvalid = Object.values(errors).some(
      (error) => error !== ""
    );

    if (isAnyFieldEmpty) {
      alert("Please fill all fields");
      return;
    }
    if (isAnyFieldInvalid) {
      alert("Please fix the errors in the form.");
      return;
    }

    // Update global user details in Redux store
    dispatch(setUserDetails(formData));

    try {
      // Call API to register the user
      const result = await registerAPI(formData);
      console.log(result);
      if (result.status === 200) {
        alert("Registration Success");
        router.push("/VerifyEmail"); // Redirect to the email verification page
      } 
      else {
        alert(result.response.data);
      }
    } catch (error) {
      console.error("Error during registration:", error);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>Registration</div>
      <div className={styles.inputFields}>
        <form onSubmit={handleSubmit} className={styles.formContent}>
          <label className={styles.fieldName} htmlFor="name">
            Full Name
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            className={`${styles.inputField} ${
              errors.name ? styles.errorInput : ""
            }`}
          />
          {errors.name && <p className={styles.errorMessage}>{errors.name}</p>}

          <label className={styles.fieldName} htmlFor="email">
            Email Address
          </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            className={`${styles.inputField} ${
              errors.email ? styles.errorInput : ""
            }`}
          />
          {errors.email && (
            <p className={styles.errorMessage}>{errors.email}</p>
          )}

          <label className={styles.fieldName} htmlFor="phone">
            Phone Number
          </label>
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleInputChange}
            className={`${styles.inputField} ${
              errors.phone ? styles.errorInput : ""
            }`}
          />
          {errors.phone && (
            <p className={styles.errorMessage}>{errors.phone}</p>
          )}

          <label className={styles.fieldName} htmlFor="dob">
            Date of Birth
          </label>
          <input
            type="date"
            name="dob"
            value={formData.dob}
            onChange={handleInputChange}
            className={`${styles.inputField} ${styles.dobfield}`}
          />

          <label className={styles.fieldName} htmlFor="aadhar">
            Aadhar No
          </label>
          <input
            type="text"
            name="aadhar"
            value={formData.aadhar}
            onChange={handleInputChange}
            className={`${styles.inputField} ${
              errors.aadhar ? styles.errorInput : ""
            }`}
          />
          {errors.aadhar && (
            <p className={styles.errorMessage}>{errors.aadhar}</p>
          )}

          <label className={styles.fieldName} htmlFor="password">
            Password
          </label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleInputChange}
            className={`${styles.inputField} ${
              errors.password ? styles.errorInput : ""
            }`}
          />
          {errors.password && (
            <p className={styles.errorMessage}>{errors.password}</p>
          )}

          <button className={styles.submitButton} type="submit">
            Register
          </button>
        </form>

        <p className={styles.loginPrompt}>
          Already have an account?{" "}
          <span
            onClick={() => router.push("/login")}
            className={styles.loginLink}
          >
            Login
          </span>
        </p>
      </div>
    </div>
  );
}

export default RegisterPage;
