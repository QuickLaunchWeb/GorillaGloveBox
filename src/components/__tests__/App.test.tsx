import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import App from '../../App';
import React from 'react';

// Mock the child components to simplify testing
vi.mock('../../components/GatewaySelector', () => ({
  GatewaySelector: () => React.createElement('div', { 'data-testid': 'gateway-selector' }, 'Gateway Selector Mock')
}));

vi.mock('../../components/MainNavigation', () => ({
  MainNavigation: ({ onSelectEntity }: { onSelectEntity: (entity: any) => void }) => 
    React.createElement('div', { 'data-testid': 'main-navigation' },
      React.createElement('button', { onClick: () => onSelectEntity('services') }, 'Select Services')
    )
}));

vi.mock('../../components/MainContent', () => ({
  MainContent: ({ selectedEntity }: { selectedEntity: string | null }) => 
    React.createElement('div', { 'data-testid': 'main-content' },
      selectedEntity ? `Showing ${selectedEntity}` : 'Welcome Screen'
    )
}));

describe('App Component', () => {
  it('renders the main layout with navigation and content areas', () => {
    render(<App />);
    
    // Check that the app title is displayed
    expect(screen.getByText('GorillaGloveBox')).toBeInTheDocument();
    
    // Check that the main components are rendered
    expect(screen.getByTestId('gateway-selector')).toBeInTheDocument();
    expect(screen.getByTestId('main-navigation')).toBeInTheDocument();
    expect(screen.getByTestId('main-content')).toBeInTheDocument();
    
    // Initially, the main content should show the welcome screen
    expect(screen.getByText('Welcome Screen')).toBeInTheDocument();
  });

  it('updates the selected entity when navigation is clicked', () => {
    render(<App />);
    
    // Initially shows welcome screen
    expect(screen.getByText('Welcome Screen')).toBeInTheDocument();
    
    // Click on the Services navigation item
    fireEvent.click(screen.getByText('Select Services'));
    
    // The content should now show services
    expect(screen.getByText('Showing services')).toBeInTheDocument();
  });

  it('toggles the drawer when menu button is clicked', () => {
    render(<App />);
    
    // Find the menu button
    const menuButton = screen.getByLabelText('open drawer');
    
    // Initially, the drawer is not open (which means the navigation is not fully visible)
    const initialNav = document.querySelector('[aria-hidden="true"]');
    expect(initialNav).not.toBeNull();
    
    // Click the menu button to open the drawer
    fireEvent.click(menuButton);
    
    // After clicking, the drawer should be open (Navigation is visible)
    const openNav = document.querySelector('[aria-hidden="false"]');
    expect(openNav).not.toBeNull();
  });
});
