"use client"; // This directive is needed to use client-side features like React hooks

import React from "react";
import { Provider } from "react-redux";
import { store } from "../Redux/store"; // Make sure this path correctly points to where your store is defined

interface ReduxProviderProps {
  children: React.ReactNode;
}

const ReduxProvider: React.FC<ReduxProviderProps> = ({ children }) => {
  return <Provider store={store}>{children}</Provider>;
};

export default ReduxProvider;
