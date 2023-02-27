// used for checking existence of bounding box of widgets on the canvas
/* eslint-disable testing-library/no-node-access, testing-library/no-container */
import { screen, fireEvent, waitFor, act } from '@testing-library/react';
import Editor from 'modules/Editor/Editor';
import { EDITOR_ACTIVE_PAGE_FOCUS_ID } from 'modules/Editor/Editor.config';
import { ColorVisionMode } from 'modules/Editor/store/editorSettingsSlice.types';
import { InfographLoader } from 'modules/InfographLoader';
import { EMPTY_INFOGRAPH } from 'utils/loadSampleInfograph';
import {
  mockAddTextWidget,
  renderWithRedux,
  mockOpenAccessibilityManager,
  mockCloseAccessibilityManager,
} from 'utils/test-utils.test';
import { PAGE_ITEM_TESTID_PREFIX, WIDGET_ITEM_TESTID_PREFIX } from '../AccessibilityManager.config';
import { AccessibilityMenu } from '../AccessibilityManager';
import { CheckerSettingsProvider } from '../AccessibilityChecker/checker.provider';

describe('AccessibilityManager/AccessibilityManager', () => {
  global.window.scrollTo = jest.fn();

  //  Render the a11y menu without the editor
  const setup = () => {
    const { container } = renderWithRedux(
      <InfographLoader infographState={EMPTY_INFOGRAPH}>
        <Editor />
      </InfographLoader>,
    );

    const fileMenu = screen.getByRole('button', { name: /File/ });

    return {
      container,
      fileMenu,
    };
  };

  //  Render the a11y menu without the editor
  const renderAccessibilityMenuOnly = () => {
    renderWithRedux(
      <InfographLoader infographState={EMPTY_INFOGRAPH}>
        <CheckerSettingsProvider>
          <AccessibilityMenu />
        </CheckerSettingsProvider>
      </InfographLoader>,
    );
  };

  it('should open Accessibility Menu', async () => {
    const { fileMenu } = setup();

    fireEvent.click(fileMenu);
    const accessibilityMenuBtn = await screen.findByRole('menuitem', { name: /Accessibility/ });
    fireEvent.click(accessibilityMenuBtn);
    const checkAccessibilityBtn = await screen.findByRole('menuitem', { name: /Check accessibility/ });

    // It seems redundant but `await` needs here due to weird act error with React 18 from the library.
    // if updating this test, please check if the issue is gone.
    // Ref: https://github.com/testing-library/react-testing-library/issues/1051
    await fireEvent.click(checkAccessibilityBtn);
    const accessMenu = await screen.findByTestId(/accessibility-menu/);
    expect(accessMenu).toBeInTheDocument();

    // Close accessibility menu
    const closeA11yMenuBtn = await screen.findByRole('button', { name: /Close accessibility menu/ });
    fireEvent.click(closeA11yMenuBtn);
    expect(accessMenu).not.toBeInTheDocument();

    // Open accessibility menu with another button at the top nav bar
    const accessibilityBtn = screen.getByRole('button', { name: /Open Accessibility Menu/ });
    fireEvent.click(accessibilityBtn);
    const reopenedA11yMenu = await screen.findByTestId(/accessibility-menu/);
    expect(reopenedA11yMenu).toBeInTheDocument();
  });

  it('should open Edit Reading Order tab', async () => {
    const { fileMenu } = setup();

    fireEvent.click(fileMenu);
    const readingOrderMenu = await screen.findByText(/Edit reading order/, { selector: 'button' });

    fireEvent.click(readingOrderMenu);
    const readingOrderTab = await screen.findByRole('tab', { name: /Reading Order Tab/, selected: true });
    expect(readingOrderTab).toBeInTheDocument();
  });

  it('should select widget with click', async () => {
    const { container } = setup();

    const readingOrderTab = screen.getByRole('tab', { name: /Reading Order Tab/ });
    fireEvent.click(readingOrderTab);

    const firstPageId = EMPTY_INFOGRAPH.pageOrder[0];
    const pageItem = await screen.findByTestId(`${PAGE_ITEM_TESTID_PREFIX}-${firstPageId}`);
    // Default to be open for Collapsed menu on the active page
    const pageContent = pageItem?.nextSibling;
    expect(pageContent).toHaveStyle('opacity: 1');

    // should collapse list of widget item in page
    fireEvent.click(pageItem);
    // Due to the transition, it doesn't guarantee
    // to pass all the time without extra timeout setting
    await waitFor(
      () => {
        expect(pageContent).toHaveStyle('opacity: 0');
      },
      { timeout: 2000 },
    );

    // Open again
    fireEvent.click(pageItem);
    await waitFor(
      () => {
        expect(pageContent).toHaveStyle('opacity: 1');
      },
      { timeout: 2000 },
    );

    mockAddTextWidget();
    // Select an widget id
    const widget = screen.queryAllByTestId(/widgetbase-/)[0];
    const menuItem = screen.getByTestId(`${WIDGET_ITEM_TESTID_PREFIX}-${widget.id}`);

    expect(menuItem).toHaveTextContent('Text:');

    // Click to select and menu item active
    fireEvent.click(menuItem);
    expect(menuItem).toHaveStyle('background: var(--vg-colors-a11yMenu-active)');
    // Expect widget to have moveable ui
    expect(container.querySelector('.moveable-control-box')?.firstChild).not.toBeNull();
  });

  it('can drag item to reorder structure tree', async () => {
    // TODO: simulate drag and drop here?
    // Probably it is better to do it in e2e test with proper browser
  });

  describe('SimulatorTab', () => {
    it('should render page with simulator and be able to toggle on and off', async () => {
      const { fileMenu, container } = setup();
      fireEvent.click(fileMenu);

      const simulatorMenuItem = await screen.findByText(/Visual Simulator/, { selector: 'button' });
      fireEvent.click(simulatorMenuItem);

      await act(async () => {
        const simulatorTab = await screen.findByRole('tab', { name: /Visual Simulator/, selected: true });
        expect(simulatorTab).toBeInTheDocument();
      });

      /**
       * Iterate through all simulators and ensure that render probably
       */
      Object.values(ColorVisionMode)
        .filter((v) => v !== ColorVisionMode.none)
        .forEach((vision) => {
          const simulatorButton = screen.getByLabelText(new RegExp(`${vision} simulator`));
          expect(simulatorButton).toBeInTheDocument();
          fireEvent.click(simulatorButton);

          const filterId = `#__${vision}`;
          const svgFilter = container.querySelector(filterId);
          expect(svgFilter).toBeInTheDocument();

          const filterStyle = { filter: `url('${filterId}')` };
          const activePageElement = container.querySelector(`#${EDITOR_ACTIVE_PAGE_FOCUS_ID}`);
          expect(activePageElement?.firstElementChild).toHaveStyle(filterStyle);

          // Test toggle off
          fireEvent.click(simulatorButton);
          expect(activePageElement?.firstElementChild).not.toHaveStyle(filterStyle);
        });
    });
  });

  describe('Checkers', () => {
    it('Should check headings', async () => {
      renderAccessibilityMenuOnly();
      await mockOpenAccessibilityManager();

      await screen.findByTestId(/accessibility-menu/);
      const checkMyDesignButton = await screen.findByText(/Check my design/);
      fireEvent.click(checkMyDesignButton);

      // heading check should work
      const headingsCheck = screen.getByTestId('heading-checker');
      fireEvent.click(headingsCheck);

      const toggleCheckButton = screen.getByTestId('toggle-heading-check');
      fireEvent.click(toggleCheckButton);

      // expect data-checked attribute
      expect(toggleCheckButton).toHaveAttribute('data-checked');

      // heading check should still be checked after closing and reopening the menu
      await mockCloseAccessibilityManager();
      await mockOpenAccessibilityManager();
      expect(screen.getByTestId('toggle-heading-check')).toHaveAttribute('data-checked');
    });
  });
});
