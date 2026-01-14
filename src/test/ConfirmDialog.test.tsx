import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ConfirmDialog } from '../components/ConfirmDialog';

describe('ConfirmDialog', () => {
  it('should render dialog with title', () => {
    const mockConfirm = vi.fn();
    const mockCancel = vi.fn();
    
    render(
      <ConfirmDialog
        title="Test Title"
        message="Test Message"
        onConfirm={mockConfirm}
        onCancel={mockCancel}
      />
    );
    
    expect(screen.getByText('Test Title')).toBeInTheDocument();
  });

  it('should render dialog with message', () => {
    const mockConfirm = vi.fn();
    const mockCancel = vi.fn();
    
    render(
      <ConfirmDialog
        title="Test Title"
        message="Test Message"
        onConfirm={mockConfirm}
        onCancel={mockCancel}
      />
    );
    
    expect(screen.getByText('Test Message')).toBeInTheDocument();
  });

  it('should render with default button labels', () => {
    const mockConfirm = vi.fn();
    const mockCancel = vi.fn();
    
    render(
      <ConfirmDialog
        title="Test"
        message="Test"
        onConfirm={mockConfirm}
        onCancel={mockCancel}
      />
    );
    
    expect(screen.getByText('Confirm')).toBeInTheDocument();
    expect(screen.getByText('Cancel')).toBeInTheDocument();
  });

  it('should render with custom button labels', () => {
    const mockConfirm = vi.fn();
    const mockCancel = vi.fn();
    
    render(
      <ConfirmDialog
        title="Test"
        message="Test"
        confirmLabel="Delete"
        cancelLabel="Keep"
        onConfirm={mockConfirm}
        onCancel={mockCancel}
      />
    );
    
    expect(screen.getByText('Delete')).toBeInTheDocument();
    expect(screen.getByText('Keep')).toBeInTheDocument();
  });

  it('should call onConfirm when confirm button is clicked', () => {
    const mockConfirm = vi.fn();
    const mockCancel = vi.fn();
    
    render(
      <ConfirmDialog
        title="Test"
        message="Test"
        confirmLabel="Confirm"
        onConfirm={mockConfirm}
        onCancel={mockCancel}
      />
    );
    
    const confirmButton = screen.getByText('Confirm');
    fireEvent.click(confirmButton);
    
    expect(mockConfirm).toHaveBeenCalled();
  });

  it('should call onCancel when cancel button is clicked', () => {
    const mockConfirm = vi.fn();
    const mockCancel = vi.fn();
    
    render(
      <ConfirmDialog
        title="Test"
        message="Test"
        cancelLabel="Cancel"
        onConfirm={mockConfirm}
        onCancel={mockCancel}
      />
    );
    
    const cancelButton = screen.getByText('Cancel');
    fireEvent.click(cancelButton);
    
    expect(mockCancel).toHaveBeenCalled();
  });

  it('should call onCancel when overlay is clicked', () => {
    const mockConfirm = vi.fn();
    const mockCancel = vi.fn();
    
    const { container } = render(
      <ConfirmDialog
        title="Test"
        message="Test"
        onConfirm={mockConfirm}
        onCancel={mockCancel}
      />
    );
    
    const overlay = container.querySelector('.confirm-dialog-overlay');
    if (overlay) {
      fireEvent.click(overlay);
    }
    
    expect(mockCancel).toHaveBeenCalled();
  });

  it('should not call onCancel when dialog is clicked', () => {
    const mockConfirm = vi.fn();
    const mockCancel = vi.fn();
    
    const { container } = render(
      <ConfirmDialog
        title="Test"
        message="Test"
        onConfirm={mockConfirm}
        onCancel={mockCancel}
      />
    );
    
    const dialog = container.querySelector('.confirm-dialog');
    if (dialog) {
      fireEvent.click(dialog);
    }
    
    expect(mockCancel).not.toHaveBeenCalled();
  });

  it('should render warning icon for non-dangerous dialogs', () => {
    const mockConfirm = vi.fn();
    const mockCancel = vi.fn();
    
    const { container } = render(
      <ConfirmDialog
        title="Test"
        message="Test"
        isDangerous={false}
        onConfirm={mockConfirm}
        onCancel={mockCancel}
      />
    );
    
    const icon = container.querySelector('.confirm-dialog-icon');
    expect(icon?.textContent).toBe('ℹ️');
  });

  it('should render danger icon for dangerous dialogs', () => {
    const mockConfirm = vi.fn();
    const mockCancel = vi.fn();
    
    const { container } = render(
      <ConfirmDialog
        title="Test"
        message="Test"
        isDangerous={true}
        onConfirm={mockConfirm}
        onCancel={mockCancel}
      />
    );
    
    const icon = container.querySelector('.confirm-dialog-icon');
    expect(icon?.textContent).toBe('⚠️');
  });

  it('should apply dangerous styling when isDangerous is true', () => {
    const mockConfirm = vi.fn();
    const mockCancel = vi.fn();
    
    const { container } = render(
      <ConfirmDialog
        title="Test"
        message="Test"
        isDangerous={true}
        onConfirm={mockConfirm}
        onCancel={mockCancel}
      />
    );
    
    const dialog = container.querySelector('.confirm-dialog');
    expect(dialog?.classList.contains('dangerous')).toBe(true);
  });
});
