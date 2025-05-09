import { describe, it, expect, vi, afterEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MainContent } from '../MainContent';

// Mock the hook dependencies
vi.mock('../../store/useGatewayStore', () => ({
  useGatewayStore: () => ({
    gateways: [],
    activeGatewayId: null
  })
}));

vi.mock('../../hooks/useKongApi', () => ({
  useKongApi: () => ({
    isConnected: false,
    error: null
  })
}));

describe('MainContent Component', () => {
  it('renders welcome screen when no entity is selected', () => {
    render(<MainContent selectedEntity={null} />);
    
    // Check that the welcome message is displayed
    expect(screen.getByText('Welcome to GorillaGloveBox')).toBeInTheDocument();
    expect(screen.getByText(/A GUI for Kong Admin API/)).toBeInTheDocument();
    
    // Check that the entity cards are displayed
    expect(screen.getByText('Services')).toBeInTheDocument();
    expect(screen.getByText('Routes')).toBeInTheDocument();
    expect(screen.getByText('Plugins')).toBeInTheDocument();
  });

  it('shows connection message when entity is selected but not connected', () => {
    render(<MainContent selectedEntity="services" />);
    
    // Check that the correct message is displayed
    expect(screen.getByText(/Please connect to a Kong Gateway to manage services/)).toBeInTheDocument();
  });

  it('renders entity content when entity is selected and connected', () => {
    // Override the mocked hook to simulate a connected state
    vi.mocked(useKongApi).mockReturnValue({
      isConnected: true,
      error: null
    });
    
    render(<MainContent selectedEntity="services" />);
    
    // Check that the entity title is displayed
    expect(screen.getByText('Services')).toBeInTheDocument();
    expect(screen.getByText(/This is a placeholder for the services management screen/)).toBeInTheDocument();
  });
});

// Restore the original implementations
afterEach(() => {
  vi.restoreAllMocks();
});
