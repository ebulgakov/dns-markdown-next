import axios from "axios";

export const apiClient = axios.create({
  baseURL: process.env.API_URL,
  headers: {
    "X-Internal-API-Secret": process.env.API_SECRET_KEY,
    Authorization: `Bearer ${process.env.API_SERVICE_SECRET}`
  }
});
