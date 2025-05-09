import '@testing-library/jest-dom';
import { vi } from 'vitest';

// Mock the window.matchMedia function for MUI components
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

// Mock the window.innerWidth for responsive tests
Object.defineProperty(window, 'innerWidth', {
  writable: true,
  value: 1024,
});

// Mock the crypto.randomUUID function for consistency in tests
Object.defineProperty(crypto, 'randomUUID', {
  value: () => '123e4567-e89b-12d3-a456-426614174000',
  configurable: true,
});
