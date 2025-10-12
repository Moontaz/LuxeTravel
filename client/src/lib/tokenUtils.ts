import { jwtDecode } from "jwt-decode";
import {
  getAuthTokens,
  clearAuthTokens,
  clearAllUserData,
} from "./cookieHandler";

export interface DecodedToken {
  id: number;
  name: string;
  email: string;
  iat: number;
  exp: number;
}

/**
 * Check if token is expired
 * @param token - JWT token string
 * @returns boolean - true if expired, false if valid
 */
export const isTokenExpired = (token: string): boolean => {
  try {
    const decoded: DecodedToken = jwtDecode(token);
    const currentTime = Math.floor(Date.now() / 1000);
    return decoded.exp < currentTime;
  } catch (error) {
    console.error("Error decoding token:", error);
    return true; // Consider invalid token as expired
  }
};

/**
 * Check if any auth token is expired
 * @returns boolean - true if any token is expired
 */
export const isAnyTokenExpired = (): boolean => {
  const { token1, token2 } = getAuthTokens();

  if (token1 && isTokenExpired(token1)) {
    console.log("Token1 is expired");
    return true;
  }

  if (token2 && isTokenExpired(token2)) {
    console.log("Token2 is expired");
    return true;
  }

  return false;
};

/**
 * Get time until token expires in milliseconds
 * @param token - JWT token string
 * @returns number - milliseconds until expiration, or 0 if expired
 */
export const getTimeUntilExpiration = (token: string): number => {
  try {
    const decoded: DecodedToken = jwtDecode(token);
    const currentTime = Math.floor(Date.now() / 1000);
    const timeUntilExpiration = (decoded.exp - currentTime) * 1000;
    return Math.max(0, timeUntilExpiration);
  } catch (error) {
    console.error("Error decoding token:", error);
    return 0;
  }
};

/**
 * Perform auto logout when tokens are expired
 */
export const performAutoLogout = (): void => {
  console.log("Performing auto logout due to token expiration");

  // Clear all user data
  clearAllUserData();

  // Clear cookies
  clearAuthTokens();

  // Redirect to login page
  if (typeof window !== "undefined") {
    window.location.href = "/auth";
  }
};

/**
 * Check tokens and perform auto logout if needed
 * @returns boolean - true if logout was performed, false if tokens are still valid
 */
export const checkTokensAndLogout = (): boolean => {
  if (isAnyTokenExpired()) {
    performAutoLogout();
    return true;
  }
  return false;
};

/**
 * Set up token expiration monitoring
 * @param onExpiration - Callback when token expires
 * @returns cleanup function
 */
export const setupTokenMonitoring = (
  onExpiration?: () => void
): (() => void) => {
  // Check if we're in browser environment (Vercel compatibility)
  if (typeof window === "undefined") {
    return () => {};
  }

  const { token1, token2 } = getAuthTokens();

  let timeoutId: NodeJS.Timeout | null = null;

  const scheduleLogout = () => {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }

    // Find the earliest expiration time
    let earliestExpiration = Infinity;

    if (token1) {
      const timeUntilExp1 = getTimeUntilExpiration(token1);
      if (timeUntilExp1 > 0) {
        earliestExpiration = Math.min(earliestExpiration, timeUntilExp1);
      }
    }

    if (token2) {
      const timeUntilExp2 = getTimeUntilExpiration(token2);
      if (timeUntilExp2 > 0) {
        earliestExpiration = Math.min(earliestExpiration, timeUntilExp2);
      }
    }

    if (earliestExpiration !== Infinity && earliestExpiration > 0) {
      // Schedule logout 1 minute before expiration
      const logoutTime = Math.max(0, earliestExpiration - 60000);

      timeoutId = setTimeout(() => {
        console.log("Token expiration detected, performing auto logout");
        if (onExpiration) {
          onExpiration();
        } else {
          performAutoLogout();
        }
      }, logoutTime);

      console.log(
        `Auto logout scheduled in ${Math.round(logoutTime / 1000)} seconds`
      );
    }
  };

  // Initial check
  if (checkTokensAndLogout()) {
    return () => {}; // Already logged out
  }

  // Schedule logout
  scheduleLogout();

  // Return cleanup function
  return () => {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
  };
};
