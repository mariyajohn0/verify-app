import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// Define the shape of the user state
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
  email_verify?: boolean;
  phone_verify?: boolean;
  aadhar_verify?: boolean;
}

// Define the initial state of the user slice
const initialState: UserState = {
  name: "",
  email: "",
  phone: "",
  dob: "",
  aadhar: "",
  password: "",
  isVerified: {
    phone: false,
    email: false,
    aadhar: false,
    pan: false,
    bank: false,
    gst: false,
  },
  email_verify: false,
  phone_verify: false,
  aadhar_verify: false,
};

// Redux slice for user state management
const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUserDetails: (state, action: PayloadAction<Partial<UserState>>) => {
      return { ...state, ...action.payload };
    },
    setVerificationStatus: (
      state,
      action: PayloadAction<Partial<UserState["isVerified"]>>
    ) => {
      state.isVerified = { ...state.isVerified, ...action.payload };
    },
  },
});

export const { setUserDetails, setVerificationStatus } = userSlice.actions;
export default userSlice.reducer;
