import { screen, fireEvent } from '@testing-library/react';
import { mockAddNewPage, renderWithRedux } from 'utils/test-utils.test';
import PrivateLinkView from 'modules/PrivateLinkView/PrivateLinkView';
import { InfographLoader } from 'modules/InfographLoader';
import { EMPTY_INFOGRAPH } from 'utils/loadSampleInfograph';

describe('modules/PrivateLinkView/PageNavigation', () => {
  const setup = () => {
    renderWithRedux(
      <InfographLoader infographState={EMPTY_INFOGRAPH}>
        <PrivateLinkView />
      </InfographLoader>,
    );

    const input: HTMLInputElement = screen.getByLabelText(/Find Page/);
    const prevBtn = screen.getByLabelText(/Previous Page/);
    const nextBtn = screen.getByLabelText(/Next Page/);

    return {
      input,
      prevBtn,
      nextBtn,
    };
  };

  it('Should navigate to the correct page', () => {
    const { input, nextBtn, prevBtn } = setup();

    // Navigation button should work as expected
    mockAddNewPage();
    fireEvent.click(nextBtn);
    expect(input.value).toBe('2');

    mockAddNewPage();
    fireEvent.click(nextBtn);
    expect(input.value).toBe('3');
    expect(nextBtn).toBeDisabled();

    fireEvent.click(prevBtn);
    expect(input.value).toBe('2');

    fireEvent.click(prevBtn);
    expect(input.value).toBe('1');
    expect(prevBtn).toBeDisabled();
  });

  it('Should handle exceptions with manual input', () => {
    const { input } = setup();

    // Add 2 new pages
    mockAddNewPage();
    mockAddNewPage();
    // Handle exceptions
    fireEvent.change(input, { target: { value: 99 } });
    fireEvent.keyDown(input, { key: 'Enter' });
    // Go to the last page
    expect(input.value).toBe('3');

    fireEvent.change(input, { target: { value: 0 } });
    fireEvent.keyDown(input, { key: 'Enter' });
    // Go to the first page
    expect(input.value).toBe('1');

    // Blur case will also be handled
    fireEvent.change(input, { target: { value: 99 } });
    fireEvent.blur(input);
    expect(input.value).toBe('3');

    // Blur with empty string should turn the value back to the current page
    fireEvent.change(input, { target: { value: '' } });
    fireEvent.blur(input);
    expect(input.value).toBe('3');
  });
});
