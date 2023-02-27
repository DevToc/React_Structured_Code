import { screen, fireEvent } from '@testing-library/react';
import { mockAddBasicShapeWidget, renderWithRedux } from '../../../../../../../utils/test-utils.test';
import { EMPTY_INFOGRAPH } from '../../../../../../../utils/loadSampleInfograph';
import Editor from '../../../../../Editor';
import { InfographLoader } from '../../../../../../InfographLoader';

// Warning this test still runs on react 17
// See: https://github.com/testing-library/react-testing-library/issues/1051
describe('AccessibilityChecker/AlternativeTextChecker', () => {
  global.window.scrollTo = jest.fn();

  // TODO: remove this once it has been updated to React 18
  // hide legacy error
  jest.spyOn(global.console, 'error').mockImplementationOnce((message) => {
    if (!message.includes('ReactDOM.render')) {
      global.console.warn(message);
    }
  });

  it('Should see non text tags when opening `Alternative Text` panel and alt text modal when clicking on tags', async () => {
    renderWithRedux(
      <InfographLoader infographState={EMPTY_INFOGRAPH}>
        <Editor />
      </InfographLoader>,
      // React 17
      { legacyRoot: true },
    );

    // Add a non essential widget to test non text tags
    mockAddBasicShapeWidget();

    // Open Accessibility Checker
    const checkAccessibilityButton = screen.getByTestId(/checkAccessibility/);
    fireEvent.click(checkAccessibilityButton);

    // Check `Check Accessibility` panel
    const checkAccessibilityTab = await screen.findByRole('tabpanel', { name: /Accessibility/ });
    expect(checkAccessibilityTab).toBeInTheDocument();

    // // Check `Check my design` button from Check Accessibility panel
    const checkMyDesignButton = await screen.findByText(/Check my design/, { selector: 'button' });
    expect(checkMyDesignButton).toBeInTheDocument();

    // Run Accessibility checker
    fireEvent.click(checkMyDesignButton);

    // Check `Alternative Text` checker panel
    const alternativeTextMenu = await screen.findByTestId(/alternativeText-header/);
    expect(alternativeTextMenu).toBeInTheDocument();

    // Open `Alternative Text` checker panel
    fireEvent.click(alternativeTextMenu);

    // `ALT` and `DECORATIVE` tags should be displayed
    const tagIcon = await screen.findByTestId(/nonTextTag/);
    expect(tagIcon).toBeInTheDocument();

    // Add one more non essential widget
    mockAddBasicShapeWidget();

    // The number of tags should be doubled
    expect(screen.getAllByTestId(/nonTextTag/).length).toBe(2);

    // Trigger Alt Text modal
    fireEvent.click(tagIcon);

    // Check Alt Text modal with its decorative checkbox
    const modalDecorativeCheckBox = screen.getByRole('checkbox', { name: /Mark as Decorative/ });
    expect(modalDecorativeCheckBox).toBeInTheDocument();
  });
});
