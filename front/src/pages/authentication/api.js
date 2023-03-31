import axios from "axios";
import { getToken } from "./auth";

const BASE_URL = process.env.REACT_APP_BASE_URL + "/api/";

const api = axios.create({
  baseURL: BASE_URL
});

api.defaults.headers.common["Content-Type"] = "application/json"

api.interceptors.request.use(async config => {
  const token = getToken();
  if (token) {
    config.headers.Authorization = `Token ${token}`;
  }
  return config;
});

export default api;