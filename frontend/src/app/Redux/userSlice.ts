import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UserState {
  name: string;
  email: string;
  phone: string;
  dob: string;
  aadhar: string;
  password: string;
  isVerified: {
    phone: boolean;
    email: boolean;
    aadhar: boolean;
    pan: boolean;
    bank: boolean;
    gst: boolean;
  };
  email_verify?: boolean; // Add this property if it's part of the state
  phone_verify?: boolean; // Add this property if it's part of the state
  aadhar_verify?: boolean; // Add this property if it's part of the state
}

const initialState: UserState = {
  name: '',
  email: '',
  phone: '',
  dob: '',
  aadhar: '',
  password: '',
  isVerified: {
    phone: false,
    email: false,
    aadhar: false,
    pan: false,
    bank: false,
    gst: false,
  },
  email_verify: false, // Initialize if needed
  phone_verify: false, // Initialize if needed
  aadhar_verify: false, // Initialize if needed
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUserDetails: (state, action: PayloadAction<Partial<UserState>>) => {
      // Update the state with the action payload
      return { ...state, ...action.payload };
    },
    setVerificationStatus: (state, action: PayloadAction<Partial<UserState['isVerified']>>) => {
      // Update the verification status
      state.isVerified = { ...state.isVerified, ...action.payload };
    },
  },
});

export const { setUserDetails, setVerificationStatus } = userSlice.actions;
export default userSlice.reducer;