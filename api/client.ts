import axios from "axios";

const API_URL = process.env.API_URL;
const API_SECRET_KEY = process.env.API_SECRET_KEY;

if (!API_URL || !API_SECRET_KEY) {
  throw new Error("Missing required environment variables: API_URL and/or API_SECRET_KEY");
}

export const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    "X-Internal-API-Secret": API_SECRET_KEY
  }
});
