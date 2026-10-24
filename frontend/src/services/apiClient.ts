/**
 * apiClient.ts
 *
 * Lightweight, type-safe API client wrapper for communicating with the
 * FastAPI backend. Handles authentication headers, JSON serialization,
 * error parsing, and fallback endpoints.
 */

export class ApiError extends Error {
  public status: number;
  public detail: string;

  constructor(status: number, detail: string) {
    super(`API Error ${status}: ${detail}`);
    this.name = 'ApiError';
    this.status = status;
    this.detail = detail;
  }
}

const TOKEN_KEY = 'darasa_auth_token';

export const tokenStorage = {
  get: (): string | null => {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        return window.localStorage.getItem(TOKEN_KEY);
      }
    } catch {
      // Storage unavailable
    }
    return null;
  },
  set: (token: string): void => {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.setItem(TOKEN_KEY, token);
      }
    } catch {
      // Storage unavailable
    }
  },
  remove: (): void => {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.removeItem(TOKEN_KEY);
      }
    } catch {
      // Storage unavailable
    }
  },
};

// Fallback logic for local development:
// In browser Vite dev: uses '/api/v1' (proxied by Vite to http://localhost:8000)
// Or explicit VITE_API_URL if configured in environment
export const getApiBaseUrl = (): string => {
  if (typeof import.meta !== 'undefined' && import.meta.env?.VITE_API_URL) {
    return import.meta.env.VITE_API_URL.replace(/\/$/, '');
  }
  return '/api/v1';
};

export interface RequestOptions extends RequestInit {
  requiresAuth?: boolean;
}

export async function request<T>(
  endpoint: string,
  options: RequestOptions = {}
): Promise<T> {
  const { requiresAuth = false, headers = {}, ...rest } = options;

  const baseUrl = getApiBaseUrl();
  const url = `${baseUrl}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;

  const requestHeaders: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(headers as Record<string, string>),
  };

  if (requiresAuth) {
    const token = tokenStorage.get();
    if (token) {
      requestHeaders['Authorization'] = `Bearer ${token}`;
    }
  }

  const response = await fetch(url, {
    headers: requestHeaders,
    ...rest,
  });

  if (!response.ok) {
    let errorDetail = 'An unexpected error occurred.';
    try {
      const errorJson = await response.json();
      errorDetail = errorJson.detail || errorJson.message || JSON.stringify(errorJson);
    } catch {
      errorDetail = response.statusText || errorDetail;
    }
    throw new ApiError(response.status, errorDetail);
  }

  // Handle empty responses
  if (response.status === 204) {
    return {} as T;
  }

  return response.json() as Promise<T>;
}