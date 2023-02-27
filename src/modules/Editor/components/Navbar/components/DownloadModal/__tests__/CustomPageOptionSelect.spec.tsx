/* eslint-disable testing-library/no-node-access */
import { screen } from '@testing-library/react';
import { renderWithAppProviders } from 'utils/test-utils.test';
import { CustomPageOptionSelect } from '../CustomPageOptionSelect';
import { CustomPageOption } from 'constants/download';
import { CustomPageOptionProps } from '../DownloadModal.types';

describe('components/Navbar/DownloadOptionSelect', () => {
  const defaultProps = {
    customPageRangeOption: CustomPageOption.All,
    handleCustomPageRangeOption: jest.fn(),
    handleCustomPageRangeInput: jest.fn(),
    isFreeUser: false,
    isPremiumUser: false,
    isValidRange: true,
  };

  const setup = ({
    customPageRangeOption,
    handleCustomPageRangeOption,
    handleCustomPageRangeInput,
    isFreeUser,
    isPremiumUser,
    isValidRange,
  }: CustomPageOptionProps) => {
    renderWithAppProviders(
      <CustomPageOptionSelect
        customPageRangeOption={customPageRangeOption}
        handleCustomPageRangeOption={handleCustomPageRangeOption}
        handleCustomPageRangeInput={handleCustomPageRangeInput}
        isFreeUser={isFreeUser}
        isPremiumUser={isPremiumUser}
        isValidRange={isValidRange}
      />,
    );

    const allOptionRadioElement = screen.getByRole('radio', { name: /All/ });
    const customOptionRadioElement = screen.getByRole('radio', { name: /Custom/ });

    return {
      allOptionRadioElement,
      customOptionRadioElement,
    };
  };

  it('should have `All` as default selected option should have correct background color', () => {
    const { allOptionRadioElement } = setup(defaultProps);

    expect(allOptionRadioElement).toBeChecked();
    expect(allOptionRadioElement).toHaveStyle({ backgroundColor: 'upgrade.blue.50' });
  });

  it('should have `Custom` as not selected while other option is selected', () => {
    const { customOptionRadioElement } = setup(defaultProps);

    expect(customOptionRadioElement).not.toBeChecked();
    expect(customOptionRadioElement).toHaveStyle({ backgroundColor: '' });
  });

  it('should have correct background color when `Custom` is selected option', () => {
    const { customOptionRadioElement } = setup({
      ...defaultProps,
      customPageRangeOption: CustomPageOption.Custom,
    });

    expect(customOptionRadioElement).toBeChecked();
    expect(customOptionRadioElement).toHaveStyle({ backgroundColor: 'upgrade.blue.50' });
  });

  it('should have `All` as not selected while other option is selected', () => {
    const { allOptionRadioElement } = setup({
      ...defaultProps,
      customPageRangeOption: CustomPageOption.Custom,
    });

    expect(allOptionRadioElement).not.toBeChecked();
    expect(allOptionRadioElement).toHaveStyle({ backgroundColor: '' });
  });

  it('should disable custom page range options for free users', () => {
    const { allOptionRadioElement, customOptionRadioElement } = setup({
      ...defaultProps,
      isFreeUser: true,
    });

    const lockDownloadIcon = screen.getByTestId('lock-download-icon');
    expect(lockDownloadIcon).toBeInTheDocument();
    expect(allOptionRadioElement).toBeDisabled();
    expect(customOptionRadioElement).toBeDisabled();
  });

  it('should disable custom page range options for premium users', () => {
    const { allOptionRadioElement, customOptionRadioElement } = setup({
      ...defaultProps,
      isPremiumUser: true,
    });

    const lockDownloadIcon = screen.getByTestId('lock-download-icon');
    expect(lockDownloadIcon).toBeInTheDocument();
    expect(allOptionRadioElement).toBeDisabled();
    expect(customOptionRadioElement).toBeDisabled();
  });

  it('should display an error message for invalid input', () => {
    setup({ ...defaultProps, isValidRange: false });

    const INVALID_ERROR_MESSAGE = 'Invalid page range, use e.g. 1-5, 7, 10-11';
    const invalidErrorIcon = screen.getByTestId('error-alert-icon');
    const errorMessage = invalidErrorIcon.nextElementSibling;

    expect(invalidErrorIcon).toBeInTheDocument();
    expect(errorMessage).toBeInTheDocument();
    expect(errorMessage).toHaveTextContent(INVALID_ERROR_MESSAGE);
  });
});
