/**
 * Standardized error handling for authentication operations
 */

/**
 * Handle authentication errors and return user-friendly messages
 * @param {Error} error - Error object from API call
 * @returns {string} User-friendly error message
 */
export const handleAuthError = (error) => {
  // Check if we have a response from the server
  if (!error.response) {
    return 'Network error. Please check your connection.';
  }

  const status = error.response.status;
  const message = error.response?.data?.message;

  // Handle specific HTTP status codes
  switch (status) {
    case 401:
      return message || 'Invalid credentials. Please try again.';
    
    case 403:
      return message || 'Account not verified. Please check your email.';
    
    case 404:
      return message || 'Account not found.';
    
    case 409:
      return message || 'Account already exists.';
    
    case 422:
      return message || 'Invalid data provided. Please check your input.';
    
    case 429:
      return 'Too many requests. Please try again later.';
    
    case 500:
    case 502:
    case 503:
      return 'Server error. Please try again later.';
    
    default:
      return message || 'Authentication failed. Please try again.';
  }
};

/**
 * Handle session/token related errors
 * @param {Error} error - Error object
 * @returns {string} User-friendly error message
 */
export const handleSessionError = (error) => {
  if (!error.response) {
    return 'Unable to refresh session. Please log in again.';
  }

  const status = error.response.status;

  if (status === 401 || status === 403) {
    return 'Session expired. Please log in again.';
  }

  return 'Session error. Please try again.';
};

/**
 * Handle verification related errors
 * @param {Error} error - Error object
 * @returns {string} User-friendly error message
 */
export const handleVerificationError = (error) => {
  const message = error.response?.data?.message;
  const status = error.response?.status;

  if (status === 400) {
    return message || 'Invalid or expired OTP. Please try again.';
  }

  if (status === 429) {
    return 'Too many attempts. Please wait before trying again.';
  }

  return message || 'Verification failed. Please try again.';
};
