import { api } from './fetcher';

// ─── Types ────────────────────────────────────────────────────────

export interface RegisterPayload {
  fullName: string;
  email: string;
  phone: string;
  password: string;
  role?: 'user' | 'volunteer' | 'police';
}

export interface VerifyOtpPayload {
  identifier: string;
  otp: string;
  purpose: 'register' | 'login' | 'reset' | 'verify';
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface AuthUser {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  role: string;
  isVerified: boolean;
}

export interface LoginResponse {
  user: AuthUser;
  tokens: AuthTokens;
}

// ─── API calls ────────────────────────────────────────────────────

export const authApi = {
  register: (payload: RegisterPayload) =>
    api.post<{ userId: string }>('/auth/register', payload),

  verifyOtp: (payload: VerifyOtpPayload) =>
    api.post<{ verified: boolean }>('/auth/verify-otp', payload),

  login: (payload: LoginPayload) =>
    api.post<LoginResponse>('/auth/login', payload),

  refreshToken: (refreshToken: string) =>
    api.post<AuthTokens>('/auth/refresh', { refreshToken }),

  logout: () =>
    api.post<void>('/auth/logout'),
};
