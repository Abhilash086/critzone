import { useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import { api } from '../services/api';
import { getDashboardRoute, getLoginRoute } from '../utils/routingUtils';
import { handleAuthError } from '../utils/errorHandler';

export const useAuth = () => {
    const { setUser, setIsAuthenticated } = useUser();
    const navigate = useNavigate();
    
    const login = async (data) => {
        try {
            const res = await api.login(data);
            const userData = res.details || res.user || res;
            userData.role = res?.role || userData.role;
            
            setUser(userData);
            setIsAuthenticated(true);
            
            // Auto-navigate to appropriate dashboard
            navigate(getDashboardRoute(userData));
            
            return res;
        } catch (error) {
            const errorMessage = handleAuthError(error);
            throw new Error(errorMessage);
        }
    };
    
    const signup = async (data) => {
        try {
            const res = await api.signup(data);
            return res;
        } catch (error) {
            const errorMessage = handleAuthError(error);
            throw new Error(errorMessage);
        }
    };
    
    const logout = async () => {
        try {
            const res = await api.logout();
            setUser(null);
            setIsAuthenticated(false);
            
            // Navigate to home after logout
            navigate('/');
            
            return res;
        } catch (error) {
            // Even if logout fails, clear local state
            setUser(null);
            setIsAuthenticated(false);
            navigate('/');
            throw error;
        }
    };
    
    const hostLogin = async (data) => {
        try {
            const res = await api.hostLogin(data);
            const userData = res.details || res.user || res;
            userData.role = res?.role || userData.role;
            
            setUser(userData);
            setIsAuthenticated(true);
            
            // Auto-navigate to host dashboard
            navigate(getDashboardRoute(userData));
            
            return res;
        } catch (error) {
            const errorMessage = handleAuthError(error);
            throw new Error(errorMessage);
        }
    };
    
    const hostSignup = async (data) => {
        try {
            const res = await api.hostSignup(data);
            return res;
        } catch (error) {
            const errorMessage = handleAuthError(error);
            throw new Error(errorMessage);
        }
    };
    
    const checkAuth = async () => {
        try {
            const res = await api.checkAuth();
            const userData = res.details || res.user || res;
            userData.role = res?.role || userData.role;
            
            setUser(userData);
            setIsAuthenticated(true);
            
            return res;
        } catch (error) {
            setUser(null);
            setIsAuthenticated(false);
            throw error;
        }
    };
    
    return { login, signup, logout, hostLogin, hostSignup, checkAuth };
};
