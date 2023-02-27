import { screen, fireEvent } from '@testing-library/react';
import { mockAddNewPage, renderWithRedux } from 'utils/test-utils.test';
import Editor from 'modules/Editor/Editor';
import { InfographLoader } from 'modules/InfographLoader';
import { EMPTY_INFOGRAPH } from 'utils/loadSampleInfograph';
import { DOWNLOAD_MODAL_HELP_LINK } from 'constants/links';

describe('components/Navbar/DownloadModal', () => {
  const setup = () => {
    renderWithRedux(
      <InfographLoader infographState={EMPTY_INFOGRAPH}>
        <Editor />
      </InfographLoader>,
    );

    const downloadModalTrigger = screen.getByTestId('download-infograph-button');

    return {
      downloadModalTrigger,
    };
  };

  it('should work as expected', async () => {
    const { downloadModalTrigger } = setup();

    // Should open the modal
    fireEvent.click(downloadModalTrigger);
    const downloadModalBody = await screen.findByTestId('download-modal-body');
    expect(downloadModalBody).toBeInTheDocument();

    const accessibilityMenuTriggers = await screen.findAllByTestId('accessibility-check-prompt-button');
    // It seems redundant but `await` needs here due to weird act error with React 18 from the library.
    // if updating this test, please check if the issue is gone.
    // Ref: https://github.com/testing-library/react-testing-library/issues/1051
    await fireEvent.click(accessibilityMenuTriggers[0]);
    // Should open the accessibility menu
    const accessibilityMenuBody = await screen.findByTestId(/accessibility-menu/);
    expect(accessibilityMenuBody).toBeInTheDocument();

    // Should have the correct help link
    const pdfInfoButton = await screen.findByTestId('pdf-info-iconBtn');
    fireEvent.click(pdfInfoButton);
    const helpLink = await screen.findByTestId('a11y-help-link');
    expect(helpLink).toHaveAttribute('href', DOWNLOAD_MODAL_HELP_LINK);
  });

  it('should have png options still enabled when the design has more than 1 page', async () => {
    const { downloadModalTrigger } = setup();

    mockAddNewPage();

    // Should open the modal
    fireEvent.click(downloadModalTrigger);
    const downloadModalBody = await screen.findByTestId('download-modal-body');
    expect(downloadModalBody).toBeInTheDocument();

    // All Png options (PNG, PNGHD) should be disabled
    const pngOptions = await screen.findAllByRole('radio', { name: /PNG/ });
    expect(pngOptions).toHaveLength(2);
    expect(pngOptions[0]).not.toBeDisabled();
    expect(pngOptions[1]).not.toBeDisabled();
  });

  it('should not have custom option box when single page', async () => {
    const { downloadModalTrigger } = setup();

    // Should open the modal
    fireEvent.click(downloadModalTrigger);
    const customPageSelectHeaderInSinglePage = screen.queryByText('Select Pages');
    expect(customPageSelectHeaderInSinglePage).not.toBeInTheDocument();

    mockAddNewPage();

    const customPageSelectHeaderInMultipage = await screen.findByText('Select Pages');
    expect(customPageSelectHeaderInMultipage).toBeInTheDocument();
  });
});
