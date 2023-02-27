import { screen } from '@testing-library/react';
import { Accordion } from '@chakra-ui/react';
import cloneDeep from 'lodash.clonedeep';
import { renderWithRedux } from 'utils/test-utils.test';
import { StatusBanner } from 'modules/Editor/components/AccessibilityManager/AccessibilityChecker/ResultContainer/StatusBanner';
import { initAccessibilitySettingsState } from 'modules/Editor/components/AccessibilityManager/AccessibilityManager.config';
import { MockAccessibilitySettingsProvider } from 'modules/Editor/components/AccessibilityManager/AccessibilityChecker/ResultContainer/__tests__/helpers';

describe('AccessibilityManager/AccessibilityChecker/ResultContainer/StatusBanner', () => {
  const scanDocument = jest.fn();

  it('should render StatusBanner properly', () => {
    const state = cloneDeep(initAccessibilitySettingsState);

    renderWithRedux(
      <Accordion>
        <MockAccessibilitySettingsProvider initState={state}>
          <StatusBanner scanDocument={scanDocument} />
        </MockAccessibilitySettingsProvider>
      </Accordion>,
    );

    expect(screen.getByText(/issues detected/)).toBeInTheDocument();
  });

  it('should render issues resolved if all checkers mark as resolved', () => {
    const state = cloneDeep(initAccessibilitySettingsState);
    Object.values(state.checkers).forEach((checker) => {
      checker.isMarkAsResolved = true;
    });

    renderWithRedux(
      <Accordion>
        <MockAccessibilitySettingsProvider initState={state}>
          <StatusBanner scanDocument={scanDocument} />
        </MockAccessibilitySettingsProvider>
      </Accordion>,
    );

    expect(screen.getByText(/issues resolved/)).toBeInTheDocument();
  });
});
