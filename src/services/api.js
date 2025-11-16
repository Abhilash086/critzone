import axios from "axios";

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_APP_API_URL,
  headers: {
    "Content-Type": "application/json",
    "x-api-key": import.meta.env.VITE_APP_API_KEY || "",
  },
  withCredentials: true,
});

// Store CSRF token with persistence
let csrfToken = sessionStorage.getItem('csrf_token');

// Response interceptor to capture CSRF token from headers
apiClient.interceptors.response.use(
  (response) => {
    const token = response.headers['x-csrf-token'];
    if (token) {
      csrfToken = token;
      sessionStorage.setItem('csrf_token', token);
      console.log("✅ CSRF token received and stored");
    }
    return response;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Request interceptor to add CSRF token to headers
apiClient.interceptors.request.use(
  (config) => {
    if (csrfToken) {
      config.headers['X-CSRF-TOKEN'] = csrfToken;
      console.log("✅ CSRF token attached to request:", config.url);
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Clear CSRF token on logout
export const clearCsrfToken = () => {
  csrfToken = null;
  sessionStorage.removeItem('csrf_token');
};

export const api = {
  loginPlayer: async (data) => {
    const response = await apiClient.post("/auth/login", data);
    return response.data;
  },

  signupPlayer: async (data) => {
    const response = await apiClient.post("/auth/signup", data);
    return response.data;
  },

  checkAuth: async () => {
    const response = await apiClient.get("/auth/me");
    return response.data;
  },

  logoutPlayer: async () => {
    const response = await apiClient.post("/auth/logout");
    clearCsrfToken();
    return response.data;
  },

  signupHost: async (data) => {
    const response = await apiClient.post("/auth/host_signup", data);
    return response.data;
  },

  loginHost: async (data) => {
    const response = await apiClient.post("/auth/host_login", data);
    return response.data;
  },
  // Resend verification email for current authenticated user
  resendVerificationMail: async () => {
    const response = await apiClient.get("/auth/generate_otp", {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return response.data;
  },
  verifyOtp: async (data) => {
    const response = await apiClient.post("/auth/verify_otp", data);
    return response.data;
  }
};
