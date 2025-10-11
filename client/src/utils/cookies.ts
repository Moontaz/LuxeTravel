/**
 * Centralized Cookie Management Utility
 * Handles all cookie operations with consistent interface
 */

// Simple cookie utility functions (no external dependencies)
export const setCookie = (
  key: string,
  value: string | object,
  days: number = 7
): void => {
  const expires = new Date();
  expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);

  const cookieValue = typeof value === "string" ? value : JSON.stringify(value);
  document.cookie = `${key}=${cookieValue}; expires=${expires.toUTCString()}; path=/; SameSite=Lax`;
};

export const getCookie = (key: string): string | null => {
  const nameEQ = key + "=";
  const ca = document.cookie.split(";");

  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) === " ") c = c.substring(1, c.length);
    if (c.indexOf(nameEQ) === 0) {
      const value = c.substring(nameEQ.length, c.length);
      try {
        // Try to parse as JSON, fallback to string
        return JSON.parse(value);
      } catch {
        return value;
      }
    }
  }
  return null;
};

export const deleteCookie = (key: string): void => {
  document.cookie = `${key}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
};

export const clearAllCookies = (): void => {
  const cookies = document.cookie.split(";");
  for (let cookie of cookies) {
    const eqPos = cookie.indexOf("=");
    const name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
    deleteCookie(name.trim());
  }
};

// Specific cookie helpers for the application
export const setAuthTokens = (token1: string, token2: string): void => {
  setCookie("token1", token1, 1); // 1 day expiry
  setCookie("token2", token2, 1);
};

export const getAuthTokens = (): {
  token1: string | null;
  token2: string | null;
} => {
  return {
    token1: getCookie("token1"),
    token2: getCookie("token2"),
  };
};

export const clearAuthTokens = (): void => {
  deleteCookie("token1");
  deleteCookie("token2");
};

// Cache management for API data
export const setCachedData = (
  key: string,
  data: unknown,
  hours: number = 1
): void => {
  const cacheData = {
    data,
    timestamp: Date.now(),
    expiry: hours * 60 * 60 * 1000, // Convert hours to milliseconds
  };
  setCookie(`cache_${key}`, cacheData, 1);
};

export const getCachedData = (key: string): unknown | null => {
  const cached = getCookie(`cache_${key}`);
  if (!cached || typeof cached !== "object") return null;

  const { data, timestamp, expiry } = cached as any;
  const now = Date.now();

  // Check if cache is expired
  if (now - timestamp > expiry) {
    deleteCookie(`cache_${key}`);
    return null;
  }

  return data;
};

export const clearCache = (key?: string): void => {
  if (key) {
    deleteCookie(`cache_${key}`);
  } else {
    // Clear all cache cookies
    const cookies = document.cookie.split(";");
    for (let cookie of cookies) {
      if (cookie.trim().startsWith("cache_")) {
        const key = cookie.trim().split("=")[0];
        deleteCookie(key);
      }
    }
  }
};
