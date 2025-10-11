/**
 * Centralized Error Handling Utility
 * Provides consistent error handling across the application
 */

export interface ApiError {
  message: string;
  status?: number;
  code?: string;
  details?: unknown;
}

export const handleApiError = (error: unknown): ApiError => {
  console.error("API Error:", error);

  if (error && typeof error === "object") {
    const apiError = error as {
      response?: {
        data?: {
          message?: string;
          error?: string;
          code?: string;
        };
        status?: number;
      };
      request?: unknown;
      message?: string;
    };

    // Handle axios errors
    if (apiError.response) {
      return {
        message:
          apiError.response.data?.message ||
          apiError.response.data?.error ||
          "Server error occurred",
        status: apiError.response.status,
        code: apiError.response.data?.code,
        details: apiError.response.data,
      };
    }

    // Handle network errors
    if (apiError.request) {
      return {
        message: "Network error - please check your connection",
        status: 0,
        code: "NETWORK_ERROR",
      };
    }

    // Handle other errors
    if (apiError.message) {
      return {
        message: apiError.message,
        code: "UNKNOWN_ERROR",
      };
    }
  }

  // Fallback for unknown errors
  return {
    message: "An unexpected error occurred",
    code: "UNKNOWN_ERROR",
  };
};

export const showErrorToast = (error: ApiError): void => {
  // This can be integrated with your toast library (e.g., react-hot-toast, sonner)
  console.error("Error Toast:", error.message);

  // Example integration with react-hot-toast:
  // import toast from 'react-hot-toast';
  // toast.error(error.message);
};

export const logError = (context: string, error: unknown): void => {
  console.error(`[${context}] Error:`, error);

  // In production, you might want to send this to an error tracking service
  // like Sentry, LogRocket, or Bugsnag
};

export const isNetworkError = (error: ApiError): boolean => {
  return error.code === "NETWORK_ERROR" || error.status === 0;
};

export const isAuthError = (error: ApiError): boolean => {
  return error.status === 401 || error.status === 403;
};

export const shouldRetry = (error: ApiError): boolean => {
  // Retry on network errors or 5xx server errors
  return (
    isNetworkError(error) || (error.status !== undefined && error.status >= 500)
  );
};
