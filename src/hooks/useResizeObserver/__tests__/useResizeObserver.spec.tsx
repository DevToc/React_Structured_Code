import { render } from '@testing-library/react';
import { act } from 'react-dom/test-utils';
import { useResizeObserver } from '../useResizeObserver';
import { useRenderTrigger, awaitNextFrame } from './utils';

/**
 * Note: we did not install ResizeObserver polyfill for nodejs
 */
beforeEach(() => {
  Object.defineProperty(global, 'ResizeObserver', {
    writable: true,
    value: jest.fn().mockImplementation(() => ({
      observe: jest.fn(() => 'Mocking works'),
      unobserve: jest.fn(),
      disconnect: jest.fn(),
    })),
  });
});

describe('hook/useResizeObserver', () => {
  it('should render without error', async () => {
    let triggerRender = async () => {};
    const Component = () => {
      const { ref } = useResizeObserver<HTMLDivElement>({
        // This is only here so that each render passes a different callback
        // instance through to the hook.
        onResize: () => {
          console.log('resize callback');
        },
      });

      triggerRender = useRenderTrigger();

      return <div ref={ref} />;
    };

    render(<Component />);

    await act(async () => {
      await triggerRender();
      await awaitNextFrame();
    });

    // TO-DO: We can mock some resize update later on
  });
});
