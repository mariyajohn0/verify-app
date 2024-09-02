import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// Define the shape of the user state
interface UserState {
  name: string;
  email: string;
  phone: string;
  dob: string;
  aadhar: string;
  password: string;
  pan: string;
  gst: string;
  pincode: string;
  account: string;
  isVerified: {
    phone: boolean;
    email: boolean;
    aadhar: boolean;
    pan: boolean;
    // bank: boolean;
    gst: boolean;
    pincode: boolean;
    account:boolean;
  };
  email_verify?: boolean;
  phone_verify?: boolean;
  aadhar_verify?: boolean;
  pan_verify?: boolean;
  gst_verify?: boolean;
  pincode_verify?: boolean;
  account_verify?:boolean;
}

// Define the initial state of the user slice
const initialState: UserState = {
  name: "",
  email: "",
  phone: "",
  dob: "",
  aadhar: "",
  password: "",
  pan: "",
  gst: "",
  pincode: "",
  account:"",
  isVerified: {
    phone: false,
    email: false,
    aadhar: false,
    pan: false,
    // bank: false,
    gst: false,
    pincode: false,
    account:false
  },
  email_verify: false,
  phone_verify: false,
  aadhar_verify: false,
  pan_verify: false,
  gst_verify: false,
  pincode_verify: false,
  account_verify:false
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
