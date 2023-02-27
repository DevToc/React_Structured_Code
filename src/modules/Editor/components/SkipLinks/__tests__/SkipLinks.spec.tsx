import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { renderWithRedux } from '../../../../../utils/test-utils.test';
import Editor from '../../../Editor';
import { InfographLoader } from '../../../../InfographLoader';
import { EMPTY_INFOGRAPH } from '../../../../../utils/loadSampleInfograph';

describe('components/SkipLinks', () => {
  it('Editor skip links should be first in focus order', () => {
    renderWithRedux(
      <InfographLoader infographState={EMPTY_INFOGRAPH}>
        <Editor />
      </InfographLoader>,
    );
    const skipNavigationLink = screen.getByTestId('skip-navigation');
    const skipMainContentLink = screen.getByTestId('skip-main-content');

    userEvent.tab();
    expect(skipNavigationLink).toHaveFocus();
    userEvent.tab();
    expect(skipMainContentLink).toHaveFocus();
  });
});
