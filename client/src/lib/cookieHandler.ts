/**
 * Unified Cookie Handler for Luxe Travel Client
 *
 * This file centralizes all cookie operations including:
 * - Authentication tokens (token1, token2)
 * - User data caching
 * - City data caching
 * - General cookie utilities
 */

import Cookies from "js-cookie";

// ============================================================================
// TYPES
// ============================================================================

export interface AuthTokens {
  token1: string | null;
  token2: string | null;
}

export interface UserData {
  user_id?: number;
  name?: string;
  email?: string;
  token1?: string;
  token2?: string;
}

export interface CityData {
  city_id: number;
  city_name: string;
}

export interface BusData {
  id: number;
  name: string;
  departureTime: Date;
  origin: string;
  destination: string;
  price: number;
  available_seat: number;
  seat_capacity: number;
}

export interface TicketData {
  ticket_id: number;
  user_id: number;
  bus_id: number;
  no_seat: string;
  total_price: number;
  ticket_code: string;
  created_at: string;
  departure_city: string;
  arrival_city: string;
  bus_name: string;
  has_addons: boolean;
  date: string;
}

// ============================================================================
// GENERAL COOKIE UTILITIES
// ============================================================================

/**
 * Set a cookie with optional expiry in days
 * @param {string} key - Cookie key
 * @param {any} value - Cookie value (will be JSON stringified)
 * @param {number} days - Expiry in days (default: 7)
 */
export const setCookie = (
  key: string,
  value: unknown,
  days: number = 7
): void => {
  const options = {
    expires: days,
    secure: process.env.NODE_ENV === "production",
    sameSite: "Lax" as const,
  };

  Cookies.set(key, JSON.stringify(value), options);
};

/**
 * Get a cookie, attempting to parse JSON
 * @param {string} key - Cookie key
 * @returns {any|null} - Parsed value or null if not found
 */
export const getCookie = (key: string): unknown | null => {
  const val = Cookies.get(key);
  if (!val) return null;

  try {
    return JSON.parse(val);
  } catch {
    return val; // Return as string if JSON parsing fails
  }
};

/**
 * Delete a cookie
 * @param {string} key - Cookie key
 */
export const deleteCookie = (key: string): void => {
  Cookies.remove(key);
};

/**
 * Clear all cookies
 */
export const clearAllCookies = (): void => {
  const cookies = document.cookie.split(";");
  for (const cookie of cookies) {
    const eqPos = cookie.indexOf("=");
    const name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
    deleteCookie(name.trim());
  }
};

// ============================================================================
// AUTHENTICATION TOKEN HANDLING
// ============================================================================

/**
 * Set authentication tokens
 * @param {string} token1 - Bus API token
 * @param {string} token2 - Food API token
 */
export const setAuthTokens = (token1: string, token2: string): void => {
  setCookie("token1", token1, 1); // Token1 expires in 1 day
  setCookie("token2", token2, 1); // Token2 expires in 1 day
};

/**
 * Get authentication tokens
 * @returns {AuthTokens} - Object with token1 and token2
 */
export const getAuthTokens = (): AuthTokens => {
  const token1 = getCookie("token1") as string | null;
  const token2 = getCookie("token2") as string | null;
  return { token1, token2 };
};

/**
 * Clear authentication tokens
 */
export const clearAuthTokens = (): void => {
  deleteCookie("token1");
  deleteCookie("token2");
};

// ============================================================================
// USER DATA CACHING
// ============================================================================

/**
 * Cache user data after successful login
 * @param {UserData} userData - User data object
 */
export const cacheUserData = (userData: UserData): void => {
  setCookie("userData", userData, 1); // Cache for 1 day
};

/**
 * Get cached user data
 * @returns {UserData|null} - Cached user data or null
 */
export const getCachedUserData = (): UserData | null => {
  return getCookie("userData") as UserData | null;
};

/**
 * Clear cached user data
 */
export const clearCachedUserData = (): void => {
  deleteCookie("userData");
};

// ============================================================================
// CITY DATA CACHING (Optimized for frequent use)
// ============================================================================

/**
 * Cache city data after successful fetch
 * @param {CityData[]} cities - Array of city objects
 */
export const cacheCityData = (cities: CityData[]): void => {
  setCookie("cities", cities, 1); // Cache for 1 day (cities rarely change)
};

/**
 * Get cached city data
 * @returns {CityData[]|null} - Cached cities array or null
 */
export const getCachedCityData = (): CityData[] | null => {
  return getCookie("cities") as CityData[] | null;
};

/**
 * Clear cached city data
 */
export const clearCachedCityData = (): void => {
  deleteCookie("cities");
};

// ============================================================================
// BUS DATA CACHING
// ============================================================================

/**
 * Cache bus data after successful fetch
 * @param {BusData[]} buses - Array of bus objects
 */
export const cacheBusData = (buses: BusData[]): void => {
  setCookie("buses", buses, 0.5); // Cache for 12 hours (buses change more frequently)
};

/**
 * Get cached bus data
 * @returns {BusData[]|null} - Cached buses array or null
 */
export const getCachedBusData = (): BusData[] | null => {
  return getCookie("buses") as BusData[] | null;
};

/**
 * Clear cached bus data
 */
export const clearCachedBusData = (): void => {
  deleteCookie("buses");
};

// ============================================================================
// TICKET DATA CACHING
// ============================================================================

/**
 * Cache user tickets data
 * @param {TicketData[]} tickets - Array of ticket objects
 */
export const cacheUserTickets = (tickets: TicketData[]): void => {
  setCookie("userTickets", tickets, 0.5); // Cache for 12 hours
};

/**
 * Get cached user tickets
 * @returns {TicketData[]|null} - Cached tickets array or null
 */
export const getCachedUserTickets = (): TicketData[] | null => {
  return getCookie("userTickets") as TicketData[] | null;
};

/**
 * Clear cached user tickets
 */
export const clearCachedUserTickets = (): void => {
  deleteCookie("userTickets");
};

// ============================================================================
// GENERAL CACHE UTILITIES
// ============================================================================

/**
 * Cache any data with custom expiry
 * @param {string} key - Cache key
 * @param {any} data - Data to cache
 * @param {number} hours - Expiry in hours
 */
export const setCachedData = (
  key: string,
  data: unknown,
  hours: number = 1
): void => {
  setCookie(`cache_${key}`, data, hours / 24); // Convert hours to days
};

/**
 * Get cached data
 * @param {string} key - Cache key
 * @returns {any|null} - Cached data or null
 */
export const getCachedData = (key: string): unknown | null => {
  return getCookie(`cache_${key}`);
};

/**
 * Clear specific cache
 * @param {string} key - Cache key
 */
export const clearCachedData = (key: string): void => {
  deleteCookie(`cache_${key}`);
};

/**
 * Clear all cache data
 */
export const clearAllCache = (): void => {
  const cookies = document.cookie.split(";");
  for (const cookie of cookies) {
    if (cookie.trim().startsWith("cache_")) {
      const key = cookie.trim().split("=")[0];
      deleteCookie(key);
    }
  }
};

// ============================================================================
// LOGOUT UTILITIES
// ============================================================================

/**
 * Clear all user-related data on logout
 */
export const clearAllUserData = (): void => {
  clearAuthTokens();
  clearCachedUserData();
  clearCachedUserTickets();
  // Keep city and bus cache for better UX
};

/**
 * Complete logout - clear everything
 */
export const completeLogout = (): void => {
  clearAllUserData();
  clearAllCache();
};

// ============================================================================
// DEBUG UTILITIES
// ============================================================================

/**
 * Get all cookies for debugging
 * @returns {Object} - All cookies as key-value pairs
 */
export const getAllCookies = (): Record<string, unknown> => {
  const cookies: Record<string, unknown> = {};
  document.cookie.split(";").forEach((cookie) => {
    const [key, value] = cookie.trim().split("=");
    if (key && value) {
      try {
        cookies[key] = JSON.parse(value);
      } catch {
        cookies[key] = value;
      }
    }
  });
  return cookies;
};

/**
 * Log current cookie state for debugging
 */
export const logCookieState = (): void => {
  console.debug("=== COOKIE STATE DEBUG ===");
  console.debug("Auth tokens:", getAuthTokens());
  console.debug("User data:", getCachedUserData());
  console.debug("Cities:", getCachedCityData()?.length || 0, "cities");
  console.debug("Buses:", getCachedBusData()?.length || 0, "buses");
  console.debug("Tickets:", getCachedUserTickets()?.length || 0, "tickets");
  console.debug("All cookies:", getAllCookies());
};
