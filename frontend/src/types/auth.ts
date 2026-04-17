export type AuthUser = {
  id: string;
  name: string;
  email: string;
  photoBase64?: string | null;
  createdAt?: string;
  updatedAt?: string;
};

export type LoginPayload = {
  email: string;
  password: string;
};

export type RegisterPayload = {
  name: string;
  email: string;
  password: string;
};

export type LoginResponse = {
  user: AuthUser;
  access_token: string;
};

export type RegisterResponse = LoginResponse;
