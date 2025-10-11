import axios from "axios";
import { getAuthTokens } from "@/utils/cookies";

// Create axios instance with global configuration
const api = axios.create({
  baseURL:
    process.env.NEXT_PUBLIC_BUS_URL || "https://luxetravel-server1.vercel.app",
  withCredentials: true,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Create separate instance for food API
const foodApi = axios.create({
  baseURL:
    process.env.NEXT_PUBLIC_FOOD_URL || "https://luxetravel-server2.vercel.app",
  withCredentials: true,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor for adding auth tokens
api.interceptors.request.use(
  (config) => {
    // Add token1 for bus API using centralized cookie utility
    const { token1 } = getAuthTokens();
    if (token1) {
      config.headers.Authorization = `Bearer ${token1}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Request interceptor for food API
foodApi.interceptors.request.use(
  (config) => {
    // Add token2 for food API using centralized cookie utility
    const { token2 } = getAuthTokens();
    if (token2) {
      config.headers.Authorization = `Bearer ${token2}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("API Error:", error);
    return Promise.reject(error?.response?.data || error);
  }
);

foodApi.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("API Error:", error);
    return Promise.reject(error?.response?.data || error);
  }
);

export { api, foodApi };
export default api;
