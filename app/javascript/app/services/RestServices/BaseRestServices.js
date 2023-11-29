import axios from "axios";
export const baseUrl = window.location.origin;

export const ApiClient = axios.create({
  baseURL: `${baseUrl}/api/`,
  timeout: 4000,
  headers:{
    'Cache-Control': 'no-cache',
    'Pragma': 'no-cache',
    'Expires': '0'
  }
  
});


