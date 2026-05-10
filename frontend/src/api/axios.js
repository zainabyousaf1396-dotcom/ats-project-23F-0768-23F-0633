import axios from 'axios';

const API = axios.create({
  baseURL: 'ats-project-23f-0768-23f-0633-production.up.railway.app',
});

API.interceptors.request.use((req) => {
  const token = localStorage.getItem('token');
  if (token) req.headers.Authorization = `Bearer ${token}`;
  return req;
});

export default API;