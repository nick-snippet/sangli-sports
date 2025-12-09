// src/api/index.js
import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

const api = axios.create({
  baseURL: BASE_URL + "/api",
  // we will set Authorization header manually when token is available
});

export default api;
