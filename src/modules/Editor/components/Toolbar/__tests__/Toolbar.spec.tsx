import { screen, fireEvent, within } from '@testing-library/react';
import { act } from 'react-dom/test-utils';
import { renderWithRedux, mockSetActiveWidget, mockAddBasicShapeWidget } from 'utils/test-utils.test';
import { WIDGET_LOCK_CLASS } from 'constants/bounding-box';
import Editor from 'modules/Editor/Editor';
import { InfographLoader } from 'modules/InfographLoader';
import { EMPTY_INFOGRAPH } from 'utils/loadSampleInfograph';

import { Toolbar } from '../Toolbar';
import { Key } from 'constants/keyboard';
import { EDITOR_TOOLBAR_ID } from 'modules/Editor/Editor.config';
import { SCROLL_CONTAINER_ID } from 'modules/Editor/components/PageArea/PageArea.config';

describe('components/Toolbar', () => {
  it('should delete widget', () => {
    renderWithRedux(
      <InfographLoader infographState={EMPTY_INFOGRAPH}>
        <Editor />
      </InfographLoader>,
    );

    mockAddBasicShapeWidget();

    const widget = screen.queryAllByTestId(/widgetbase-/)[0];
    const deleteButton = screen.getByLabelText(/Delete widget/);

    fireEvent.click(deleteButton);

    expect(widget).not.toBeInTheDocument();
  });

  it('should have higher z-index than scroll container', () => {
    renderWithRedux(
      <InfographLoader infographState={EMPTY_INFOGRAPH}>
        <Editor />
      </InfographLoader>,
    );
    const toolbar = screen.getByTestId(EDITOR_TOOLBAR_ID);
    const scrollContainer = screen.getByTestId(SCROLL_CONTAINER_ID);
    const scrollbarContainerStyle = window.getComputedStyle(scrollContainer) as CSSStyleDeclaration;

    expect(toolbar).toHaveStyle('z-index: var(--vg-zIndices-toolbar)');
    expect(scrollbarContainerStyle).not.toContain('z-index');
  });

  /**
   * This is to ensure z-index works as expected.
   */
  it('should have scroll container as next sibling', () => {
    renderWithRedux(
      <InfographLoader infographState={EMPTY_INFOGRAPH}>
        <Editor />
      </InfographLoader>,
    );

    const toolbar = screen.getByTestId(EDITOR_TOOLBAR_ID);
    const scrollContainer = screen.getByTestId(SCROLL_CONTAINER_ID);

    // eslint-disable-next-line testing-library/no-node-access
    expect(toolbar.nextSibling).toBe(scrollContainer);
  });

  it('should lock widget', async () => {
    renderWithRedux(
      <InfographLoader infographState={EMPTY_INFOGRAPH}>
        <Editor />
      </InfographLoader>,
    );

    mockAddBasicShapeWidget();
    const widget = screen.queryAllByTestId(/widgetbase-/)[0];
    const lockButton = screen.getByLabelText(/Lock/);

    // see https://github.com/testing-library/react-testing-library/issues/1051
    // eslint-disable-next-line testing-library/no-unnecessary-act
    await act(async () => {
      fireEvent.click(lockButton);
    });

    expect(widget.classList.contains(WIDGET_LOCK_CLASS)).toBe(true);
  });

  it('should move widgets in layer', async () => {
    renderWithRedux(
      <InfographLoader infographState={EMPTY_INFOGRAPH}>
        <Editor />
      </InfographLoader>,
    );

    mockAddBasicShapeWidget();
    mockAddBasicShapeWidget();
    mockAddBasicShapeWidget();

    const widget = screen.queryAllByTestId(/widgetbase-/)[0];
    mockSetActiveWidget(widget.id);

    const layerButton = screen.getByTestId('widget-layer-menu-trigger-button');
    fireEvent.click(layerButton);

    const layerContent = screen.getByTestId('widget-layer-menu-content');
    const [moveToFront, moveForward, moveBackwards, moveToBack] = await within(layerContent).findAllByRole('button');

    fireEvent.click(moveToFront);
    expect(widget).toHaveStyle('z-index: 2');

    fireEvent.click(moveToBack);
    expect(widget).toHaveStyle('z-index: 0');

    fireEvent.click(moveForward);
    expect(widget).toHaveStyle('z-index: 1');

    fireEvent.click(moveBackwards);
    expect(widget).toHaveStyle('z-index: 0');
  });

  it('should has layer enabled with a locked widget', async () => {
    renderWithRedux(
      <InfographLoader infographState={EMPTY_INFOGRAPH}>
        <Editor />
      </InfographLoader>,
    );

    mockAddBasicShapeWidget();

    const lockButton = screen.getByLabelText(/Lock/);
    // see https://github.com/testing-library/react-testing-library/issues/1051
    // eslint-disable-next-line testing-library/no-unnecessary-act
    await act(async () => {
      fireEvent.click(lockButton);
    });

    const layerButton = screen.getByTestId('widget-layer-menu-trigger-button');
    expect(layerButton).not.toBeDisabled();
  });

  it('should hide layer popover when deleting a widget', () => {
    renderWithRedux(
      <InfographLoader infographState={EMPTY_INFOGRAPH}>
        <Editor />
      </InfographLoader>,
    );

    mockAddBasicShapeWidget();

    const widgetsBefore = screen.queryAllByTestId(/widgetbase-/);
    const firstWidget = widgetsBefore[0];
    firstWidget.focus();

    const layerButton = screen.getByTestId('widget-layer-menu-trigger-button');
    const layerContent = screen.getByTestId('widget-layer-menu-content');
    fireEvent.click(layerButton);

    expect(layerButton).toHaveAttribute('aria-expanded', 'true');
    expect(firstWidget).toHaveFocus();

    fireEvent.keyDown(layerContent, { which: Key.Delete });
    const widgetsAfter = screen.queryAllByTestId(/widgetbase-/);
    expect(widgetsAfter.length).toEqual(0);
    expect(layerButton).not.toHaveAttribute('aria-expanded', 'true');
  });

  it('should duplicate widget on click', () => {
    renderWithRedux(
      <InfographLoader infographState={EMPTY_INFOGRAPH}>
        <Editor />
      </InfographLoader>,
    );

    mockAddBasicShapeWidget();

    const duplicateButton = screen.getByLabelText(/^Duplicate$/);
    const allWidgets = screen.getAllByTestId(/widgetbase/);

    expect(duplicateButton).toBeInTheDocument();
    fireEvent.click(duplicateButton);

    const allWidgetsAfter = screen.getAllByTestId(/widgetbase/);
    expect(allWidgetsAfter.length).toEqual(allWidgets.length + 1);
  });

  it('buttons should be focusable', () => {
    renderWithRedux(<Toolbar />);
    mockAddBasicShapeWidget();

    const layerButton = screen.getByTestId('widget-layer-menu-trigger-button');
    const lockButton = screen.getByLabelText(/Lock/);
    const deleteButton = screen.getByLabelText(/Delete widget/);
    const duplicateButton = screen.getByLabelText(/^Duplicate$/);

    layerButton.focus();
    expect(layerButton).toHaveFocus();
    lockButton.focus();
    expect(lockButton).toHaveFocus();
    deleteButton.focus();
    expect(deleteButton).toHaveFocus();
    duplicateButton.focus();
    expect(duplicateButton).toHaveFocus();
  });
});
