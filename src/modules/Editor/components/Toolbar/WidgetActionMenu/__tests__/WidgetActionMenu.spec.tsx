import { renderWithRedux } from 'utils/test-utils.test';
import { InfographLoader } from 'modules/InfographLoader';
import { EMPTY_INFOGRAPH } from 'utils/loadSampleInfograph';
import { WidgetActionMenu } from '../WidgetActionMenu';

describe('components/Toolbar/WidgetActionMenu', () => {
  it('should render dropdown', () => {
    const { container } = renderWithRedux(
      <InfographLoader infographState={EMPTY_INFOGRAPH}>
        <WidgetActionMenu useDropdown={true} />
      </InfographLoader>,
    );

    expect(container).toMatchSnapshot();
  });

  it('should render all action buttons', () => {
    const { container } = renderWithRedux(
      <InfographLoader infographState={EMPTY_INFOGRAPH}>
        <WidgetActionMenu useDropdown={false} />
      </InfographLoader>,
    );

    expect(container).toMatchSnapshot();
  });
});
