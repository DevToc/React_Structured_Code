import { screen, fireEvent } from '@testing-library/react';
import { renderWithAppProviders } from '../../../../../utils/test-utils.test';
import { TitleInput } from '../TitleInput';

const TITLE_INPUT_TEST_ID = 'infographtitle-input';

describe('components/TitleInput', () => {
  it('should render the TitleInput button', () => {
    renderWithAppProviders(<TitleInput title={'Document Title'} onSubmit={() => {}} />);

    expect(screen.getByTestId(TITLE_INPUT_TEST_ID)).toBeInTheDocument();
  });

  it('should trigger onSubmit callback on Enter key press', () => {
    const expectedResult = 'New Document Title';
    const onSubmitCallback = jest.fn((param) => expect(param).toBe(expectedResult));

    renderWithAppProviders(<TitleInput title={'Document Title'} onSubmit={onSubmitCallback} />);

    const titleInputElement = screen.getByPlaceholderText('Document Title');

    titleInputElement.focus();
    expect(titleInputElement).toHaveFocus();

    // Expect callback not to trigger when changing input
    fireEvent.change(titleInputElement, { target: { value: expectedResult } });
    expect(onSubmitCallback).toBeCalledTimes(0);

    // Expect callback to trigger when hitting Enter
    fireEvent.keyDown(titleInputElement as HTMLElement, { key: 'Enter', code: 'Enter', charCode: 13 });
    expect(onSubmitCallback).toBeCalledTimes(1);
  });
});
