import { screen, fireEvent, waitFor } from '@testing-library/react';
import { renderWithAppProviders } from '../../../../../utils/test-utils.test';
import { UserAvatar } from '../UserAvatar';

describe('components/UserAvatar', () => {
  it('should render the UserAvatar button', () => {
    renderWithAppProviders(<UserAvatar />);

    expect(screen.getByTestId('useravatar-button')).toBeInTheDocument();
  });

  it('should have the link in the UserAvatar menu', async () => {
    renderWithAppProviders(<UserAvatar />);

    fireEvent.click(screen.getByTestId('useravatar-button'));

    await waitFor(() => {
      expect(screen.getByTestId('useravatar-menu')).toBeVisible();
      expect(screen.getByText('My Account')).toBeVisible();
      expect(screen.getByText('Sign Out')).toBeVisible();
      expect(screen.getByText('My Account')).toHaveAttribute('href', 'https://infograph.venngage.com/account/profile');
      expect(screen.getByText('Sign Out')).toHaveAttribute('href', 'https://infograph.venngage.com/logout');
    });
  });
});
