import { screen, fireEvent } from '@testing-library/react';
import { mockAddTextWidget, renderWithRedux } from 'utils/test-utils.test';
import PrivateLinkView from '../PrivateLinkView';
import { InfographLoader } from 'modules/InfographLoader';
import { EMPTY_INFOGRAPH } from 'utils/loadSampleInfograph';
import userEvent from '@testing-library/user-event';

describe('modules/PrivateLinkView', () => {
  const setup = () => {
    renderWithRedux(
      <InfographLoader infographState={EMPTY_INFOGRAPH}>
        <PrivateLinkView />
      </InfographLoader>,
    );
  };

  it('should render venngage logo link, fullscreen btn, designOwner info, report link and DMCA Policy on pl page', () => {
    setup();

    expect(screen.getByTestId(/pl-logo-home-link/)).toBeInTheDocument();
    expect(screen.getByTestId(/pl-fullscreen-btn/)).toBeInTheDocument();
    expect(screen.getByTestId(/pl-designOwner-info/)).toBeInTheDocument();
    expect(screen.getByTestId(/pl-report-link/)).toBeInTheDocument();
    expect(screen.getByText(/DMCA Policy/)).toBeInTheDocument();
  });

  it('should not render designOwner info, report link or DMCA policy when in full screen mode', async () => {
    setup();

    const fullScreenBtnElement = screen.getByTestId(/pl-fullscreen-btn/);
    await fireEvent.click(fullScreenBtnElement);
    expect(screen.queryByTestId(/pl-designOwner-info/)).not.toBeInTheDocument();
    expect(screen.queryByTestId(/pl-report-link/)).not.toBeInTheDocument();
    expect(screen.queryByTestId(/DMCA Policy/)).not.toBeInTheDocument();
  });

  it('should have links tabbable and clickable', () => {
    setup();

    // Add text with links
    mockAddTextWidget(true);
    const linkText = screen.getByRole('link', { name: /hello/ });
    userEvent.tab();
    expect(linkText).toHaveFocus();
    expect(linkText).toHaveStyle('pointer-events: auto');
  });
});
