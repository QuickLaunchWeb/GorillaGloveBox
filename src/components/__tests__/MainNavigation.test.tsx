import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MainNavigation } from '../MainNavigation';

describe('MainNavigation Component', () => {
  it('renders all entity categories', () => {
    const mockOnSelectEntity = vi.fn();
    render(
      <MainNavigation selectedEntity={null} onSelectEntity={mockOnSelectEntity} />
    );
    
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
    
    const servicesButton = screen.getByRole('button', { name: 'Services' });
    expect(servicesButton).toHaveClass('Mui-selected');
    
    const routesButton = screen.getByRole('button', { name: 'Routes' });
    expect(routesButton).not.toHaveClass('Mui-selected');
  });

  it('calls onSelectEntity when an entity is clicked', () => {
    const mockOnSelectEntity = vi.fn();
    render(
      <MainNavigation selectedEntity={null} onSelectEntity={mockOnSelectEntity} />
    );
    
    fireEvent.click(screen.getByText('Services'));
    
    expect(mockOnSelectEntity).toHaveBeenCalledWith('services');
  });
});
