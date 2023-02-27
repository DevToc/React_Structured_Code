import { screen, fireEvent, waitForElementToBeRemoved } from '@testing-library/react';
import { waitFor } from '@testing-library/react';

import { renderWithRedux } from 'utils/test-utils.test';
import { Navbar } from 'modules/Editor/components/Navbar';

describe('components/Navbar/SharePanel', () => {
  it('should open share panel when clicking share button on navbar', async () => {
    renderWithRedux(<Navbar />);

    // should see share panel when click share button on navbar
    const shareButtonElement = screen.getByTestId('share-infograph-button');
    fireEvent.click(shareButtonElement);
    const sharePanelElement = screen.getByTestId('share-panel');
    await waitFor(
      () => {
        expect(sharePanelElement).toBeVisible();
      },
      { timeout: 10000 },
    );

    // should close the modal
    const closeButtonElement = screen.getByTestId('close-download-modal-button');
    fireEvent.click(closeButtonElement);
    await waitForElementToBeRemoved(sharePanelElement);
    expect(sharePanelElement).not.toBeInTheDocument();
  });
});
