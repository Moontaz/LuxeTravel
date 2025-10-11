import { api } from "./axiosInstance";

export interface PaymentData {
  booking_id: string | number;
  amount: number;
  payment_method: string;
  payment_details?: unknown;
}

export interface PaymentResponse {
  success: boolean;
  data?: unknown;
  error?: unknown;
}

// Process payment
export const processPayment = async (
  paymentData: PaymentData
): Promise<PaymentResponse> => {
  try {
    const response = await api.post("/api/payment/process", paymentData);
    return { success: true, data: response.data };
  } catch (error) {
    console.error("Error processing payment:", error);
    return { success: false, error };
  }
};

// Verify payment
export const verifyPayment = async (
  paymentId: string | number
): Promise<PaymentResponse> => {
  try {
    const response = await api.get(`/api/payment/verify/${paymentId}`);
    return { success: true, data: response.data };
  } catch (error) {
    console.error("Error verifying payment:", error);
    return { success: false, error };
  }
};

// Get payment status
export const getPaymentStatus = async (
  paymentId: string | number
): Promise<PaymentResponse> => {
  try {
    const response = await api.get(`/api/payment/status/${paymentId}`);
    return { success: true, data: response.data };
  } catch (error) {
    console.error("Error fetching payment status:", error);
    return { success: false, error };
  }
};

// Refund payment
export const refundPayment = async (
  paymentId: string | number
): Promise<PaymentResponse> => {
  try {
    const response = await api.post(`/api/payment/refund/${paymentId}`);
    return { success: true, data: response.data };
  } catch (error) {
    console.error("Error refunding payment:", error);
    return { success: false, error };
  }
};
