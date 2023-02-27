import { fireEvent, screen, waitFor } from '@testing-library/react';
import { AccessibilityMenu } from 'modules/Editor/components/AccessibilityManager/AccessibilityManager';
import { Navbar } from 'modules/Editor/components/Navbar/Navbar';
import { renderWithRedux } from 'utils/test-utils.test';

describe('components/Navbar/FileMenu', () => {
  it('should open visual simulator tab on clicking visual simulator in file menu', async () => {
    renderWithRedux(
      <>
        <Navbar />
        <AccessibilityMenu />
      </>,
    );

    const fileMenu = screen.getByRole('button', { name: /File/ });
    fireEvent.click(fileMenu);

    const simulatorMenuItem = await screen.findByText(/Visual Simulator/, { selector: 'button' });
    fireEvent.click(simulatorMenuItem);

    const simulatorTab = await waitFor(() => screen.findByRole('tabpanel', { name: /Simulator/ }));
    expect(simulatorTab).toBeInTheDocument();
  });
});
