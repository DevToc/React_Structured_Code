import { screen } from '@testing-library/react';
import { renderWithAppProviders } from '../../../../../utils/test-utils.test';
import { BetaBadge } from '../Betabadge';

describe('components/BetaBadge', () => {
  it('should render the BetaBadge button', () => {
    renderWithAppProviders(<BetaBadge />);

    expect(screen.getByTestId('betabadge')).toBeInTheDocument();
    expect(screen.getByText('Beta')).toBeInTheDocument();
    expect(screen.getByText('Beta')).toHaveStyle('text-transform: uppercase');
  });
});
