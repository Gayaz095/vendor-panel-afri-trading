import React from "react";
import { Navigate } from "react-router-dom";
import { useVendor } from "./VendorContext";

const PrivateRoute = ({ children }) => {
  const { vendorDetails, loginTime } = useVendor();

  const isLoggedIn = vendorDetails && Date.now() - loginTime < 10000;

  return isLoggedIn ? children : <Navigate to="/" replace />;
};

export default PrivateRoute;
