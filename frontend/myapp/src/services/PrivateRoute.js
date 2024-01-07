import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { isAccessTokenValid } from "./commands/auth";
//***********************************************************************************************
const PrivateRoute = ({ children }) => {
  // Checking if the access token is valid
  const isAuthenticated = isAccessTokenValid();

  // Rendering the Outlet (nested routes) if authenticated, or navigating to the login page if not
  return isAuthenticated ? <Outlet /> : <Navigate to="/login" />;
};

export default PrivateRoute;
