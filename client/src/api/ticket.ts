import { api } from "./axiosInstance";
import { getAuthTokens } from "@/lib/cookieHandler";

export interface TicketData {
  user_id: number;
  bus_id: number;
  no_seat: string;
  total_price: number;
  date: string;
  bus_name: string;
  departure_city: string;
  arrival_city: string; // Changed from destination_city to arrival_city
  has_addons: boolean;
}

export interface TicketResponse {
  success: boolean;
  data?: unknown;
  error?: unknown;
}

// Function to create a new ticket
export const createTicket = async (
  ticketData: TicketData
): Promise<TicketResponse> => {
  try {
    // Debug logging for token and payload
    const { token1 } = getAuthTokens();
    console.debug("=== CREATE TICKET DEBUG ===");
    console.debug("Token present:", !!token1);
    console.debug(
      "Token preview:",
      token1 ? `${token1.substring(0, 20)}...` : "No token"
    );
    console.debug("Payload:", ticketData);

    const response = await api.post("/api/bus/ticket", {
      user_id: ticketData.user_id,
      bus_id: ticketData.bus_id,
      no_seat: ticketData.no_seat,
      total_price: ticketData.total_price,
      date: ticketData.date,
      bus_name: ticketData.bus_name,
      departure_city: ticketData.departure_city,
      arrival_city: ticketData.arrival_city, // Changed from destination_city to arrival_city
      has_addons: ticketData.has_addons,
    });

    console.log("Ticket created successfully:", response.data);
    return { success: true, data: response.data };
  } catch (error: unknown) {
    console.error("Error creating ticket:", error);

    // Handle specific error cases
    const errorResponse = error as { response?: { status?: number } };
    if (errorResponse.response?.status === 401) {
      console.error("Authentication failed - redirecting to login");
      // Could trigger redirect to login page here
      return {
        success: false,
        error: { message: "Please login first", code: "AUTH_REQUIRED" },
      };
    } else if (errorResponse.response?.status === 404) {
      console.error("Route mismatch - endpoint not found");
      return {
        success: false,
        error: {
          message: "Service temporarily unavailable",
          code: "ENDPOINT_NOT_FOUND",
        },
      };
    } else if (errorResponse.response?.status === 500) {
      console.error("Server error");
      return {
        success: false,
        error: {
          message: "Server error. Please try again later.",
          code: "SERVER_ERROR",
        },
      };
    }

    return { success: false, error };
  }
};

// Function to get tickets by user ID
export const getTicketsByUserId = async (
  userId: string | number
): Promise<TicketResponse> => {
  try {
    // Debug logging for token
    const { token1 } = getAuthTokens();
    console.debug("=== GET TICKETS DEBUG ===");
    console.debug("Token present:", !!token1);
    console.debug("User ID:", userId);

    const response = await api.get(`/api/bus/tickets/${userId}`);
    return { success: true, data: response.data };
  } catch (error: unknown) {
    console.error("Error fetching tickets:", error);

    // Handle specific error cases
    const errorResponse = error as { response?: { status?: number } };
    if (errorResponse.response?.status === 401) {
      console.error("Authentication failed for getTicketsByUserId");
      return {
        success: false,
        error: { message: "Please login first", code: "AUTH_REQUIRED" },
      };
    } else if (errorResponse.response?.status === 500) {
      console.error("Server error in getTicketsByUserId");
      return {
        success: false,
        error: {
          message: "Server error. Please try again later.",
          code: "SERVER_ERROR",
        },
      };
    }

    return { success: false, error };
  }
};

// Function to get ticket by ID
export const getTicketById = async (
  ticketId: string | number
): Promise<TicketResponse> => {
  try {
    const response = await api.get(`/api/ticket/${ticketId}`);
    return { success: true, data: response.data };
  } catch (error) {
    console.error("Error fetching ticket:", error);
    return { success: false, error };
  }
};

// Function to download ticket (placeholder for future implementation)
export const downloadTicket = async (): Promise<TicketResponse> => {
  try {
    // This would be implemented when PDF generation is ready
    console.log("Download ticket functionality to be implemented");
    return {
      success: true,
      data: "Download functionality not yet implemented",
    };
  } catch (error) {
    console.error("Error downloading ticket:", error);
    return { success: false, error };
  }
};
