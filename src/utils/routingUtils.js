/**
 * Centralized routing utilities for role-based navigation
 */

/**
 * Get the appropriate dashboard route based on user role
 * @param {Object} user - User object containing role and _id
 * @returns {string} Dashboard route path
 */
export const getDashboardRoute = (user) => {
  if (!user) return '/';
  
  if (user.role === 'host') {
    return `/host/${user._id}/dashboard`;
  }
  
  if (user.role === 'player') {
    return `/player/${user._id}/dashboard`;
  }
  
  // Default fallback for unknown roles
  return '/';
};

/**
 * Get the appropriate login route based on role
 * @param {string} role - User role ('host' or 'player')
 * @returns {string} Login route path
 */
export const getLoginRoute = (role) => {
  if (role === 'host') {
    return '/access/hp-portal';
  }
  
  if (role === 'player') {
    return '/login';
  }
  
  // Default to home for unknown roles
  return '/';
};

/**
 * Check if a user has access to a specific role-based route
 * @param {Object} user - User object containing role
 * @param {Array<string>} allowedRoles - Array of allowed roles
 * @returns {boolean} Whether user has access
 */
export const hasRoleAccess = (user, allowedRoles) => {
  if (!user || !allowedRoles || allowedRoles.length === 0) {
    return false;
  }
  
  return allowedRoles.includes(user.role);
};
