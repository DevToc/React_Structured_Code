import { fireEvent, screen } from '@testing-library/react';
import Editor from 'modules/Editor/Editor';

import { InfographLoader } from 'modules/InfographLoader';
import { EMPTY_INFOGRAPH } from 'utils/loadSampleInfograph';
import {
  mockAddIconWidget,
  mockSetActiveWidget,
  mockAddBasicShapeWidget,
  renderWithRedux,
} from 'utils/test-utils.test';

describe('components/ReplaceMenu', () => {
  it('should work with widgets', () => {
    renderWithRedux(
      <InfographLoader infographState={EMPTY_INFOGRAPH}>
        <Editor />
      </InfographLoader>,
    );

    mockAddIconWidget();
    mockAddIconWidget();
    mockAddBasicShapeWidget();

    const [iconOneWidget, iconTwoWidget, basicShapeWidget] = screen.queryAllByTestId(/widgetbase-/);
    mockSetActiveWidget(iconOneWidget.id);

    // double click should open the replace menu
    fireEvent.doubleClick(iconOneWidget);
    const replaceMenu = screen.getByTestId('replace-menu');
    expect(replaceMenu).toBeInTheDocument();

    // selecting another icon widget should keep the replace menu open
    mockSetActiveWidget(iconTwoWidget.id);
    expect(replaceMenu).toBeInTheDocument();

    // selecting another non-replace widget should close the replace menu
    mockSetActiveWidget(basicShapeWidget.id);
    expect(replaceMenu).not.toBeInTheDocument();
  });
});
