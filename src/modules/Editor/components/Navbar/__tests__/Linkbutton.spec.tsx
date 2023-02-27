import { screen, fireEvent } from '@testing-library/react';
import { renderWithAppProviders } from '../../../../../utils/test-utils.test';
import { LinkButton } from '../LinkButton';

describe('components/Linkbutton', () => {
  it('should render the Linkbutton button', () => {
    renderWithAppProviders(
      <LinkButton href={'http://testurl.com'} target='_blank'>
        {'Link Text'}
      </LinkButton>,
    );

    expect(screen.getByTestId('link-button')).toBeInTheDocument();
  });

  it('should have the link in the Linkbutton menu', async () => {
    renderWithAppProviders(
      <LinkButton href={'http://testurl.com'} target='_blank'>
        {'Link Text'}
      </LinkButton>,
    );

    fireEvent.click(screen.getByTestId('link-button'));

    expect(screen.getByTestId('link-button').closest('a')).toHaveAttribute('href', 'http://testurl.com');
    expect(screen.getByTestId('link-button').closest('a')).toHaveAttribute('target', '_blank');
  });
});
