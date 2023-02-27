import { screen, fireEvent } from '@testing-library/react';

import { renderWithRedux } from '../../../../../../utils/test-utils.test';
import Editor from '../../../../Editor';
import { InfographLoader } from '../../../../../InfographLoader';
import { EMPTY_INFOGRAPH } from '../../../../../../utils/loadSampleInfograph';

describe('components/Navbar/SetLanguageModal', () => {
  it('should render SetLanguageModal and work as expected', async () => {
    renderWithRedux(
      <InfographLoader infographState={EMPTY_INFOGRAPH}>
        <Editor />
      </InfographLoader>,
    );

    // Should open the modal
    const modalTrigger = screen.getByTestId('setDocumentLanguage');
    fireEvent.click(modalTrigger);
    const downloadModalBody = screen.getByTestId('setLanguage-modal-body');
    expect(downloadModalBody).toBeInTheDocument();

    // Should be able to choose the option from language selection
    const selectTrigger: HTMLSelectElement = screen.getByTestId('setLanguage-select');
    const selectOptions: HTMLOptionElement[] = screen.getAllByTestId('setLanguage-option');
    fireEvent.click(selectTrigger, { target: { value: 'ar' } });
    expect(selectOptions[0].selected).toBeFalsy();
    expect(selectOptions[1].selected).toBeFalsy();
    expect(selectOptions[3].selected).toBeTruthy();
  });
});
