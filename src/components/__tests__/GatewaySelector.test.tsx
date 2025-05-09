import { describe, it, expect, vi, afterEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { GatewaySelector } from '../GatewaySelector';

// Mock the Zustand store
vi.mock('../../store/useGatewayStore', () => ({
  useGatewayStore: () => ({
    gateways: [
      { id: '1', name: 'Test Gateway', adminUrl: 'http://localhost:8001', skipTlsVerify: true, type: 'oss' }
    ],
    activeGatewayId: '1',
    addGateway: vi.fn(),
    removeGateway: vi.fn(),
    setActiveGateway: vi.fn()
  })
}));

describe('GatewaySelector Component', () => {
  it('displays the active gateway name', () => {
    render(<GatewaySelector />);
    
    expect(screen.getByText('Test Gateway')).toBeInTheDocument();
  });

  it('opens the gateway dropdown when clicked', () => {
    render(<GatewaySelector />);
    
    // The dropdown button should be visible
    const dropdownButton = screen.getByText('Test Gateway');
    fireEvent.click(dropdownButton);
    
    // "Add New Gateway" option should be visible when dropdown is open
    expect(screen.getByText('Add New Gateway')).toBeInTheDocument();
  });

  it('opens the add gateway dialog when "Add New Gateway" is clicked', () => {
    render(<GatewaySelector />);
    
    // Open the dropdown
    const dropdownButton = screen.getByText('Test Gateway');
    fireEvent.click(dropdownButton);
    
    // Click the "Add New Gateway" option
    fireEvent.click(screen.getByText('Add New Gateway'));
    
    // The dialog should be visible
    expect(screen.getByText('Add New Gateway', { selector: 'h2' })).toBeInTheDocument();
    expect(screen.getByLabelText('Gateway Name')).toBeInTheDocument();
    expect(screen.getByLabelText('Admin API URL')).toBeInTheDocument();
  });

  it('calls addGateway when form is submitted with valid data', () => {
    const mockAddGateway = vi.fn();
    vi.mocked(useGatewayStore).mockReturnValue({
      ...vi.mocked(useGatewayStore)(),
      addGateway: mockAddGateway
    });
    
    render(<GatewaySelector />);
    
    // Open the dropdown and then the dialog
    fireEvent.click(screen.getByText('Test Gateway'));
    fireEvent.click(screen.getByText('Add New Gateway'));
    
    // Fill in the form
    fireEvent.change(screen.getByLabelText('Gateway Name'), {
      target: { value: 'New Gateway' }
    });
    fireEvent.change(screen.getByLabelText('Admin API URL'), {
      target: { value: 'http://example.com:8001' }
    });
    
    // Submit the form
    fireEvent.click(screen.getByText('Add Gateway'));
    
    // Check if addGateway was called with the correct data
    expect(mockAddGateway).toHaveBeenCalledWith(expect.objectContaining({
      name: 'New Gateway',
      adminUrl: 'http://example.com:8001'
    }));
  });
});

// Restore the original implementations
afterEach(() => {
  vi.restoreAllMocks();
});
