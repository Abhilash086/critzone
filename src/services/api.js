import apiClient from "./axiosClient.js";
import { clearCsrfToken } from "../components/SessionManager.jsx";

export const api = {
  // Authentication
  login: (data) => apiClient.post("/auth/login", data).then(r => r.data),
  signup: (data) => apiClient.post("/auth/signup", data).then(r => r.data),
  checkAuth: () => apiClient.get("/auth/me").then(r => r.data),
  logout: async () => {
    const response = await apiClient.post("/auth/logout");
    clearCsrfToken();
    return response.data;
  },

  // Authentication - Host (separate endpoints for host registration/login)
  hostSignup: (data) => apiClient.post("/auth/host_signup", data).then(r => r.data),
  hostLogin: (data) => apiClient.post("/auth/host_login", data).then(r => r.data),

  // Authentication - Verification
  resendVerificationMail: () => apiClient.get("/auth/generate_otp").then(r => r.data),
  verifyOtp: (data) => apiClient.post("/auth/verify_otp", data).then(r => r.data),
  refreshToken: () => apiClient.post("/auth/refresh").then(r => r.data),

  // Tournament
  createTournament: (data) => apiClient.post("/tournament/create", data).then(r => r.data),
  getTournaments: () => apiClient.get("/view_tournaments").then(r => r.data),
  updateTournamentStatus: (id, status) => apiClient.put(`/tournament/${id}/update_tournament_status`, { status }).then(r => r.data),
};
