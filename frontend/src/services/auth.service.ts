import { http } from '../api/http';
import type { LoginPayload, LoginResponse } from '../types/auth';

export async function login(payload: LoginPayload) {
  const { data } = await http.post<LoginResponse>('/auth/login', payload);
  return data;
}

export async function getMe() {
  const { data } = await http.get('/users/me');
  return data;
}
