/**
 * Core fetch wrapper for all RakshaAI API calls.
 * - Injects Bearer token from localStorage
 * - Centralised error handling
 * - Typed generic responses
 * - NO Axios — native Fetch API only
 */

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:5000/api';

export interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data?: T;
  errors?: unknown[];
  timestamp: string;
}

export class ApiError extends Error {
  constructor(
    message: string,
    public readonly statusCode: number,
    public readonly body?: unknown
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

function getToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('access_token');
}

type FetchOptions = Omit<RequestInit, 'body'> & {
  body?: unknown;
};

export async function fetcher<T>(
  path: string,
  options: FetchOptions = {}
): Promise<ApiResponse<T>> {
  const token = getToken();
  const { body, ...rest } = options;

  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...((options.headers as Record<string, string>) ?? {}),
  };

  const response = await fetch(`${API_BASE}${path}`, {
    ...rest,
    headers,
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

  let data: ApiResponse<T>;
  try {
    data = (await response.json()) as ApiResponse<T>;
  } catch {
    throw new ApiError('Failed to parse server response', response.status);
  }

  if (!response.ok) {
    throw new ApiError(data.message ?? 'Request failed', response.status, data);
  }

  return data;
}

// ─── Convenience methods ──────────────────────────────────────────

export const api = {
  get: <T>(path: string, options?: FetchOptions) =>
    fetcher<T>(path, { ...options, method: 'GET' }),

  post: <T>(path: string, body?: unknown, options?: FetchOptions) =>
    fetcher<T>(path, { ...options, method: 'POST', body }),

  patch: <T>(path: string, body?: unknown, options?: FetchOptions) =>
    fetcher<T>(path, { ...options, method: 'PATCH', body }),

  put: <T>(path: string, body?: unknown, options?: FetchOptions) =>
    fetcher<T>(path, { ...options, method: 'PUT', body }),

  delete: <T>(path: string, options?: FetchOptions) =>
    fetcher<T>(path, { ...options, method: 'DELETE' }),
};
