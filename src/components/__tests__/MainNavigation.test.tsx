import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MainNavigation } from '../MainNavigation';
import React from 'react';

describe('MainNavigation Component', () => {
  it('renders all entity categories', () => {
    const mockOnSelectEntity = vi.fn();
    render(
      <MainNavigation selectedEntity={null} onSelectEntity={mockOnSelectEntity} />
    );
    
    // Check that all the expected entity categories are displayed
    expect(screen.getByText('Services')).toBeInTheDocument();
    expect(screen.getByText('Routes')).toBeInTheDocument();
    expect(screen.getByText('Consumers')).toBeInTheDocument();
    expect(screen.getByText('Plugins')).toBeInTheDocument();
    expect(screen.getByText('Certificates')).toBeInTheDocument();
    expect(screen.getByText('Upstreams')).toBeInTheDocument();
    expect(screen.getByText('Settings')).toBeInTheDocument();
  });

  it('highlights the selected entity', () => {
    const mockOnSelectEntity = vi.fn();
    render(
      <MainNavigation selectedEntity="services" onSelectEntity={mockOnSelectEntity} />
    );
    
    // Find the button containing "Services" text
    const servicesButton = screen.getByText('Services').closest('button');
    expect(servicesButton).toHaveAttribute('aria-selected', 'true');
    
    // Other buttons should not be selected
    const routesButton = screen.getByText('Routes').closest('button');
    expect(routesButton).toHaveAttribute('aria-selected', 'false');
  });

  it('calls onSelectEntity when an entity is clicked', () => {
    const mockOnSelectEntity = vi.fn();
    render(
      <MainNavigation selectedEntity={null} onSelectEntity={mockOnSelectEntity} />
    );
    
    // Click on the "Services" entity
    fireEvent.click(screen.getByText('Services'));
    
    // Check that onSelectEntity was called with the correct parameter
    expect(mockOnSelectEntity).toHaveBeenCalledWith('services');
  });
});
