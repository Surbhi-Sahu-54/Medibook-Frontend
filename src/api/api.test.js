import { beforeEach, describe, expect, it, vi } from 'vitest';

const mocks = vi.hoisted(() => {
  const requestUse = vi.fn();
  return {
    requestUse,
    create: vi.fn(() => ({
      interceptors: {
        request: {
          use: requestUse,
        },
      },
    })),
  };
});

vi.mock('axios', () => ({
  default: {
    create: mocks.create,
  },
}));

describe('api service', () => {
  beforeEach(() => {
    vi.resetModules();
  });

  it('configures the API gateway base URL and JSON headers', async () => {
    await import('./api');

    expect(mocks.create).toHaveBeenCalledWith({
      baseURL: 'http://localhost:8085',
      headers: {
        'Content-Type': 'application/json',
      },
    });
  });

  it('attaches a bearer token when local storage has one', async () => {
    await import('./api');
    const [onFulfilled] = mocks.requestUse.mock.calls[0];
    localStorage.setItem('token', 'jwt-token');

    const config = onFulfilled({ headers: {} });

    expect(config.headers.Authorization).toBe('Bearer jwt-token');
  });

  it('leaves authorization unset when no token exists', async () => {
    await import('./api');
    const [onFulfilled] = mocks.requestUse.mock.calls[0];

    const config = onFulfilled({ headers: {} });

    expect(config.headers.Authorization).toBeUndefined();
  });
});
