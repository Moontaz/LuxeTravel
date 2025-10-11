import { api } from "./axiosInstance";
import { getCachedData, setCachedData } from "@/utils/cookies";
import { handleApiError } from "@/utils/errorHandler";

export interface BusResponse {
  success: boolean;
  data?: unknown;
  error?: unknown;
}

// Get all buses with caching
export const getAllBuses = async (): Promise<BusResponse> => {
  try {
    // Check cache first
    const cached = getCachedData("buses");
    if (cached) {
      return { success: true, data: cached };
    }

    const response = await api.get("/api/bus/buses");

    // Cache the result for 2 hours
    setCachedData("buses", response.data, 2);

    return { success: true, data: response.data };
  } catch (error) {
    const apiError = handleApiError(error);
    return { success: false, error: apiError };
  }
};

// Get bus by ID
export const getBusById = async (
  busId: string | number
): Promise<BusResponse> => {
  try {
    const response = await api.get(`/api/bus/buses/${busId}`);
    return { success: true, data: response.data };
  } catch (error) {
    console.error("Error fetching bus by ID:", error);
    return { success: false, error };
  }
};

// Get all cities with caching (optimized for frequent use)
export const getAllCities = async (): Promise<BusResponse> => {
  try {
    // Check cache first - cities don't change often, cache for 24 hours
    const cached = getCachedData("cities");
    if (cached) {
      return { success: true, data: cached };
    }

    const response = await api.get("/api/bus/cities");

    // Cache the result for 24 hours (cities rarely change)
    setCachedData("cities", response.data, 24);

    return { success: true, data: response.data };
  } catch (error) {
    console.error("Error fetching cities:", error);
    return { success: false, error };
  }
};

// Get booked seats by bus ID
export const getBookedSeatsByBusId = async (
  busId: string | number
): Promise<BusResponse> => {
  try {
    const response = await api.get(`/api/bus/buses/${busId}/seat`);
    return { success: true, data: response.data };
  } catch (error) {
    console.error("Error fetching booked seats:", error);
    return { success: false, error };
  }
};

// Get routes
export const getRoutes = async (): Promise<BusResponse> => {
  try {
    const response = await api.get("/api/bus/routes");
    return { success: true, data: response.data };
  } catch (error) {
    console.error("Error fetching routes:", error);
    return { success: false, error };
  }
};
