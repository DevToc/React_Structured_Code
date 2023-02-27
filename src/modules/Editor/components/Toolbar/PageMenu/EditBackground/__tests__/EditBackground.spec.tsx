import { screen, fireEvent } from '@testing-library/react';
import { InfographLoader } from 'modules/InfographLoader';
import { renderWithRedux } from 'utils/test-utils.test';
import { EMPTY_INFOGRAPH } from 'utils/loadSampleInfograph';
import Editor from 'modules/Editor';
import { Key } from 'constants/keyboard';

const renderEditor = () =>
  renderWithRedux(
    <InfographLoader infographState={EMPTY_INFOGRAPH}>
      <Editor />
    </InfographLoader>,
  );

describe('PageMenu/EditBackground', () => {
  it('should change the background as expected', () => {
    renderEditor();

    const triggerButton = screen.getByText(/Edit Background/, { selector: 'button' });
    expect(triggerButton).toBeInTheDocument();

    fireEvent.click(triggerButton);

    const swatch = screen.getByTestId('color-swatch-color-#000');
    fireEvent.click(swatch);

    const page = screen.getByTestId('page-focus-element');
    expect(page).toHaveStyle(`background: #000`);

    fireEvent.keyDown(document.body, { which: Key.Z, metaKey: true });
    expect(page).toHaveStyle(`background: #fff`);
  });
});
