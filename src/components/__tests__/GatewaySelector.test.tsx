import { describe, it, expect, vi, beforeAll, afterAll, afterEach, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { http, HttpResponse } from 'msw';
import { setupServer } from 'msw/node';
import { GatewaySelector } from '../GatewaySelector';
import { useGatewayStore } from '../../store/useGatewayStore';

const mockGateways = [
  {
    id: '1',
    name: 'Local Kong',
    adminUrl: 'http://localhost:8001',
    skipTlsVerify: false,
    type: 'oss',
    authType: 'none'
  }
];

const server = setupServer(
  http.get('http://localhost:8001/status', () => {
    return HttpResponse.json({ version: '3.0.0' });
  })
);

beforeAll(() => server.listen());
afterEach(() => {
  server.resetHandlers();
  vi.clearAllMocks();
});
afterAll(() => server.close());

vi.mock('../../store/useGatewayStore');

const mockUseGatewayStore = vi.mocked(useGatewayStore);

describe('GatewaySelector', () => {
  beforeEach(() => {
    mockUseGatewayStore.mockReturnValue({
      gateways: mockGateways,
      activeGatewayId: '1',
      addGateway: vi.fn(),
      removeGateway: vi.fn(),
      setActiveGateway: vi.fn(),
      testConnection: vi.fn().mockResolvedValue({ success: true, message: 'Connection successful' })
    });
  });

  it('tests connection with test Kong instance', async () => {
    const testConnectionMock = vi.fn().mockResolvedValue({ success: true, message: 'Connection successful' });
    
    mockUseGatewayStore.mockReturnValue({
      gateways: mockGateways,
      activeGatewayId: '1',
      addGateway: vi.fn(),
      removeGateway: vi.fn(),
      setActiveGateway: vi.fn(),
      testConnection: testConnectionMock
    });

    render(<GatewaySelector />);
    
    // Open dialog
    const button = screen.getByRole('button', { name: /Local Kong|Select Gateway/i });
    fireEvent.click(button);
    
    const addButton = await screen.findByText('Add New Gateway');
    fireEvent.click(addButton);
    
    // Fill in all required fields
    const nameInput = screen.getByLabelText(/Gateway Name/);
    fireEvent.change(nameInput, { target: { value: 'Test Gateway' } });
    
    const adminUrlInput = screen.getByLabelText(/Admin API URL/);
    fireEvent.change(adminUrlInput, { target: { value: 'http://localhost:8001' } });
    
    // Test connection
    const testButton = screen.getByRole('button', { name: /Test & Save/i });
    fireEvent.click(testButton);
    
    // Verify testConnection was called
    await waitFor(() => {
      expect(testConnectionMock).toHaveBeenCalled();
    });
    
    // Verify successful connection
    expect(await screen.findByText(/Connection test successful!/i)).toBeInTheDocument();
  });
});
