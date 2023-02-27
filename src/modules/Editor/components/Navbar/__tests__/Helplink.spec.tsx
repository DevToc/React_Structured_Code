import { screen, fireEvent, waitFor } from '@testing-library/react';
import { renderWithAppProviders } from '../../../../../utils/test-utils.test';
import { HelpLink } from '../Helplink';

describe('components/HelpLink', () => {
  it('should render the HelpLink button', () => {
    renderWithAppProviders(<HelpLink />);

    expect(screen.getByTestId('helplink-button')).toBeInTheDocument();
  });

  it('should render the HelpLink menu', async () => {
    renderWithAppProviders(<HelpLink />);

    expect(screen.getByTestId('helplink-menu')).not.toBeVisible();
    expect(screen.getByText('Help Center')).not.toBeVisible();
    expect(screen.getByText('Onboarding Guide')).not.toBeVisible();
    expect(screen.getByText('Editor Functions')).not.toBeVisible();
    expect(screen.getByText('Design Blog')).not.toBeVisible();
    expect(screen.getByText('Email Us')).not.toBeVisible();

    fireEvent.click(screen.getByTestId('helplink-button'));

    await waitFor(() => {
      expect(screen.getByTestId('helplink-menu')).toBeVisible();
      expect(screen.getByText('Help Center')).toBeVisible();
      expect(screen.getByText('Onboarding Guide')).toBeVisible();
      expect(screen.getByText('Editor Functions')).toBeVisible();
      expect(screen.getByText('Design Blog')).toBeVisible();
      expect(screen.getByText('Email Us')).toBeVisible();
    }, {});
  });

  it('should have the link in the HelpLink menu', async () => {
    renderWithAppProviders(<HelpLink />);

    fireEvent.click(screen.getByTestId('helplink-button'));

    expect(screen.getByText('Help Center').closest('a')).toHaveAttribute('href', 'https://help.venngage.com/en');
    expect(screen.getByText('Onboarding Guide').closest('a')).toHaveAttribute(
      'href',
      'https://infograph.venngage.com/help/onboarding',
    );
    expect(screen.getByText('Editor Functions').closest('a')).toHaveAttribute(
      'href',
      'https://infograph.venngage.com/help/editor',
    );
    expect(screen.getByText('Design Blog').closest('a')).toHaveAttribute('href', 'https://infograph.venngage.com/blog');
    expect(screen.getByText('Email Us').closest('a')).toHaveAttribute('href', 'mailto:support@venngage.com');
  });
});
