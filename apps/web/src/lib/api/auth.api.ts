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

export interface ResendOtpPayload {
  identifier: string;
  purpose: 'register' | 'login' | 'reset' | 'verify';
}

// ─── API calls ────────────────────────────────────────────────────

export const authApi = {
  register: (payload: RegisterPayload) =>
    api.post<{ maskedEmail: string; maskedPhone: string }>('/auth/register', payload),

  verifyOtp: (payload: VerifyOtpPayload) =>
    api.post<{ user: AuthUser; accessToken: string }>('/auth/verify-otp', payload),

  login: (payload: LoginPayload) =>
    api.post<{ maskedEmail: string; requiresOTP: boolean }>('/auth/login', payload),

  refreshToken: (refreshToken: string) =>
    api.post<{ accessToken: string }>('/auth/refresh', { refreshToken }),

  logout: () =>
    api.post<null>('/auth/logout'),

  resendOtp: (payload: ResendOtpPayload) =>
    api.post<{ maskedEmail: string }>('/auth/resend-otp', payload),

  getMe: () =>
    api.get<AuthUser>('/auth/me'),
};
