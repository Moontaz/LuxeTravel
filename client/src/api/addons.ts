import { foodApi } from "./axiosInstance";

export interface AddonResponse {
  success: boolean;
  data?: unknown;
  error?: unknown;
}

// Get food menu
export const getFoodMenu = async (): Promise<AddonResponse> => {
  try {
    const response = await foodApi.get("/api/food/menu");
    return { success: true, data: response.data };
  } catch (error) {
    console.error("Error fetching food menu:", error);
    return { success: false, error };
  }
};

// Get addon order by ticket code
export const getAddonOrder = async (
  ticketCode: string
): Promise<AddonResponse> => {
  try {
    const response = await foodApi.get(`/api/food/getorder/${ticketCode}`);
    return { success: true, data: response.data };
  } catch (error) {
    console.error("Error fetching addon order:", error);
    return { success: false, error };
  }
};

// Create addon order
export const createAddonOrder = async (
  orderData: unknown
): Promise<AddonResponse> => {
  try {
    const response = await foodApi.post("/api/food/order", orderData);
    return { success: true, data: response.data };
  } catch (error) {
    console.error("Error creating addon order:", error);
    return { success: false, error };
  }
};

// Update addon order
export const updateAddonOrder = async (
  orderId: string | number,
  orderData: unknown
): Promise<AddonResponse> => {
  try {
    const response = await foodApi.put(`/api/food/order/${orderId}`, orderData);
    return { success: true, data: response.data };
  } catch (error) {
    console.error("Error updating addon order:", error);
    return { success: false, error };
  }
};

// Delete addon order
export const deleteAddonOrder = async (
  orderId: string | number
): Promise<AddonResponse> => {
  try {
    const response = await foodApi.delete(`/api/food/order/${orderId}`);
    return { success: true, data: response.data };
  } catch (error) {
    console.error("Error deleting addon order:", error);
    return { success: false, error };
  }
};
