// src/services/api.js
import axios from "axios";
import {
  getAccessToken,
  isAccessTokenValid,
  getRefreshToken,
  setAccessToken,
} from "./commands/auth";
import { useNavigate } from "react-router-dom";

//***********************************************************************************************
// Base URL for the API
const API_BASE_URL = "http://localhost:5000/api";

//*********************************************************************************************** */
// Creating an instance of axios with custom configurations
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

//***********************************************************************************************
// Add a request interceptor to set the authorization header before each request
api.interceptors.request.use(
  async (config) => {
    if (!config.headers["Authorization"] && isAccessTokenValid()) {
      // If the Authorization header is not present and the access token is valid,
      // set the Authorization header
      config.headers["Authorization"] = `Bearer ${getAccessToken()}`;
    } else if (!isAccessTokenValid() && config.url == "/auth/refresh") {
      // If access token is not valid and the request is for refreshing the token,
      // set the Authorization header with the refresh token
      config.headers["Authorization"] = `Bearer ${getRefreshToken()}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

//***********************************************************************************************
// Add a response interceptor
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    // const navigate = useNavigate();

    // If the error status is 401 and there is no originalRequest._retry flag,
    // it means the token has expired and we need to refresh it
    // not allow login and refresh command
    if (
      error.response.status === 401 &&
      !originalRequest._retry &&
      originalRequest.url !== "/auth/login" &&
      originalRequest.url !== "/auth/refresh"
    ) {
      originalRequest._retry = true;

      try {
        const response = await api.post("/auth/refresh", null);
        const { access_token } = response.data;

        // Update the access token in the storage
        setAccessToken(access_token);

        // Retry the original request with the new token
        originalRequest.headers.Authorization = `Bearer ${access_token}`;
        return axios(originalRequest);
      } catch (error) {
        const navigate = useNavigate();
        navigate("/login");
      }
    }

    return Promise.reject(error);
  }
);
//***********************************************************************************************

export default api;
