import { api } from "./axiosInstance";

export interface BookingData {
  bus: unknown;
  food: unknown[];
  no_seat: string;
  total_price: number;
  date?: Date;
  passengers?: number;
  origin?: string;
  destination?: string;
  route?: {
    id: string;
    departure_city: string;
    destination_city: string;
  };
  bus_name?: string;
  departure_city?: string;
  destination_city?: string;
}

export interface BookingResponse {
  success: boolean;
  data?: unknown;
  error?: unknown;
}

// Create booking
export const createBooking = async (
  bookingData: BookingData
): Promise<BookingResponse> => {
  try {
    const response = await api.post("/api/booking", bookingData);
    return { success: true, data: response.data };
  } catch (error) {
    console.error("Error creating booking:", error);
    return { success: false, error };
  }
};

// Get booking by user ID
export const getBookingByUserId = async (
  userId: string | number
): Promise<BookingResponse> => {
  try {
    const response = await api.get(`/api/booking/user/${userId}`);
    return { success: true, data: response.data };
  } catch (error) {
    console.error("Error fetching booking:", error);
    return { success: false, error };
  }
};

// Get booking by ID
export const getBookingById = async (
  bookingId: string | number
): Promise<BookingResponse> => {
  try {
    const response = await api.get(`/api/booking/${bookingId}`);
    return { success: true, data: response.data };
  } catch (error) {
    console.error("Error fetching booking by ID:", error);
    return { success: false, error };
  }
};

// Confirm booking
export const confirmBooking = async (
  bookingId: string | number
): Promise<BookingResponse> => {
  try {
    const response = await api.put(`/api/booking/${bookingId}/confirm`);
    return { success: true, data: response.data };
  } catch (error) {
    console.error("Error confirming booking:", error);
    return { success: false, error };
  }
};

// Cancel booking
export const cancelBooking = async (
  bookingId: string | number
): Promise<BookingResponse> => {
  try {
    const response = await api.put(`/api/booking/${bookingId}/cancel`);
    return { success: true, data: response.data };
  } catch (error) {
    console.error("Error canceling booking:", error);
    return { success: false, error };
  }
};
