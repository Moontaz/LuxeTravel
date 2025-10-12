import { useEffect, useRef } from "react";
import { setupTokenMonitoring, checkTokensAndLogout } from "@/lib/tokenUtils";

/**
 * Hook untuk monitoring token expiration dan auto logout
 * @param onExpiration - Callback ketika token expired
 * @param checkInterval - Interval untuk mengecek token (dalam ms)
 */
export const useTokenMonitoring = (
  onExpiration?: () => void,
  checkInterval: number = 30000 // Check every 30 seconds
) => {
  const cleanupRef = useRef<(() => void) | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Skip on server side (Vercel compatibility)
  if (typeof window === "undefined") {
    return { checkTokens: () => false };
  }

  useEffect(() => {
    // Initial check
    if (checkTokensAndLogout()) {
      return; // Already logged out
    }

    // Setup token monitoring
    cleanupRef.current = setupTokenMonitoring(onExpiration);

    // Setup periodic check as backup
    intervalRef.current = setInterval(() => {
      if (checkTokensAndLogout()) {
        // Cleanup if logged out
        if (cleanupRef.current) {
          cleanupRef.current();
        }
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
        }
      }
    }, checkInterval);

    // Cleanup function
    return () => {
      if (cleanupRef.current) {
        cleanupRef.current();
      }
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [onExpiration, checkInterval]);

  return {
    checkTokens: checkTokensAndLogout,
  };
};
