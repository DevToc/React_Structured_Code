import { useEffect } from 'react';
import { render } from '@testing-library/react';
import { act } from 'react-dom/test-utils';
import { useDebouncedCallback } from '../useDebouncedCallback';

jest.useFakeTimers('modern');

describe('hooks/useDebounce', () => {
  it('will trigger callback once only when component mount', () => {
    const callback = jest.fn();

    function Component() {
      const doSomething = useDebouncedCallback(callback, 1000);
      useEffect(() => {
        doSomething();
      }, []);
      return null;
    }

    render(<Component />);

    // Expect callback not fire in initial render
    expect(callback.mock.calls.length).toBe(0);

    act(() => {
      jest.runAllTimers();
    });

    // Expect callback trigger after component did mount
    expect(callback.mock.calls.length).toBe(1);
  });

  it('debounce callback and return the result of the last function invocation', () => {
    const expectedResult = 'final';
    const callback = jest.fn((param) => expect(param).toBe(expectedResult));

    function Component() {
      const save = useDebouncedCallback(callback, 1000);
      // First save call immediatelly
      save('first');
      useEffect(() => {
        // Second save call
        save('second');
        // After 500ms, trigger third save call
        setTimeout(() => {
          save(expectedResult);
        }, 500);
      }, []);

      return null;
    }

    render(<Component />);

    // Expect callback not fire in initial render
    expect(callback.mock.calls.length).toBe(0);

    act(() => {
      jest.runAllTimers();
    });

    // Expect callback trigger after component did mount
    expect(callback.mock.calls.length).toBe(1);
  });
});
