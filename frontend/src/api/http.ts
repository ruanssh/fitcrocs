import axios from 'axios';
import { env } from '../config/env';
import { getAccessToken } from './token';

export const http = axios.create({
  baseURL: env.apiBaseUrl,
});

http.interceptors.request.use((config) => {
  const token = getAccessToken();

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});
