// utils/fetchWithToken.ts
import { API_URL } from '../config/config';

// Centralized fetch utility function for handling token-based requests
export const fetchWithToken = async (
  url: string, 
  token: string, 
  options: RequestInit = {}
): Promise<any> => {
  try {
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
      ...options.headers, // Allow overriding headers if needed
    };

    const response = await fetch(`${API_URL}${url}`, {
      ...options,
      headers,
    });

    // Check for 401 errors and handle expired tokens
    if (response.status === 401) {
      const errorText = await response.text();
      console.log('Error message from server:', errorText);

      if (errorText.includes('Token has expired')) {
        console.log('Token expired, logging out...');
        logoutUser(); // Implement your logout logic here (clearing token, redirecting, etc.)
      } else {
        console.log('Unauthorized access');
      }

      throw new Error(`Failed request: ${errorText}`);
    }

    // Return response data if successful
    if (response.ok) {
      return await response.json();
    }

    // If response is not OK, throw an error
    const errorText = await response.text();
    throw new Error(`Request failed: ${errorText}`);

  } catch (error) {
    console.error('Error in fetchWithToken:', error);
    throw error;
  }
};

// Utility for logging out the user
export const logoutUser = () => {
  console.log('Logging out the user...');
  localStorage.removeItem('userToken'); // Clear token from storage
  window.location.href = '/login'; // Redirect to login page
};
