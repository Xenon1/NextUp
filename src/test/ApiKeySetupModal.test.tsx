import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { ApiKeySetupModal } from '../components/ApiKeySetupModal';

// Mock the configService
vi.mock('../services/configService', () => ({
  configService: {
    setApiKey: vi.fn().mockResolvedValue(undefined),
  },
}));

describe('ApiKeySetupModal', () => {
  it('renders the modal with title and instructions', () => {
    const mockCallback = vi.fn();
    render(<ApiKeySetupModal onApiKeySet={mockCallback} />);
    
    expect(screen.getByText('🔑 Enter Your TMDB API Key')).toBeInTheDocument();
    expect(screen.getByText('How to get your API key:')).toBeInTheDocument();
  });

  it('displays the TMDB URL that can be clicked', () => {
    const mockCallback = vi.fn();
    render(<ApiKeySetupModal onApiKeySet={mockCallback} />);
    
    const url = screen.getByText('https://www.themoviedb.org/settings/api');
    expect(url).toBeInTheDocument();
    expect(url).toHaveClass('tmdb-url');
  });

  it('has an input field for API key', () => {
    const mockCallback = vi.fn();
    render(<ApiKeySetupModal onApiKeySet={mockCallback} />);
    
    const input = screen.getByPlaceholderText('Paste your TMDB API key here');
    expect(input).toBeInTheDocument();
    expect(input).toHaveAttribute('type', 'password');
  });

  it('has a continue button', () => {
    const mockCallback = vi.fn();
    render(<ApiKeySetupModal onApiKeySet={mockCallback} />);
    
    const button = screen.getByRole('button', { name: /continue/i });
    expect(button).toBeInTheDocument();
  });

  it('shows error message when submitting empty API key', async () => {
    const mockCallback = vi.fn();
    render(<ApiKeySetupModal onApiKeySet={mockCallback} />);
    
    const button = screen.getByRole('button', { name: /continue/i });
    fireEvent.click(button);
    
    await waitFor(() => {
      expect(screen.getByText('Please enter your TMDB API key')).toBeInTheDocument();
    });
  });

  it('displays security note about local storage', () => {
    const mockCallback = vi.fn();
    render(<ApiKeySetupModal onApiKeySet={mockCallback} />);
    
    const securityNote = screen.getByText(/Your API key is stored securely/i);
    expect(securityNote).toBeInTheDocument();
  });
});
