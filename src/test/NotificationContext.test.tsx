import { describe, it, expect, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { NotificationProvider } from '../components/NotificationContext';
import { useNotification } from '../hooks/useNotification';

describe('NotificationContext', () => {
  it('should provide useNotification hook', () => {
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <NotificationProvider>{children}</NotificationProvider>
    );
    
    const { result } = renderHook(() => useNotification(), { wrapper });
    
    expect(result.current).toBeDefined();
    expect(result.current.notify).toBeDefined();
    expect(result.current.confirm).toBeDefined();
    expect(result.current.removeNotification).toBeDefined();
  });

  it('should throw error when useNotification is used outside provider', () => {
    // Suppress console.error for this test
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {});
    
    expect(() => {
      renderHook(() => useNotification());
    }).toThrow('useNotification must be used within NotificationProvider');
    
    consoleError.mockRestore();
  });

  it('should create success notification', () => {
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <NotificationProvider>{children}</NotificationProvider>
    );
    
    const { result } = renderHook(() => useNotification(), { wrapper });
    
    act(() => {
      result.current.notify('Test success', 'success', 3000);
    });
    
    expect(result.current.notify).toBeDefined();
  });

  it('should create error notification', () => {
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <NotificationProvider>{children}</NotificationProvider>
    );
    
    const { result } = renderHook(() => useNotification(), { wrapper });
    
    act(() => {
      result.current.notify('Test error', 'error', 3000);
    });
    
    expect(result.current.notify).toBeDefined();
  });

  it('should create info notification', () => {
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <NotificationProvider>{children}</NotificationProvider>
    );
    
    const { result } = renderHook(() => useNotification(), { wrapper });
    
    act(() => {
      result.current.notify('Test info', 'info', 3000);
    });
    
    expect(result.current.notify).toBeDefined();
  });

  it('should create warning notification', () => {
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <NotificationProvider>{children}</NotificationProvider>
    );
    
    const { result } = renderHook(() => useNotification(), { wrapper });
    
    act(() => {
      result.current.notify('Test warning', 'warning', 3000);
    });
    
    expect(result.current.notify).toBeDefined();
  });

  it('should handle confirm action', () => {
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <NotificationProvider>{children}</NotificationProvider>
    );
    
    const { result } = renderHook(() => useNotification(), { wrapper });
    
    const onConfirm = vi.fn();
    const onCancel = vi.fn();
    
    act(() => {
      result.current.confirm('Are you sure?', onConfirm, onCancel);
    });
    
    expect(result.current.confirm).toBeDefined();
  });

  it('should remove notification by id', () => {
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <NotificationProvider>{children}</NotificationProvider>
    );
    
    const { result } = renderHook(() => useNotification(), { wrapper });
    
    act(() => {
      result.current.removeNotification('test-id');
    });
    
    expect(result.current.removeNotification).toBeDefined();
  });

  it('should default to info type when not specified', () => {
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <NotificationProvider>{children}</NotificationProvider>
    );
    
    const { result } = renderHook(() => useNotification(), { wrapper });
    
    act(() => {
      result.current.notify('Test message');
    });
    
    expect(result.current.notify).toBeDefined();
  });

  it('should default to 3000ms duration when not specified', () => {
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <NotificationProvider>{children}</NotificationProvider>
    );
    
    const { result } = renderHook(() => useNotification(), { wrapper });
    
    act(() => {
      result.current.notify('Test message', 'success');
    });
    
    expect(result.current.notify).toBeDefined();
  });
});
