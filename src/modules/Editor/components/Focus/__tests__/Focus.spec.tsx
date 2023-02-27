import { screen } from '@testing-library/react';

import { renderWithRedux, mockAddBasicShapeWidget, mockSetActiveWidget } from '../../../../../utils/test-utils.test';
import Editor from '../../../Editor';
import { InfographLoader } from '../../../../InfographLoader';
import { EMPTY_INFOGRAPH } from '../../../../../utils/loadSampleInfograph';

describe('components/Focus', () => {
  it('should set focus to widget after widget has been selected', () => {
    renderWithRedux(
      <InfographLoader infographState={EMPTY_INFOGRAPH}>
        <Editor />
      </InfographLoader>,
    );

    expect(document.body).toHaveFocus();

    mockAddBasicShapeWidget();
    const widget = screen.queryAllByTestId(/widgetbase-/)[0];
    mockSetActiveWidget(widget.id);

    expect(widget).toHaveFocus();
  });
});
