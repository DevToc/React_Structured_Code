import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { renderWithRedux } from '../../../../../utils/test-utils.test';
import Editor from '../../../Editor';
import { InfographLoader } from '../../../../InfographLoader';
import { EMPTY_INFOGRAPH } from '../../../../../utils/loadSampleInfograph';

describe('components/Navbar/ZoomSelect', () => {
  it('should zoom page', () => {
    renderWithRedux(
      <InfographLoader infographState={EMPTY_INFOGRAPH}>
        <Editor />
      </InfographLoader>,
    );

    const zoomSelect = screen.getByLabelText('Select Canvas Zoom');
    const zoomNormal = '1';
    const zoomSmall = '0.25';
    const baseWidth = 816;
    const baseHeight = 1056;

    userEvent.selectOptions(zoomSelect, zoomNormal);
    expect(screen.getByTestId(/page-1/)).toHaveStyle(`width: ${baseWidth}px`);
    expect(screen.getByTestId(/page-1/)).toHaveStyle(`height: ${baseHeight}px`);

    userEvent.selectOptions(zoomSelect, zoomSmall);
    expect(screen.getByTestId(/page-1/)).toHaveStyle(`width: ${baseWidth * +zoomSmall}px`);
    expect(screen.getByTestId(/page-1/)).toHaveStyle(`height: ${baseHeight * +zoomSmall}px`);
  });
});
