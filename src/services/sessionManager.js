import apiClient from "./axiosClient.js";
import { getLoginRoute } from "../utils/routingUtils.js";

// Store CSRF token with persistence
let csrfToken = sessionStorage.getItem('csrf_token');
let sessionWarningTimeout = null;
let sessionExpiryTimeout = null;
let autoRefreshTimeout = null;

// Response interceptor to capture CSRF token from headers
apiClient.interceptors.response.use((response) => {
  const token = response.headers['x-csrf-token'];
  if (token) {
    csrfToken = token;
    sessionStorage.setItem('csrf_token', token);
  }

  // Handle session timeout warning
  const timeLeftHeader = response.headers['time-left'];
  if (timeLeftHeader) {
    const timeLeft = parseInt(timeLeftHeader);
    scheduleSessionManagement(timeLeft);
  }

  return response;
});

// Request interceptor to add CSRF token to headers
apiClient.interceptors.request.use((config) => {
  if (csrfToken) {
    config.headers['X-CSRF-TOKEN'] = csrfToken;
  }
  return config;
});

// Schedule both auto-refresh and session warning
const scheduleSessionManagement = (timeLeft) => {
  // Clear any existing timeouts
  clearAllTimeouts();

  // Schedule auto-refresh 3 minutes before expiry
  if (timeLeft > 180) {
    const refreshTime = (timeLeft - 180) * 1000;
    autoRefreshTimeout = setTimeout(async () => {
      try {
        const { api } = await import('./api.js');
        await api.refreshToken();
        console.log('Session automatically refreshed');
      } catch (error) {
        console.error('Auto-refresh failed, showing warning:', error);
        // If auto-refresh fails, show manual warning
        scheduleSessionWarning(180); // 3 minutes left
      }
    }, refreshTime);
  }

  // Schedule warning 30 seconds before expiry
  if (timeLeft > 30) {
    sessionWarningTimeout = setTimeout(async () => {
      const extend = window.confirm('Your session will expire in 30 seconds. Do you want to extend it?');
      if (extend) {
        try {
          const { api } = await import('./api.js');
          await api.refreshToken();
          // Clear the expiry timeout since session was extended
          if (sessionExpiryTimeout) {
            clearTimeout(sessionExpiryTimeout);
            sessionExpiryTimeout = null;
          }
        } catch (error) {
          console.error('Failed to refresh token:', error);
          alert('Failed to extend session');
        }
      } else {
        // User cancelled, schedule logout after 30 seconds
        scheduleLogout();
      }
    }, (timeLeft - 30) * 1000);
  }
};

// Schedule session warning (used when auto-refresh fails)
const scheduleSessionWarning = (timeLeft) => {
  if (timeLeft > 30 && !sessionWarningTimeout) {
    sessionWarningTimeout = setTimeout(async () => {
      const extend = window.confirm('Your session will expire in 30 seconds. Do you want to extend it?');
      if (extend) {
        try {
          const { api } = await import('./api.js');
          await api.refreshToken();
          if (sessionExpiryTimeout) {
            clearTimeout(sessionExpiryTimeout);
            sessionExpiryTimeout = null;
          }
        } catch (error) {
          console.error('Failed to refresh token:', error);
          alert('Failed to extend session');
        }
      } else {
        scheduleLogout();
      }
    }, (timeLeft - 30) * 1000);
  }
};

// Schedule logout after user cancels extension
const scheduleLogout = () => {
  sessionExpiryTimeout = setTimeout(async () => {
    try {
      const { api } = await import('./api.js');
      const userData = await api.checkAuth();
      const userRole = userData?.role || userData?.details?.role;
      
      await api.logout();
      clearCsrfToken();
      window.location.href = getLoginRoute(userRole);
    } catch (error) {
      console.error('Logout failed:', error);
      // Force redirect even if logout fails
      clearCsrfToken();
      window.location.href = '/';
    }
  }, 30000); // 30 seconds
};

// Clear all session timeouts
const clearAllTimeouts = () => {
  if (sessionWarningTimeout) {
    clearTimeout(sessionWarningTimeout);
    sessionWarningTimeout = null;
  }
  if (sessionExpiryTimeout) {
    clearTimeout(sessionExpiryTimeout);
    sessionExpiryTimeout = null;
  }
  if (autoRefreshTimeout) {
    clearTimeout(autoRefreshTimeout);
    autoRefreshTimeout = null;
  }
};

// Clear CSRF token on logout
export const clearCsrfToken = () => {
  csrfToken = null;
  clearAllTimeouts();
  sessionStorage.removeItem('csrf_token');
};
