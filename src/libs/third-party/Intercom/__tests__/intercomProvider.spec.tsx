import { render, screen, renderHook } from '@testing-library/react';
import { IntercomProvider } from '../intercomProvider';
import { useIntercom } from '../intercomProvider';
import * as initFn from '../initialize';

describe('IntercomProvider', () => {
  const mock = jest.spyOn(initFn, 'default').mockImplementation(() => {});

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('should call initialize', () => {
    render(<IntercomProvider>children</IntercomProvider>);

    expect(mock).toHaveBeenCalledTimes(1);
  });

  test('should render children', () => {
    render(<IntercomProvider>children</IntercomProvider>);

    const textElement = screen.getByText('children');
    expect(textElement).toBeDefined();
  });
});

describe('useIntercom', () => {
  test('should be available when wrapped in context', () => {
    const { result } = renderHook(() => useIntercom(), {
      wrapper: ({ children }) => <IntercomProvider>{children}</IntercomProvider>,
    });
    expect(result.current.boot).toBeDefined();
    expect(result.current.shutdown).toBeDefined();
    expect(result.current.startTour).toBeDefined();
    expect(result.current.trackEvent).toBeDefined();
    expect(result.current.showArticle).toBeDefined();
  });
});
