import { describe, it, expect, vi, afterEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MainContent } from '../MainContent';
import { useKongApi } from '../../hooks/useKongApi';

// Mock the hook dependencies
vi.mock('../../store/useGatewayStore', () => ({
  useGatewayStore: () => ({
    gateways: [],
    activeGatewayId: null
  })
}));

vi.mock('../../hooks/useKongApi', () => ({
  useKongApi: vi.fn(() => ({
    getAll: vi.fn(),
    getById: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    remove: vi.fn(),
    gateway: null,
    isConnected: false,
    error: null
  }))
}));

describe('MainContent Component', () => {
  it('renders welcome screen when no entity is selected', () => {
    render(<MainContent selectedEntity={null} />);
    
    expect(screen.getByText('Welcome to GorillaGloveBox')).toBeInTheDocument();
    expect(screen.getByText(/A GUI for Kong Admin API/)).toBeInTheDocument();
    
    expect(screen.getByText('Services')).toBeInTheDocument();
    expect(screen.getByText('Routes')).toBeInTheDocument();
    expect(screen.getByText('Plugins')).toBeInTheDocument();
  });

  it('shows connection message when entity is selected but not connected', () => {
    render(<MainContent selectedEntity="services" />);
    
    expect(screen.getByText(/Please connect to a Kong Gateway to manage services/)).toBeInTheDocument();
  });

  it('renders entity content when entity is selected and connected', () => {
    const useKongApiMock = vi.mocked(useKongApi);
    useKongApiMock.mockReturnValue({
      getAll: vi.fn(),
      getById: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      remove: vi.fn(),
      gateway: {
        id: '1',
        name: 'Test Gateway',
        adminUrl: 'http://localhost:8001',
        skipTlsVerify: false,
        type: 'oss'
      },
      isConnected: true,
      error: null
    });
    
    render(<MainContent selectedEntity="services" />);
    
    expect(screen.getByText('Services')).toBeInTheDocument();
    expect(screen.getByText(/This is a placeholder for the services management screen/)).toBeInTheDocument();
  });
});

// Restore the original implementations
afterEach(() => {
  vi.restoreAllMocks();
});
