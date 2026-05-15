import '@testing-library/jest-dom/vitest';
import { afterEach, vi } from 'vitest';
import { cleanup } from '@testing-library/react';

afterEach(() => {
  cleanup();
  localStorage.clear();
  vi.clearAllMocks();
});

Object.defineProperty(window, 'scrollTo', {
  configurable: true,
  value: vi.fn(),
});
