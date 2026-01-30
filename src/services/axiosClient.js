import axios from "axios";

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_APP_API_URL,
  headers: {
    "Content-Type": "application/json",
    "x-api-key": import.meta.env.VITE_APP_API_KEY || "",
  },
  withCredentials: true,
});

export default apiClient;
