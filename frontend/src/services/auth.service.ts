import { http } from '../api/http';
import type {
  AuthUser,
  LoginPayload,
  LoginResponse,
  RegisterPayload,
  RegisterResponse,
} from '../types/auth';

export async function login(payload: LoginPayload) {
  const { data } = await http.post<LoginResponse>('/auth/login', payload);
  return data;
}

export async function register(payload: RegisterPayload) {
  const { data } = await http.post<RegisterResponse>('/auth/register', payload);
  return data;
}

export async function getMe() {
  const { data } = await http.get<AuthUser>('/users/me');
  return data;
}
