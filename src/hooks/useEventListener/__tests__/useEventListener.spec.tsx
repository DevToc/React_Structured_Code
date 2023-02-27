import { fireEvent, renderHook } from '@testing-library/react';
import { useEventListener } from '../useEventListener';

describe('hook/useEventListener', () => {
  const eventName = 'keydown';
  const windowAddEventListenerSpy = jest.spyOn(window, 'addEventListener');
  const windowRemoveEventListenerSpy = jest.spyOn(window, 'removeEventListener');

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should bind the keypress event listener to the window', () => {
    renderHook(() => useEventListener(eventName, jest.fn()));

    expect(windowAddEventListenerSpy).toHaveBeenCalledWith(eventName, expect.anything());
  });

  it('should unbind unbind event listener from the window after hook unmounted', () => {
    const { unmount } = renderHook(() => useEventListener(eventName, jest.fn()));

    expect(windowAddEventListenerSpy).toHaveBeenCalledWith(eventName, expect.anything());

    unmount();

    expect(windowRemoveEventListenerSpy).toHaveBeenCalledWith(eventName, expect.anything());
  });

  it('should call event handler when event triggered', () => {
    const handler = jest.fn();
    const ref = { current: document.createElement('div') };

    renderHook(() => useEventListener(eventName, handler, ref));

    fireEvent.keyDown(ref.current);

    expect(handler).toHaveBeenCalledTimes(1);
  });
});
