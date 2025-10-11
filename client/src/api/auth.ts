import { api, foodApi } from "./axiosInstance";
import { setAuthTokens, clearAuthTokens } from "@/utils/cookies";

export interface LoginData {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  success: boolean;
  data?: unknown;
  error?: unknown;
}

// Login function for both servers
export const login = async (loginData: LoginData): Promise<AuthResponse> => {
  try {
    const loginDataFood = {
      email: "luxetravel@example.com",
      password: "password123",
    };

    // Login to bus server (token1)
    const response1 = await api.post("/api/auth/login", loginData);

    // Login to food server (token2)
    const response2 = await foodApi.post("/api/auth/login", loginDataFood);

    // Set both tokens using centralized cookie utility
    setAuthTokens(response1.data.token, response2.data.token);

    return { success: true, data: "Login Successful" };
  } catch (error) {
    console.error("Login error:", error);
    return { success: false, error };
  }
};

// Register function
export const register = async (
  registerData: RegisterData
): Promise<AuthResponse> => {
  try {
    const response = await api.post("/api/auth/register", {
      name: registerData.name,
      email: registerData.email,
      password: registerData.password,
    });

    return { success: true, data: response.data };
  } catch (error) {
    console.error("Register error:", error);
    return { success: false, error };
  }
};

// Logout function
export const logout = async (): Promise<AuthResponse> => {
  try {
    // Clear auth tokens using centralized utility
    clearAuthTokens();

    return { success: true, data: "Logged out successfully" };
  } catch (error) {
    console.error("Logout error:", error);
    return { success: false, error };
  }
};

// Get user profile
export const getUserProfile = async (): Promise<AuthResponse> => {
  try {
    const response = await api.get("/api/auth/profile");
    return { success: true, data: response.data };
  } catch (error) {
    console.error("Get user profile error:", error);
    return { success: false, error };
  }
};
