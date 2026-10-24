/**
 * authService.ts
 *
 * Dedicated authentication service for communicating with the
 * FastAPI backend (/auth/register, /auth/login, /auth/me).
 * Manages JWT tokens in storage and current user state.
 */

import { request, tokenStorage } from './apiClient';

export interface UserProfile {
  id: string;
  email: string;
  full_name: string;
  role: 'teacher' | 'learner' | 'parent' | 'admin';
  is_active: boolean;
  created_at: string;
}

export interface RegisterPayload {
  email: string;
  full_name: string;
  password: string;
  role: 'teacher' | 'learner' | 'parent';
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface LoginResponse {
  access_token: string;
  token_type: string;
  user: UserProfile;
}

export const authService = {
  /**
   * Register a new user account on the backend.
   */
  register: async (payload: RegisterPayload): Promise<UserProfile> => {
    return request<UserProfile>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  /**
   * Authenticate credentials and save access token upon success.
   */
  login: async (payload: LoginPayload): Promise<LoginResponse> => {
    const data = await request<LoginResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
    if (data.access_token) {
      tokenStorage.set(data.access_token);
    }
    return data;
  },

  /**
   * Fetch current authenticated user profile.
   */
  getMe: async (): Promise<UserProfile> => {
    return request<UserProfile>('/auth/me', {
      method: 'GET',
      requiresAuth: true,
    });
  },

  /**
   * Log out the user by removing the stored token.
   */
  logout: (): void => {
    tokenStorage.remove();
  },

  /**
   * Check if a token currently exists.
   */
  isAuthenticated: (): boolean => {
    return Boolean(tokenStorage.get());
  },
};