import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import App from '../../App';

// Mock the child components to simplify testing
vi.mock('../../components/GatewaySelector', () => ({
  GatewaySelector: () => <div data-testid="gateway-selector">Gateway Selector Mock</div>
}));

vi.mock('../../components/MainNavigation', () => ({
  MainNavigation: ({ onSelectEntity }: { onSelectEntity: (entity: any) => void }) => (
    <div data-testid="main-navigation">
      <button onClick={() => onSelectEntity('services')}>Select Services</button>
    </div>
  )
}));

vi.mock('../../components/MainContent', () => ({
  MainContent: ({ selectedEntity }: { selectedEntity: string | null }) => (
    <div data-testid="main-content">
      {selectedEntity ? `Showing ${selectedEntity}` : 'Welcome Screen'}
    </div>
  )
}));

describe('App Component', () => {
  it('renders the main layout with navigation and content areas', () => {
    render(<App />);
    
    expect(screen.getByText('GorillaGloveBox')).toBeInTheDocument();
    expect(screen.getByTestId('gateway-selector')).toBeInTheDocument();
    expect(screen.getByTestId('main-navigation')).toBeInTheDocument();
    expect(screen.getByTestId('main-content')).toBeInTheDocument();
    expect(screen.getByText('Welcome Screen')).toBeInTheDocument();
  });

  it('updates the selected entity when navigation is clicked', () => {
    render(<App />);
    
    expect(screen.getByText('Welcome Screen')).toBeInTheDocument();
    
    fireEvent.click(screen.getByText('Select Services'));
    
    expect(screen.getByText('Showing services')).toBeInTheDocument();
  });

  it('toggles the drawer when menu button is clicked', () => {
    render(<App />);
    
    const menuButton = screen.getByLabelText('open drawer');
    fireEvent.click(menuButton);
    
    const navigation = screen.getByTestId('main-navigation');
    expect(navigation).toBeVisible();
  });
});
