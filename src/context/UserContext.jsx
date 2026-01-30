import React, { createContext, useContext, useEffect, useState } from "react";
import { api } from "../services/api";

export const UserContext = createContext();

const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAuthCheck = async () => {
      try {
        const res = await api.checkAuth();
        const userData = res.details || res.user || res;
        userData.role = res?.role || userData.role;
        setUser(userData);
        setIsAuthenticated(true);
      } catch (error) {
        // Interceptor already handles 401s silently
        setUser(null);
        setIsAuthenticated(false);
      } finally {
        setLoading(false);
      }
    };
    fetchAuthCheck();
  }, []);

  return (
    <UserContext.Provider
      value={{
        user,
        setUser,
        isAuthenticated,
        setIsAuthenticated,
        loading,
        setLoading,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);

export default UserProvider;
