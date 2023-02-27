import { screen } from '@testing-library/react';
import { renderWithRedux } from '../../../../../utils/test-utils.test';
import { Navbar } from '../Navbar';

describe('components/Navbar', () => {
  it('should render the Navbar', () => {
    renderWithRedux(<Navbar />);

    expect(screen.getByTestId('navbar')).toBeInTheDocument();
    expect(screen.getByTestId('navbar-accessibility-button')).toBeInTheDocument();
    expect(screen.getByTestId('infographtitle-input')).toBeInTheDocument();
    expect(screen.getByTestId('betabadge')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Upgrade' })).toBeInTheDocument();
    expect(screen.getByTestId('helplink-button')).toBeInTheDocument();
    expect(screen.getByTestId('useravatar-button')).toBeInTheDocument();
  });
});
