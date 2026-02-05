import axios from "axios";

export const apiClient = axios.create({
  baseURL: process.env.API_URL,
  headers: {
    "X-Internal-API-Secret": process.env.API_SECRET_KEY,
    Authorization: `Bearer ${process.env.API_SERVICE_KEY}`
  }
});

export const webClient = axios.create({
  baseURL: process.env.WEB_URL,
  headers: {
    Authorization: `Bearer ${process.env.WEBHOOK_SECRET_KEY}`
  }
});
