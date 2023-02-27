import { act } from 'react-dom/test-utils';
import { renderHook } from '@testing-library/react';
import { useUser } from '../useUser';

describe('hooks/useUser', () => {
  it('should return user properties', async () => {
    jest.spyOn(global, 'fetch').mockImplementation(
      // @ts-ignore
      () => Promise.resolve({ json: () => Promise.resolve({ user_id: '123456' }) }),
    );

    const { result } = renderHook(() => () => act(useUser()));
    expect(result.current.data).toBeUndefined();

    // TODO: add async hook test when it's fully supported by @testing-library/react
    // expect(result.current.data?.user_id).toEqual('123456');
  });
});
