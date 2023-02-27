import { screen, fireEvent } from '@testing-library/react';
import { renderWithAppProviders } from 'utils/test-utils.test';
import { PageNumberInput } from '../PageNumberInput';

describe('components/Input/PrivateLinkView', () => {
  it('should keep the current page number when blur with empty string', () => {
    const handlePageSwitch = jest.fn();
    renderWithAppProviders(
      <PageNumberInput currentPageNumber={1} totalPageCount={1} handlePageSwitch={handlePageSwitch} />,
    );

    const input: HTMLInputElement = screen.getByLabelText(/Find Page/);
    fireEvent.change(input, { taget: { value: '' } });
    fireEvent.blur(input);
    expect(input.value).toBe('1');
  });
});
