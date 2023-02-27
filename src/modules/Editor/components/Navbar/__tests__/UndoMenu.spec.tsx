import { screen } from '@testing-library/react';
import { fireEvent } from '@testing-library/react';
import { renderWithRedux, mockSetActiveWidget, mockAddBasicShapeWidget } from '../../../../../utils/test-utils.test';
import Editor from '../../../Editor';
import { InfographLoader } from '../../../../InfographLoader';
import { EMPTY_INFOGRAPH } from '../../../../../utils/loadSampleInfograph';

describe('components/Navbar/UndoMenu', () => {
  it('should undo and redo', () => {
    renderWithRedux(
      <InfographLoader infographState={EMPTY_INFOGRAPH}>
        <Editor />
      </InfographLoader>,
    );

    mockAddBasicShapeWidget();

    const widget = screen.queryAllByTestId(/widgetbase-/)[0];
    const widgetId = widget.id;

    mockSetActiveWidget(widgetId);

    const undoButton = screen.getByLabelText(/undo/i);
    const redoButton = screen.getByLabelText(/redo/i);
    const deleteButton = screen.getByLabelText(/Delete widget/);

    fireEvent.click(deleteButton);
    expect(widget).not.toBeInTheDocument();

    fireEvent.click(undoButton);
    expect(screen.getByTestId(`widgetbase-${widgetId}`)).toBeInTheDocument();

    fireEvent.click(redoButton);
    expect(screen.queryByTestId(`widgetbase-${widgetId}`)).not.toBeInTheDocument();
  });
});
