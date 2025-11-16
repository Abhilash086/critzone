import axios from "axios";

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_APP_API_URL,
  headers: {
    "Content-Type": "application/json",
    "x-api-key": import.meta.env.VITE_APP_API_KEY || "",
  },
  withCredentials: true,
});

function getCookie(name) {
  const raw = document.cookie
    .split(";")
    .map((c) => c.trim())
    .find((c) => c.startsWith(name + "="));
  return raw ? decodeURIComponent(raw.split("=")[1]) : "";
}

// Add an interceptor once
apiClient.interceptors.request.use((config) => {
  const method = (config.method || "get").toLowerCase();
  const needsCsrf = ["post", "put", "patch", "delete"].includes(method);
  if (needsCsrf) {
    const csrf = getCookie("csrf_access");
    if (csrf) {
      config.headers = config.headers || {};
      config.headers["X-CSRF-TOKEN"] = csrf;
    }
  }
  return config;
});

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
