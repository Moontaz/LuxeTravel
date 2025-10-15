import { api } from "./axiosInstance";

export interface UserProfile {
  name: string;
  email: string;
  gender?: string;
  phone?: string;
  address?: string;
}

export interface UserResponse {
  success: boolean;
  data?: unknown;
  error?: unknown;
}

// Update user profile
export const updateUserProfile = async (
  profileData: UserProfile
): Promise<UserResponse> => {
  try {
    const response = await api.put("/api/user/profile", profileData);
    return { success: true, data: response.data };
  } catch (error) {
    console.error("Error updating user profile:", error);
    return { success: false, error };
  }
};

// Get user tickets
export const getUserTickets = async (): Promise<UserResponse> => {
  try {
    const response = await api.get("/api/user/tickets");
    return { success: true, data: response.data };
  } catch (error) {
    console.error("Error fetching user tickets:", error);
    return { success: false, error };
  }
};

// Get user bookings
export const getUserBookings = async (): Promise<UserResponse> => {
  try {
    const response = await api.get("/api/user/bookings");
    return { success: true, data: response.data };
  } catch (error) {
    console.error("Error fetching user bookings:", error);
    return { success: false, error };
  }
};

// Change password
export const changePassword = async (
  currentPassword: string,
  newPassword: string
): Promise<UserResponse> => {
  try {
    const response = await api.put("/api/user/change-password", {
      currentPassword,
      newPassword,
    });
    return { success: true, data: response.data };
  } catch (error) {
    console.error("Error changing password:", error);
    return { success: false, error };
  }
};

// Delete user account
export const deleteUserAccount = async (): Promise<UserResponse> => {
  try {
    const response = await api.delete("/api/user/account");
    return { success: true, data: response.data };
  } catch (error) {
    console.error("Error deleting user account:", error);
    return { success: false, error };
  }
};
