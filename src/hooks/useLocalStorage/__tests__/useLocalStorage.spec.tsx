import { renderHook } from '@testing-library/react';
import { act } from 'react-dom/test-utils';
import LocalStorageMock from './LocalStorageMock';
import { useLocalStorage } from '../useLocalStorage';

Object.defineProperty(window, 'localStorage', {
  value: new LocalStorageMock(),
});

describe('hooks/useLocalStorage', () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return a string value', () => {
    const { result } = renderHook(() => useLocalStorage('key', 'value'));

    expect(result.current[0]).toBe('value');
  });

  it('should return json object', () => {
    const { result } = renderHook(() => useLocalStorage('key', { value: 123 }));

    expect(result.current[0].value).toBe(123);
  });

  it('should return a callback function', () => {
    const { result } = renderHook(() => useLocalStorage('key', () => 'value'));

    expect(result.current[0]?.()).toBe('value');
  });

  it('should return an array', () => {
    const { result } = renderHook(() => useLocalStorage('key', [1, 2]));

    expect(result.current[0]).toEqual([1, 2]);
  });

  it('should update localStorage', () => {
    const { result } = renderHook(() => useLocalStorage('key', 'oldValue'));

    act(() => {
      const setState = result.current[1];
      setState('newValue');
    });

    expect(result.current[0]).toBe('newValue');
  });
});
