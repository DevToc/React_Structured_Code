import { screen, fireEvent } from '@testing-library/react';
import { renderWithRedux, mockSetActiveWidget, mockAddBasicShapeWidget } from 'utils/test-utils.test';
import { EMPTY_INFOGRAPH } from 'utils/loadSampleInfograph';
import { Key } from 'constants/keyboard';

import { InfographLoader } from 'modules/InfographLoader';
import Editor from 'modules/Editor';

describe('components/GroupWidgetMenu', () => {
  it('Group toggle button should be disabled if single widget selected', () => {
    renderWithRedux(
      <InfographLoader infographState={EMPTY_INFOGRAPH}>
        <Editor />
      </InfographLoader>,
    );

    mockAddBasicShapeWidget();
    const widget = screen.queryAllByTestId(/widgetbase-/)[0];
    mockSetActiveWidget(widget.id);

    const groupButton = screen.getByTestId('group-widget-menu');
    expect(groupButton).toBeDisabled();
  });

  it('Group toggle button should be enabled as group if multiple widgets are selected', () => {
    renderWithRedux(
      <InfographLoader infographState={EMPTY_INFOGRAPH}>
        <Editor />
      </InfographLoader>,
    );

    mockAddBasicShapeWidget();
    mockAddBasicShapeWidget();
    fireEvent.keyDown(document.body, { which: Key.A, metaKey: true });

    const groupButton = screen.getByTestId('group-widget-menu');
    expect(groupButton).not.toBeDisabled();

    const group = screen.getByText(/Group/i);
    expect(group).toBeInTheDocument();
  });

  it('Group toggle button should be enabled as ungroup if a group is selected', () => {
    renderWithRedux(
      <InfographLoader infographState={EMPTY_INFOGRAPH}>
        <Editor />
      </InfographLoader>,
    );

    mockAddBasicShapeWidget();
    mockAddBasicShapeWidget();
    fireEvent.keyDown(document.body, { which: Key.A, metaKey: true });

    const groupButton = screen.getByTestId('group-widget-menu');
    fireEvent.click(groupButton);

    const group = screen.getByText(/Ungroup/i);
    expect(group).toBeInTheDocument();
  });

  it('Group should be disabled after duplicating and undoing', () => {
    renderWithRedux(
      <InfographLoader infographState={EMPTY_INFOGRAPH}>
        <Editor />
      </InfographLoader>,
    );

    // make a new group
    mockAddBasicShapeWidget();
    mockAddBasicShapeWidget();
    fireEvent.keyDown(document.body, { which: Key.A, metaKey: true });
    const groupButton = screen.getByTestId('group-widget-menu');
    fireEvent.click(groupButton);

    // duplicate the group
    const duplicateButton = screen.getByLabelText(/^Duplicate$/);
    fireEvent.click(duplicateButton);

    // undo the duplication
    const undoButton = screen.getByLabelText(/undo/i);
    fireEvent.click(undoButton);

    // group button should be disabled
    expect(groupButton).toBeDisabled();
  });
});
