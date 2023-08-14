import axios from "axios";

const axiosInstance = axios.create({
  baseURL: process.env.SERVER_URI || "http://localhost:4000",
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

export default axiosInstance;
