/**
 * apiClient.test.ts
 *
 * Unit tests for API client: request headers, token attachment,
 * error response handling, and token storage.
 */

// vitest globals
import { request, tokenStorage, ApiError, getApiBaseUrl } from '../services/apiClient';

describe('apiClient - tokenStorage', () => {
  beforeEach(() => {
    tokenStorage.remove();
  });

  it('stores, retrieves, and removes auth token', () => {
    expect(tokenStorage.get()).toBeNull();
    tokenStorage.set('test-jwt-token');
    expect(tokenStorage.get()).toBe('test-jwt-token');
    tokenStorage.remove();
    expect(tokenStorage.get()).toBeNull();
  });
});

describe('apiClient - getApiBaseUrl', () => {
  it('returns a default or configured API base URL', () => {
    const url = getApiBaseUrl();
    expect(typeof url).toBe('string');
    expect(url.length).toBeGreaterThan(0);
  });
});

describe('apiClient - request function', () => {
  const originalFetch = globalThis.fetch;

  afterEach(() => {
    globalThis.fetch = originalFetch;
    tokenStorage.remove();
  });

  it('performs successful GET request and parses JSON', async () => {
    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => ({ status: 'ok' }),
    } as Response);

    const result = await request<{ status: string }>('/health');
    expect(result).toEqual({ status: 'ok' });
    expect(globalThis.fetch).toHaveBeenCalledWith(
      expect.stringContaining('/health'),
      expect.objectContaining({
        headers: expect.objectContaining({ 'Content-Type': 'application/json' }),
      })
    );
  });

  it('attaches Authorization header when requiresAuth is true and token exists', async () => {
    tokenStorage.set('my-secret-jwt');
    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => ({ id: 'user-1' }),
    } as Response);

    await request('/auth/me', { requiresAuth: true });

    expect(globalThis.fetch).toHaveBeenCalledWith(
      expect.stringContaining('/auth/me'),
      expect.objectContaining({
        headers: expect.objectContaining({
          Authorization: 'Bearer my-secret-jwt',
        }),
      })
    );
  });

  it('throws ApiError on HTTP 400 with detail message', async () => {
    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: false,
      status: 400,
      statusText: 'Bad Request',
      json: async () => ({ detail: 'Account already exists' }),
    } as Response);

    await expect(request('/auth/register', { method: 'POST' })).rejects.toThrow(ApiError);
  });

  it('handles 204 No Content gracefully', async () => {
    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: true,
      status: 204,
    } as Response);

    const result = await request('/some-empty-endpoint', { method: 'DELETE' });
    expect(result).toEqual({});
  });
});
