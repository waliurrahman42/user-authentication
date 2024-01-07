// src/services/auth.js
import api from "../api";
import { jwtDecode, InvalidTokenError } from "jwt-decode";

//***********************************************************
// Function to set the access token in local storage
const setAccessToken = (p_token) => {
  localStorage.setItem("access_token", p_token);
};

//***********************************************************
// Function to set the refresh token in local storage
const setRefreshToken = (p_token) => {
  localStorage.setItem("refresh_token", p_token);
};

//***********************************************************
// Function to get the refresh token from local storage
const getRefreshToken = () => {
  return localStorage.getItem("refresh_token");
};

//***********************************************************
// Function to remove the refresh token from local storage
const removeRefreshToken = () => {
  localStorage.removeItem("refresh_token");
};

//***********************************************************
// Function to get the access token from local storage
const getAccessToken = () => {
  return localStorage.getItem("access_token");
};

//***********************************************************
// Function to remove the access token from local storage
const removeAccessToken = () => {
  localStorage.removeItem("access_token");
};

//***********************************************************
// Function to handle user login
const login = async (credentials) => {
  try {
    const response = await api.post("/auth/login", credentials);
    const { access_token, refresh_token } = response.data;
    // Set the access and refresh tokens in local storage
    setAccessToken(access_token);
    setRefreshToken(refresh_token);
    return true;
  } catch (error) {
    throw error;
  }
};

//***********************************************************
// Function to handle user logout
const logout = async () => {
  try {
    await api.post("/auth/logout");
  } catch (error) {
    throw error;
  } finally {
    // Remove both access and refresh tokens from local storage
    removeAccessToken();
    removeRefreshToken();
  }
};

//***********************************************************
// Function to check if the access token is valid
const isAccessTokenValid = () => {
  const accessToken = getAccessToken();

  if (!accessToken) {
    // Access token not present, consider it invalid
    return false;
  }

  try {
    // Decode the access token
    const decodedToken = jwtDecode(accessToken);

    // Check if the token is expired
    const isTokenExpired = decodedToken.exp < Date.now() / 1000;
    if (isTokenExpired) {
      // Remove the expired access token
      removeAccessToken();
      return false;
    }

    return true;
  } catch (error) {
    if (error instanceof InvalidTokenError) {
      console.error("Error decoding token:", error);
    } else {
      console.error("Error decoding token:", error);
    }
    return false;
  }
};

//***********************************************************
// const refreshAccessToken = async () => {
//   try {
//     const refresh_token = getRefreshToken();

//     if (!refresh_token) {
//       // Handle the case where refresh token is not available
//       throw new Error("Refresh token not available");
//     }

//     // Send a request to the /auth/refresh endpoint on your server
//     const response = await api.post("/auth/refresh", {
//     headers: { 'Content-Type': 'application/json', "Authorization": refresh_token  }}
//     );

//     // Update the access token in local storage
//     const { access_token } = response.data;
//     setAccessToken(access_token);

//     return access_token;
//   } catch (error) {
//     // Handle errors, for example, log out the user if refresh fails
//     console.error("Error refreshing access token:", error);

//     // Log out the user and clear tokens
//     removeAccessToken();
//     removeRefreshToken();

//     throw error; // Propagate the error to the caller
//   }
// };
//***********************************************************
export {
  login,
  logout,
  getAccessToken,
  isAccessTokenValid,
  getRefreshToken,
  setAccessToken,
};
