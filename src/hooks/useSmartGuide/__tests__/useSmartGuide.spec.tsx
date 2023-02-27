import { renderHook } from '@testing-library/react';
import { useSmartGuide } from '../useSmartGuide';

describe('hook/useSmartGuide', () => {
  it('should render', () => {
    const targetElement = document.getElementById('smartguide-container') as HTMLElement;
    const config = {
      zIndex: 9999,
      enableSnap: true,
      zoomPercent: 100,
    };
    const { result } = renderHook(() => useSmartGuide(targetElement, config));

    // TODO: need to test [setSmartGuideConfig, compute, match, hide]
  });
});
