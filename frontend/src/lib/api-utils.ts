import { AxiosError } from "axios";

/**
 * Parses the error to return a user-friendly message.
 * Hides backend 500 errors behind a generic message.
 */
export const getApiErrorMessage = (error: unknown): string => {
  if (error instanceof AxiosError) {
    // If it's a server error (500 range), show generic message
    if (error.response && error.response.status >= 500) {
      return "Something went wrong. Please try again later.";
    }
    // Otherwise show the backend message if available
    return error.response?.data?.message || "An error occurred.";
  }
  
  if (error instanceof Error) {
    return error.message;
  }
  
  return "An unexpected error occurred.";
};
