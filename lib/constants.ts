/**
 * API Endpoints Constants
 * 
 * All API endpoint paths should be defined here.
 * The base URL is configured via NEXT_PUBLIC_API_URL environment variable.
 */

// Base URL from environment variable
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "";

// Authentication endpoints
export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: "/api/auth/login.php",
    REFRESH: "/api/auth/refresh.php", // Add when refresh endpoint is available
    LOGOUT: "/api/auth/logout.php", // Add when logout endpoint is available
  },
  // Add more endpoint categories here as needed
  // USERS: {
  //   LIST: "/api/users/list.php",
  //   CREATE: "/api/users/create.php",
  // },
} as const;

/**
 * Helper function to build full API URL
 */
export const getApiUrl = (endpoint: string): string => {
  if (!API_BASE_URL) {
    throw new Error("NEXT_PUBLIC_API_URL is not configured. Please set it in your .env.local file.");
  }
  // Remove trailing slash from base URL if present
  const baseUrl = API_BASE_URL.replace(/\/$/, "");
  // Ensure endpoint starts with /
  const path = endpoint.startsWith("/") ? endpoint : `/${endpoint}`;
  const fullUrl = `${baseUrl}${path}`;
  return fullUrl;
};
