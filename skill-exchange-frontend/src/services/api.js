// 📡 Axios API Configuration
import axios from 'axios';

const BASE_URL = `http://${window.location.hostname}:5000/api`;

const API = axios.create({
  baseURL: BASE_URL,
});

// 🔐 Attach token to every request if available
API.interceptors.request.use((req) => {
  const token = localStorage.getItem('authToken');
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});

export default API;