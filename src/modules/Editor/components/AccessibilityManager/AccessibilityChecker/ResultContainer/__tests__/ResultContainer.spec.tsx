import { Accordion } from '@chakra-ui/react';
import cloneDeep from 'lodash.clonedeep';
import { renderWithRedux } from 'utils/test-utils.test';
import { MockAccessibilitySettingsProvider } from './helpers';
import { ResultContainer } from 'modules/Editor/components/AccessibilityManager/AccessibilityChecker/ResultContainer/ResultContainer';
import { initAccessibilitySettingsState } from 'modules/Editor/components/AccessibilityManager/AccessibilityManager.config';

/**
 * Note: Some of functionalities tests have been disabled in __tests__/AccessibilityManager.spec.tsx
 * Need to refactor them later on.
 */
describe('AccessibilityManager/AccessibilityChecker/ResultContainer', () => {
  const scanDocument = jest.fn();
  global.window.scrollTo = jest.fn();

  it('should render correctly', () => {
    const state = cloneDeep(initAccessibilitySettingsState);

    const { asFragment } = renderWithRedux(
      <Accordion>
        <MockAccessibilitySettingsProvider initState={state}>
          <ResultContainer scanDocument={scanDocument} />
        </MockAccessibilitySettingsProvider>
      </Accordion>,
    );

    expect(asFragment()).toMatchSnapshot();
  });
});
