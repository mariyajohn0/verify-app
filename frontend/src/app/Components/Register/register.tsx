

"use client";
import React, { useState, ChangeEvent, FormEvent } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../Redux/store'; 
import { setUserDetails } from '../../Redux/userSlice';
import styles from './register.module.css';
import { registerAPI } from '../../Services/allAPI';
import { useRouter } from 'next/navigation';

function RegisterPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    dob: "",
    aadhar: "",
    password:""
  });

  const [errors, setErrors] = useState({
    name: "",
    email: "",
    phone: "",
    dob: "",
    aadhar: "",
    password:""
  });

  const dispatch = useDispatch();
  const router = useRouter();
  const userReduxState = useSelector((state: RootState) => state.user);

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

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value,
    }));

    const error = validateField(name, value);
    setErrors(prevState => ({
      ...prevState,
      [name]: error,
    }));
  };

  const handleSubmit = async(e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const isAnyFieldEmpty = Object.values(formData).some(value => value.trim() === '');
    const isAnyFieldInvalid = Object.values(errors).some(error => error !== '');
    
    if (isAnyFieldEmpty) {
      alert('Please fill all fields');
      return;
    }
    if (isAnyFieldInvalid) {
      alert('Please fix the errors in the form.');
      return;
    }
    dispatch(setUserDetails(formData));
    
    try {
      const result = await registerAPI(formData);
      console.log(result);
      if(result.status === 200){
        alert('Registration Success');
        router.push('/VerifyEmail');
      } else {
        alert(result.response.data);
      }
    } catch (error) {
      console.error('Error during registration:', error);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.inputFields}>
        <form onSubmit={handleSubmit} className={styles.formContent}>
          <label className={styles.fieldName} htmlFor="name">Full Name</label>
          <input 
            type="text" 
            name="name" 
            value={formData.name} 
            onChange={handleInputChange} 
            className={errors.name ? styles.errorInput : ''}
          />
          {errors.name && <p className={styles.errorMessage}>{errors.name}</p>}
          
          <label className={styles.fieldName} htmlFor="email">Email Address</label>
          <input 
            type="email" 
            name="email" 
            value={formData.email} 
            onChange={handleInputChange} 
            className={errors.email ? styles.errorInput : ''}
          />
          {errors.email && <p className={styles.errorMessage}>{errors.email}</p>}
          
          <label className={styles.fieldName} htmlFor="phone">Phone Number</label>
          <input 
            type="tel" 
            name="phone" 
            value={formData.phone} 
            onChange={handleInputChange} 
            className={errors.phone ? styles.errorInput : ''}
          />
          {errors.phone && <p className={styles.errorMessage}>{errors.phone}</p>}
          
          <label className={styles.fieldName} htmlFor="dob">Date of Birth</label>
          <input 
            type="date" 
            name="dob" 
            value={formData.dob} 
            onChange={handleInputChange} 
            className={styles.dobfield}
          />
          
          <label className={styles.fieldName} htmlFor="aadhar">Aadhar No</label>
          <input 
            type="text" 
            name="aadhar" 
            value={formData.aadhar} 
            onChange={handleInputChange} 
            className={errors.aadhar ? styles.errorInput : ''}
          />
          {errors.aadhar && <p className={styles.errorMessage}>{errors.aadhar}</p>}
          
          <label className={styles.fieldName} htmlFor="password">Password</label>
          <input 
            type="password" 
            name="password" 
            value={formData.password} 
            onChange={handleInputChange} 
            className={errors.password ? styles.errorInput : ''}
          />
          {errors.password && <p className={styles.errorMessage}>{errors.password}</p>}
          
          <button className={styles.submitButton} type='submit'>Register</button>
        </form>
        
        <p className={styles.loginPrompt}>
          Already have an account? <span onClick={() => router.push('/login')} className={styles.loginLink}>Login</span>
        </p>
      </div>
    </div>
  );
}

export default RegisterPage;
    // <div>
    //   <div className={styles.container}>
    //     <div className={styles.inputFields}>
    //       <form onSubmit={handleSubmit} className={styles.formGroup}>
    //         <label className={styles.label} htmlFor="name">
    //           Full Name
    //         </label>
    //         <input
    //           type="text"
    //           name="name"
    //           value={formData.name}
    //           onChange={handleInputChange}
    //           className={`${styles.inputField} ${
    //             errors.name ? styles.errorInput : ""
    //           }`}
    //         />
    //         {errors.name && (
    //           <p className={styles.errorMessage}>{errors.name}</p>
    //         )}
    //         <label className={styles.label} htmlFor="email">
    //           Email Address
    //         </label>
    //         <input
    //           type="email"
    //           name="email"
    //           value={formData.email}
    //           onChange={handleInputChange}
    //           className={`${styles.inputField} ${
    //             errors.email ? styles.errorInput : ""
    //           }`}
    //         />
    //         {errors.email && (
    //           <p className={styles.errorMessage}>{errors.email}</p>
    //         )}
    //         <label className={styles.label} htmlFor="phone">
    //           Phone Number
    //         </label>
    //         <input
    //           type="tel"
    //           name="phone"
    //           value={formData.phone}
    //           onChange={handleInputChange}
    //           className={`${styles.inputField} ${
    //             errors.phone ? styles.errorInput : ""
    //           }`}
    //         />
    //         {errors.phone && (
    //           <p className={styles.errorMessage}>{errors.phone}</p>
    //         )}
    //         <label className={styles.label} htmlFor="dob">
    //           Date of Birth
    //         </label>
    //         <input
    //           type="date"
    //           name="dob"
    //           value={formData.dob}
    //           onChange={handleInputChange}
    //           className={`${styles.inputField} ${styles.dobfield}`}
    //         />
    //         <label className={styles.label} htmlFor="aadhar">
    //           Aadhar No
    //         </label>
    //         <input
    //           type="text"
    //           name="aadhar"
    //           value={formData.aadhar}
    //           onChange={handleInputChange}
    //           className={`${styles.inputField} ${
    //             errors.aadhar ? styles.errorInput : ""
    //           }`}
    //         />
    //         {errors.aadhar && (
    //           <p className={styles.errorMessage}>{errors.aadhar}</p>
    //         )}
    //         <label className={styles.label} htmlFor="password">
    //           Password
    //         </label>
    //         <input
    //           type="password"
    //           name="password"
    //           value={formData.password}
    //           onChange={handleInputChange}
    //           className={`${styles.inputField} ${
    //             errors.password ? styles.errorInput : ""
    //           }`}
    //         />
    //         {errors.password && (
    //           <p className={styles.errorMessage}>{errors.password}</p>
    //         )}
    //         <button className={styles.submitButton} type="submit">
    //           Register
    //         </button>
    //       </form>
    //     </div>
    //   </div>
    // </div>
