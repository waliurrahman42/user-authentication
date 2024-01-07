// src/services/auth.js
import api from "../api";


// Function to initiate a forgot password command
const forgot_passwordCommand = async (p_urlPath, p_data) => {
    try {
       // Making a POST request to the specified URL with the provided data
      const response = await api.post(p_urlPath, p_data, {
        withCredentials: true,
      });
      // Returning the response data
      return response.data;
    } catch (error) {
      throw error;
    }
  };


export { forgot_passwordCommand };
