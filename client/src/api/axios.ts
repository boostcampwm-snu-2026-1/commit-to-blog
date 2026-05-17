import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('github_token');
  if (token) {
    config.headers['x-github-token'] = token;
  }
  return config;
});

export default api;
