// src/services/auth.js
import api from "../api";

//***********************************************************
// Function to get user profile details
const getProfileDetails = async () => {
  try {
    const response = await api.get("/user/profile");
    return response.data;
  } catch (error) {
    throw error;
  }
};

//*********************************************************** */
// Function to register a new user
const registerUser = async (p_data) => {
  try {
    const response = await api.post("/user/register", p_data);
    return response.data;
  } catch (error) {
    throw error;
  }
};
//***********************************************************
// Function to update user details
const updateUser = async (p_data) => {
  try {
    const response = await api.post("/user/updateUser", p_data);
    return response.data;
  } catch (error) {
    throw error;
  }
};
//***********************************************************
// Function to reset user password
const resetPassword = async (p_data) => {
  try {
    const response = await api.post("/user/updatePassword", p_data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

//***********************************************************
// Function to perform a generic API command
const fireCommand = async (urlPath, method, data = null) => {
  try {
    const response = await api({
      method,
      url: urlPath,
      data,
    });

    return response.data;
  } catch (error) {
    throw error;
  }
};

//***********************************************************

export {
  getProfileDetails,
  registerUser,
  updateUser,
  resetPassword,
  fireCommand,
};
