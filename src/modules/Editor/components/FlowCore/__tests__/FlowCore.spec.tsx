import { screen } from '@testing-library/react';
import Editor from 'modules/Editor';
import { InfographLoader } from 'modules/InfographLoader';
import { EMPTY_INFOGRAPH } from 'utils/loadSampleInfograph';
import { renderWithRedux } from 'utils/test-utils.test';
describe('FlowCore/PortContext', () => {
  const setup = () => {
    const { container } = renderWithRedux(
      <InfographLoader infographState={EMPTY_INFOGRAPH}>
        <Editor />
      </InfographLoader>,
    );

    const toggleBtuton = screen.queryByTestId(/flowmode-toggle-button/);

    return {
      container,
      toggleBtuton,
    };
  };

  it('should render the flow toggle button on the Editor [Temp]', async () => {
    const { toggleBtuton } = setup();

    expect(toggleBtuton).not.toBeNull();
    expect(toggleBtuton).toHaveAttribute('aria-label');

    // [JB] Investigating for a way to test a specific context used in the Editor
  });
});
