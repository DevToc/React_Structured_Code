import { fireEvent, screen, waitFor } from '@testing-library/react';
import { AccessibilityMenu } from 'modules/Editor/components/AccessibilityManager/AccessibilityManager';
import { renderWithRedux } from '../../../../../utils/test-utils.test';
import { Navbar } from '../Navbar';

describe('components/Navbar/AccessibilityButton', () => {
  it('should open accessibility menu on click', async () => {
    renderWithRedux(
      <>
        <Navbar />
        <AccessibilityMenu />
      </>,
    );

    fireEvent.click(screen.getByTestId('navbar-accessibility-button'));

    const checkAccessibilityTab = await waitFor(() => screen.findByRole('tabpanel', { name: /Accessibility/ }));
    expect(checkAccessibilityTab).toBeInTheDocument();
  });
});
