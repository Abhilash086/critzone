import { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import apiClient from '../services/axiosClient.js';
import { getLoginRoute } from '../utils/routingUtils.js';
import { useUser } from '../context/UserContext.jsx';

// Store CSRF token with persistence
let csrfToken = sessionStorage.getItem('csrf_token');

// Callback to notify component of timeLeft updates
let onTimeLeftUpdate = null;

apiClient.interceptors.response.use((response) => {
  const token = response.headers['x-csrf-token'];
  const timeLeftHeader = response.headers['time-left'];
  if (token) {
    csrfToken = token;
    sessionStorage.setItem('csrf_token', token);
  }
  if (timeLeftHeader && onTimeLeftUpdate) {
    const timeLeft = parseInt(timeLeftHeader);
    onTimeLeftUpdate(timeLeft);
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

// Clear CSRF token on logout
export const clearCsrfToken = () => {
  csrfToken = null;
  sessionStorage.removeItem('csrf_token');
};

// SessionManager Component
const SessionManager = () => {
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [countdown, setCountdown] = useState(30);
  const [warningTimeout, setWarningTimeout] = useState(null);
  const [expiryTimeout, setExpiryTimeout] = useState(null);
  const { user } = useUser();
  const navigate = useNavigate();

  // Handle session expiry - logout and redirect
  const handleSessionExpiry = useCallback(async () => {
    try {
      const { api } = await import('../services/api.js');
      await api.logout();
      clearCsrfToken();
      
      toast.error('Session expired. Please login again.', { duration: 4000 });
      navigate(getLoginRoute(user?.role));
    } catch (error) {
      console.error('Logout failed:', error);
      clearCsrfToken();
      
      toast.error('Session expired. Please login again.', { duration: 4000 });
      navigate(getLoginRoute(user?.role));
    }
  }, [navigate, user?.role]);

  useEffect(() => {
    // Set up the callback to receive timeLeft updates from interceptor
    onTimeLeftUpdate = (timeLeft) => {
      console.log("Time left received:", timeLeft);
      
      // Clear existing timeouts
      if (warningTimeout) {
        clearTimeout(warningTimeout);
        setWarningTimeout(null);
      }
      if (expiryTimeout) {
        clearTimeout(expiryTimeout);
        setExpiryTimeout(null);
      }

      // Schedule notification 30 seconds before expiry
      if (timeLeft > 30) {
        const warningTime = (timeLeft - 30) * 1000;
        
        const wTimeout = setTimeout(() => {
          setCountdown(30);
          setIsNotificationOpen(true);
          
          // Auto-expire after 30 seconds
          const eTimeout = setTimeout(() => {
            setIsNotificationOpen(false);
            handleSessionExpiry();
          }, 30000);
          
          setExpiryTimeout(eTimeout);
        }, warningTime);
        
        setWarningTimeout(wTimeout);
      } else if (timeLeft > 0) {
        // Less than 30 seconds left, show immediately
        setCountdown(timeLeft);
        setIsNotificationOpen(true);
        
        const eTimeout = setTimeout(() => {
          setIsNotificationOpen(false);
          handleSessionExpiry();
        }, timeLeft * 1000);
        
        setExpiryTimeout(eTimeout);
      }
    };

    // Cleanup
    return () => {
      onTimeLeftUpdate = null;
      if (warningTimeout) clearTimeout(warningTimeout);
      if (expiryTimeout) clearTimeout(expiryTimeout);
    };
  }, [warningTimeout, expiryTimeout, handleSessionExpiry]);

  // Live countdown timer
  useEffect(() => {
    if (isNotificationOpen && countdown > 0) {
      const interval = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(interval);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [isNotificationOpen, countdown]);

  const handleExtendSession = async () => {
    setIsNotificationOpen(false);
    if (warningTimeout) {
      clearTimeout(warningTimeout);
      setWarningTimeout(null);
    }
    if (expiryTimeout) {
      clearTimeout(expiryTimeout);
      setExpiryTimeout(null);
    }
    
    try {
      const { api } = await import('../services/api.js');
      await api.refreshToken();
      toast.success('Session extended successfully', { duration: 2000 });
    } catch (error) {
      console.error('Failed to refresh token:', error);
      toast.error('Failed to extend session', { duration: 2000 });
    }
  };

  const handleCancel = () => {
    setIsNotificationOpen(false);
    toast(`Session will expire in ${countdown} seconds`, { 
      icon: '⏱️',
      duration: 2000 
    });
  };

  if (!isNotificationOpen) return null;

  return (
    <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 animate-slide-down">
      <div className="bg-white rounded-lg shadow-2xl border-2 border-orange-400 p-4 min-w-[400px] max-w-lg">
        <div className="flex items-center gap-3">
          <div className="flex-shrink-0">
            <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
              <span className="text-orange-600 text-xl font-bold">{countdown}</span>
            </div>
          </div>
          
          <div className="flex-1">
            <p className="text-gray-900 font-semibold">
              Session expiring in {countdown} seconds
            </p>
            <p className="text-gray-600 text-sm">
              Extend your session to continue?
            </p>
          </div>
          
          <div className="flex gap-2">
            <button
              onClick={handleCancel}
              className="px-3 py-1.5 text-sm bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleExtendSession}
              className="px-3 py-1.5 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
            >
              Extend
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SessionManager;
