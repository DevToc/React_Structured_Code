/* eslint-disable testing-library/no-node-access */
import { screen } from '@testing-library/react';
import { renderWithRedux } from 'utils/test-utils.test';
import { DownloadButton } from '../DownloadButton';
import { DownloadOption } from 'constants/download';
import { DownloadButtonProps } from '../DownloadModal.types';

describe('components/Navbar/DownloadButton', () => {
  const defaultProps = {
    downloadOption: DownloadOption.InteractivePDF,
    isValidRange: true,
    selectedPageNumbers: [],
  };

  const setup = ({ downloadOption, shouldDisable, selectedPageNumbers }: DownloadButtonProps) => {
    renderWithRedux(
      <DownloadButton
        downloadOption={downloadOption}
        shouldDisable={shouldDisable}
        selectedPageNumbers={selectedPageNumbers}
      />,
    );

    const downloadBtn = screen.getByRole('button', { name: /Download/ });

    return {
      downloadBtn,
    };
  };

  it('should disable the button when the custom page range input is invalid', () => {
    const { downloadBtn } = setup({
      ...defaultProps,
      shouldDisable: true,
    });

    expect(downloadBtn).toBeDisabled();
    expect(downloadBtn).toHaveStyle({ opacity: 0.4, cursor: 'not-allowed' });
  });
});
