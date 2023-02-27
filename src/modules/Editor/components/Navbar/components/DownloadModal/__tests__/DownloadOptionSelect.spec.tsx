/* eslint-disable testing-library/no-node-access */
import { useState } from 'react';
import { screen, fireEvent } from '@testing-library/react';
import { renderWithAppProviders } from 'utils/test-utils.test';

import { DownloadOptionSelect } from '../DownloadOptionSelect';
import { DownloadOption } from 'constants/download';

type DownloadModalMockProps = {
  isFreeUser: boolean;
};

const DownloadModalMock = ({ isFreeUser }: DownloadModalMockProps) => {
  const [downloadOption, setDownloadOption] = useState<DownloadOption>(DownloadOption.InteractivePDF);
  const downloadOptionHandler = (option: DownloadOption) => setDownloadOption(option);
  return (
    <DownloadOptionSelect
      downloadOption={downloadOption}
      handleDownloadOption={downloadOptionHandler}
      isFreeUser={isFreeUser}
    />
  );
};

describe('components/Navbar/DownloadOptionSelect', () => {
  it('should select pdf as default and selected option should have correct background color', () => {
    renderWithAppProviders(<DownloadModalMock isFreeUser={false} />);

    const pdfRadioElement = screen.getByDisplayValue('InteractivePDF').parentElement;
    expect(pdfRadioElement).toHaveAttribute('data-checked');
    expect(pdfRadioElement).toHaveStyle({ backgroundColor: 'var(--vg-colors-upgrade-blue-50)' });
  });

  it('should change to png when clicking on png option and selected option should have correct background color', () => {
    renderWithAppProviders(<DownloadModalMock isFreeUser={false} />);

    const pngRadioElement = screen.getByDisplayValue('PNG').parentElement as HTMLElement;
    fireEvent.click(pngRadioElement);
    expect(pngRadioElement).toHaveAttribute('data-checked');
    expect(pngRadioElement).toHaveStyle({ backgroundColor: 'var(--vg-colors-upgrade-blue-50)' });
  });

  it('should change to pngHD when clicking on pngHD option and selected option should have correct background color', () => {
    renderWithAppProviders(<DownloadModalMock isFreeUser={false} />);

    const pngHDOptionElement = screen.getByAltText('png HD download image');
    fireEvent.click(pngHDOptionElement);
    const pngHDRadioElement = screen.getByDisplayValue('PNGHD').parentElement;
    expect(pngHDRadioElement).toHaveAttribute('data-checked');
    expect(pngHDRadioElement).toHaveStyle({ backgroundColor: 'var(--vg-colors-upgrade-blue-50)' });
  });

  it('should disable download options for free user', () => {
    renderWithAppProviders(<DownloadModalMock isFreeUser={true} />);

    const lockDownloadIcon = screen.getByTestId('lock-download-icon');
    expect(lockDownloadIcon).toBeInTheDocument();
    const pngOptionRadioElements = screen.getAllByRole('radio', { name: /PNG/ });
    const pdfOptionRadioElement = screen.getByRole('radio', { name: /PDF/i });
    expect(pngOptionRadioElements[0]).toBeDisabled();
    expect(pngOptionRadioElements[1]).toBeDisabled();
    expect(pdfOptionRadioElement).toBeDisabled();
  });
});
