/**
 * authService.test.ts
 *
 * Unit tests for authService: registration, login, profile retrieval,
 * and token persistence.
 */

// vitest globals
import { authService } from '../services/authService';
import { tokenStorage } from '../services/apiClient';

describe('authService', () => {
  const originalFetch = global.fetch;

  beforeEach(() => {
    tokenStorage.remove();
  });

  afterEach(() => {
    global.fetch = originalFetch;
    tokenStorage.remove();
  });

  it('registers a new user successfully', async () => {
    const mockUser = {
      id: 'usr-1',
      email: 'mwalimu@school.ac.ke',
      full_name: 'Mwalimu Jane',
      role: 'teacher',
      is_active: true,
      created_at: '2026-10-21T00:00:00Z',
    };

    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      status: 201,
      json: async () => mockUser,
    } as Response);

    const user = await authService.register({
      email: 'mwalimu@school.ac.ke',
      full_name: 'Mwalimu Jane',
      password: 'SecurePassword123!',
      role: 'teacher',
    });

    expect(user.id).toBe('usr-1');
    expect(user.email).toBe('mwalimu@school.ac.ke');
    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining('/auth/register'),
      expect.objectContaining({ method: 'POST' })
    );
  });

  it('authenticates user on login and stores JWT token', async () => {
    const mockLoginResp = {
      access_token: 'jwt-token-xyz',
      token_type: 'bearer',
      user: {
        id: 'usr-1',
        email: 'mwalimu@school.ac.ke',
        full_name: 'Mwalimu Jane',
        role: 'teacher',
        is_active: true,
        created_at: '2026-10-21T00:00:00Z',
      },
    };

    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => mockLoginResp,
    } as Response);

    const resp = await authService.login({
      email: 'mwalimu@school.ac.ke',
      password: 'SecurePassword123!',
    });

    expect(resp.access_token).toBe('jwt-token-xyz');
    expect(authService.isAuthenticated()).toBe(true);
    expect(tokenStorage.get()).toBe('jwt-token-xyz');
  });

  it('fetches current user profile with getMe', async () => {
    tokenStorage.set('my-token');

    const mockProfile = {
      id: 'usr-1',
      email: 'mwalimu@school.ac.ke',
      full_name: 'Mwalimu Jane',
      role: 'teacher',
      is_active: true,
      created_at: '2026-10-21T00:00:00Z',
    };

    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => mockProfile,
    } as Response);

    const profile = await authService.getMe();
    expect(profile.id).toBe('usr-1');
    expect(profile.email).toBe('mwalimu@school.ac.ke');
  });

  it('logs out and removes stored token', () => {
    tokenStorage.set('token-to-remove');
    expect(authService.isAuthenticated()).toBe(true);
    authService.logout();
    expect(authService.isAuthenticated()).toBe(false);
  });
});