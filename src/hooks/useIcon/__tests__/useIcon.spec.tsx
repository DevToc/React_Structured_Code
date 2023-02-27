import { act } from 'react-dom/test-utils';
import { renderHook } from '@testing-library/react';
import { useIcon } from '../useIcon';

describe('hooks/useIcon', () => {
  it('should return icon metadata', async () => {
    jest.spyOn(global, 'fetch').mockImplementation(
      // @ts-ignore
      () => Promise.resolve({ json: () => Promise.resolve({ svg: expectedSvg }) }),
    );

    const expectedSvg = '<svg />';
    const iconId = 'icons8-997';
    const { result } = renderHook(() => () => act(useIcon(iconId)));
    expect(result.current.data).toBeUndefined();

    // TODO: add async hook test when it's fully supported by @testing-library/react
    // expect(result.current.data?.svg).toEqual(expectedSvg);
  });
});
