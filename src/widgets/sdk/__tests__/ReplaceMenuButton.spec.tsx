import { fireEvent, screen } from '@testing-library/react';

import Editor from 'modules/Editor';
import { InfographLoader } from 'modules/InfographLoader';
import { EMPTY_INFOGRAPH } from 'utils/loadSampleInfograph';
import { mockAddIconWidget, mockSetActiveWidget, renderWithRedux } from 'utils/test-utils.test';

describe('ReplaceMenuButton', () => {
  it('should open the replace menu properly', () => {
    renderWithRedux(
      <InfographLoader infographState={EMPTY_INFOGRAPH}>
        <Editor />
      </InfographLoader>,
    );

    mockAddIconWidget();

    const widget = screen.queryAllByTestId(/widgetbase-/)[0];
    mockSetActiveWidget(widget.id);

    const replaceButton = screen.getByRole('button', { name: /Replace/ });
    fireEvent.click(replaceButton);

    // replaceButton should toggle the replace menu
    const replaceMenu = screen.getByTestId('replace-menu');
    expect(replaceMenu).toBeInTheDocument();
    fireEvent.click(replaceButton);
    expect(replaceMenu).not.toBeInTheDocument();
  });
});
