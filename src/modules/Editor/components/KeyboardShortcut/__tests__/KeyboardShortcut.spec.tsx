/* eslint-disable testing-library/no-node-access */
import { screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { act } from 'react-dom/test-utils';
import { Key } from 'constants/keyboard';
import { renderWithRedux, mockAddBasicShapeWidget, mockSetActiveWidget, mockAddNewPage } from 'utils/test-utils.test';
import Editor from 'modules/Editor/Editor';
import { InfographLoader } from 'modules/InfographLoader';
import { EMPTY_INFOGRAPH } from 'utils/loadSampleInfograph';
import { WIDGET_LOCK_CLASS } from 'constants/bounding-box';

describe('components/KeyboardShortcut', () => {
  const setup = () => {
    renderWithRedux(
      <InfographLoader infographState={EMPTY_INFOGRAPH}>
        <Editor />
      </InfographLoader>,
    );
  };

  describe('Canvas and Widgets', () => {
    it('should select and delete all widgets', () => {
      setup();

      mockAddBasicShapeWidget();
      expect(screen.queryAllByTestId(/widgetbase-/)).toHaveLength(1);

      // select all widgets
      fireEvent.keyDown(document.body, { which: Key.A, metaKey: true });
      // delete selection
      fireEvent.keyDown(document.body, { which: Key.Backspace });

      expect(screen.queryAllByTestId(/widgetbase-/)).toHaveLength(0);
    });

    it('should undo and redo', () => {
      setup();

      mockAddBasicShapeWidget();
      const widgetCount = screen.getAllByTestId(/widgetbase-/).length;
      // select all widgets
      fireEvent.keyDown(document.body, { which: Key.A, metaKey: true });
      // delete selection
      fireEvent.keyDown(document.body, { which: Key.Backspace });

      expect(screen.queryAllByTestId(/widgetbase-/)).toHaveLength(0);

      // Undo
      fireEvent.keyDown(document.body, { which: Key.Z, metaKey: true });
      expect(screen.queryAllByTestId(/widgetbase-/)).toHaveLength(widgetCount);

      // Redo
      fireEvent.keyDown(document.body, { which: Key.Y, metaKey: true });
      expect(screen.queryAllByTestId(/widgetbase-/)).toHaveLength(0);
    });

    it('should move widget in layer', () => {
      setup();

      mockAddBasicShapeWidget();
      mockAddBasicShapeWidget();
      mockAddBasicShapeWidget();

      expect(screen.queryAllByTestId(/widgetbase-/)).toHaveLength(3);

      const widget = screen.queryAllByTestId(/widgetbase-/)[0];
      mockSetActiveWidget(widget.id);

      expect(widget).toHaveStyle('z-index: 0');

      fireEvent.keyDown(document.body, { which: Key.Period, shiftKey: true, metaKey: true });
      expect(widget).toHaveStyle('z-index: 2');

      fireEvent.keyDown(document.body, { which: Key.Comma, shiftKey: true, metaKey: true });
      expect(widget).toHaveStyle('z-index: 0');

      fireEvent.keyDown(document.body, { which: Key.Period, metaKey: true });
      expect(widget).toHaveStyle('z-index: 1');

      fireEvent.keyDown(document.body, { which: Key.Comma, metaKey: true });
      expect(widget).toHaveStyle('z-index: 0');
    });

    it('should lock / unlock widget', async () => {
      setup();

      mockAddBasicShapeWidget();
      const widget = screen.queryAllByTestId(/widgetbase-/)[0];

      expect(widget.className.includes(WIDGET_LOCK_CLASS)).toBe(false);

      // lock
      // see https://github.com/testing-library/react-testing-library/issues/1051
      // eslint-disable-next-line testing-library/no-unnecessary-act
      await act(async () => {
        fireEvent.keyDown(document.body, { which: Key.L, metaKey: true, altKey: true });
      });
      const unlockButton = await screen.findByLabelText(/Unlock/);
      expect(unlockButton).toBeInTheDocument();

      expect(widget.className.includes(WIDGET_LOCK_CLASS)).toBe(true);

      // unlock
      // see https://github.com/testing-library/react-testing-library/issues/1051
      // eslint-disable-next-line testing-library/no-unnecessary-act
      await act(async () => {
        fireEvent.keyDown(document.body, { which: Key.L, metaKey: true, altKey: true });
      });
      const lockButton = await screen.findByLabelText(/Lock/);
      expect(lockButton).toBeInTheDocument();

      expect(widget.className.includes(WIDGET_LOCK_CLASS)).toBe(false);
    });

    it('should focus canvas and widgets', () => {
      setup();

      mockAddBasicShapeWidget();
      mockAddBasicShapeWidget();

      const widget = screen.queryAllByTestId(/widgetbase-/)[0];
      const widgetTwo = screen.queryAllByTestId(/widgetbase-/)[1];
      const canvas = screen.queryByTestId(/page-focus-element/);

      mockSetActiveWidget(widget.id);

      expect(widget).toHaveFocus();

      // Canvas
      fireEvent.keyDown(document.body, { which: Key.Escape });
      expect(canvas).toHaveFocus();

      fireEvent.keyDown(document.body, { which: Key.Enter });
      expect(widget).toHaveFocus();

      // Moving between widgets
      fireEvent.keyDown(document.body, { which: Key.Tab });
      expect(widgetTwo).toHaveFocus();

      fireEvent.keyDown(document.body, { which: Key.Tab, shiftKey: true });
      expect(widget).toHaveFocus();

      // toolbar
      fireEvent.keyDown(document.body, { which: Key.Enter });
      const firstToolbarItem = screen.getAllByLabelText(/color fill/i)[1];
      expect(firstToolbarItem).toHaveFocus();
    });

    it('should duplicate the widgets', () => {
      setup();

      mockAddBasicShapeWidget();
      mockAddBasicShapeWidget();

      expect(screen.queryAllByTestId(/widgetbase-/)).toHaveLength(2);

      // select all widgets
      fireEvent.keyDown(document.body, { which: Key.A, metaKey: true });
      // duplicate selection
      fireEvent.keyDown(document.body, { which: Key.D, metaKey: true });

      expect(screen.queryAllByTestId(/widgetbase-/)).toHaveLength(4);
    });

    it('should handle keyboard shortcuts for group widgets', () => {
      setup();

      // create and select a group widget
      mockAddBasicShapeWidget();
      mockAddBasicShapeWidget();

      const canvas = screen.queryByTestId(/page-focus-element/);
      fireEvent.keyDown(document.body, { which: Key.A, metaKey: true });
      // group widget shortcut
      fireEvent.keyDown(document.body, { which: Key.G, metaKey: true, altKey: true });

      const [widget, widgetTwo] = screen.queryAllByTestId(/widgetbase-/);

      // should focus and enter the group widget
      canvas.focus();
      fireEvent.keyDown(document.body, { which: Key.Enter });

      // should tab between group members
      expect(widgetTwo).toHaveFocus();
      fireEvent.keyDown(document.body, { which: Key.Tab });
      expect(widget).toHaveFocus();
      fireEvent.keyDown(document.body, { which: Key.Tab, shiftKey: true });
      expect(widgetTwo).toHaveFocus();

      // should exit the group members and focus the group widget itself
      fireEvent.keyDown(document.body, { which: Key.Escape });
      expect(screen.queryAllByTestId(/groupwidget-/)[0]).toHaveFocus();

      // should focus the canvas
      fireEvent.keyDown(document.body, { which: Key.Escape });
      expect(canvas).toHaveFocus();
    });
  });

  describe('Page Slide View', () => {
    it('should switch page from the page slide', async () => {
      setup();

      // open page slide view
      await fireEvent.keyDown(document.body, { which: Key.ForwardSlash, ctrlKey: true });

      const newPageBtn = await screen.findByText(/New page/);
      expect(newPageBtn).toBeInTheDocument();
      fireEvent.click(newPageBtn);

      const firstSlide = screen.getByTestId(/slide-idx-1/);
      const firstSlideBlock = screen.getByRole('button', { name: '1' });
      expect(firstSlide).toBeInTheDocument();
      expect(firstSlideBlock).toEqual(firstSlide.parentElement);

      firstSlideBlock.focus();
      expect(firstSlideBlock).toHaveFocus();

      userEvent.tab();
      const secondSlideBlock = screen.getByRole('button', { name: '2' });
      expect(secondSlideBlock).toHaveFocus();
      fireEvent.keyDown(document.body, { which: Key.Enter });

      expect(screen.getByTestId(secondSlideBlock.id)).toBeInTheDocument();
      expect(screen.queryByTestId(/page-1/)).not.toBeInTheDocument();

      // close page slide view
      fireEvent.keyDown(document.body, { which: Key.ForwardSlash, ctrlKey: true });
    });

    it('should duplicate page when slide view is open', async () => {
      setup();

      mockAddBasicShapeWidget();

      const [widgetInFirstPage] = screen.queryAllByTestId(/widgetbase-/);
      // open page slide view
      fireEvent.keyDown(document.body, { which: Key.ForwardSlash, ctrlKey: true });
      // duplicate the page with slide view open
      fireEvent.keyDown(document.body, { which: Key.D, metaKey: true });

      const pageSlides = await screen.findAllByTestId(/slide-idx-/);
      expect(pageSlides.length).toBe(2);

      // close page slide view
      fireEvent.keyDown(document.body, { which: Key.ForwardSlash, ctrlKey: true });

      const [widgetInSecondPage] = screen.queryAllByTestId(/widgetbase-/);
      // duplicated page should have copied widgets as well
      expect(widgetInFirstPage.id !== widgetInSecondPage.id).toBe(true);
    });

    // should add a new page when canvas is focused or slide view is open
    it('should add a new page when slide view is open', async () => {
      setup();

      // open page slide view
      fireEvent.keyDown(document.body, { which: Key.ForwardSlash, ctrlKey: true });
      // add a new page with slide view open
      fireEvent.keyDown(document.body, { which: Key.Enter, metaKey: true });
      fireEvent.keyDown(document.body, { which: Key.Enter, metaKey: true });

      const pageSlides = await screen.findAllByTestId(/slide-idx-/);
      expect(pageSlides.length).toBe(3);

      // close page slide view
      fireEvent.keyDown(document.body, { which: Key.ForwardSlash, ctrlKey: true });
    });

    it('should move the page with alt + arrow keys whether slide view is open or not', async () => {
      setup();

      // open page slide view
      fireEvent.keyDown(document.body, { which: Key.ForwardSlash, ctrlKey: true });
      // add new pages
      fireEvent.keyDown(document.body, { which: Key.Enter, metaKey: true });
      fireEvent.keyDown(document.body, { which: Key.Enter, metaKey: true });

      const activePageSlideNumber = screen.getByTestId('slide-idx-3-active');
      expect(activePageSlideNumber).toBeInTheDocument();

      // move to the previous page
      fireEvent.keyDown(document.body, { which: Key.UpArrow, altKey: true });
      expect(screen.getByTestId('slide-idx-2-active')).toBeInTheDocument();

      // close page slide view
      fireEvent.keyDown(document.body, { which: Key.ForwardSlash, ctrlKey: true });

      // move to the next page
      fireEvent.keyDown(document.body, { which: Key.DownArrow, altKey: true });
      expect(screen.getByTestId('active-page-idx-3')).toBeInTheDocument();
    });
  });
});
