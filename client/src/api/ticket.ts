import { api } from "./axiosInstance";

export interface TicketData {
  user_id: number;
  bus_id: number;
  no_seat: string;
  total_price: number;
  date: string;
  bus_name: string;
  departure_city: string;
  destination_city: string;
  hasAddons: boolean;
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
    console.log("=== SENDING TICKET DATA TO SERVER ===", ticketData);

    const response = await api.post("/api/ticket", {
      user_id: ticketData.user_id,
      bus_id: ticketData.bus_id,
      no_seat: ticketData.no_seat,
      total_price: ticketData.total_price,
      date: ticketData.date,
      bus_name: ticketData.bus_name,
      departure_city: ticketData.departure_city,
      destination_city: ticketData.destination_city,
      hasAddons: ticketData.hasAddons,
    });

    console.log("Ticket created successfully:", response.data);
    return { success: true, data: response.data };
  } catch (error) {
    console.error("Error creating ticket:", error);
    return { success: false, error };
  }
};

// Function to get tickets by user ID
export const getTicketsByUserId = async (
  userId: string | number
): Promise<TicketResponse> => {
  try {
    const response = await api.get(`/api/bus/tickets/${userId}`);
    return { success: true, data: response.data };
  } catch (error) {
    console.error("Error fetching tickets:", error);
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
