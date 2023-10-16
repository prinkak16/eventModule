import axios from "axios";
export const baseUrl = window.location.origin;

export const ApiClient = axios.create({
  baseURL: `${baseUrl}/api/`,
  timeout: 4000,
  headers: {
    "X-CSRF-Token": document.querySelector("meta[name='csrf-token']"),
  },
  withCredentials: true,
});
