import { screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithRedux } from 'utils/test-utils.test';
import { WidgetMenu } from '../WidgetMenu';

describe('components/WidgetMenu', () => {
  it('should set active menu', () => {
    renderWithRedux(<WidgetMenu />);

    const iconButton = screen.getByRole('button', { name: /Icons/ });
    const shapeButton = screen.getByRole('button', { name: /Shapes/ });

    fireEvent.click(iconButton);
    expect(screen.getByTestId(/Icons-active/)).toBeInTheDocument();

    fireEvent.click(shapeButton);
    expect(screen.getByTestId(/Shapes-active/)).toBeInTheDocument();
  });

  it('should support accessible keyboard navigation', () => {
    renderWithRedux(<WidgetMenu />);

    const iconButton = screen.getByRole('button', { name: /Icons/ });
    const uploadButton = screen.getByRole('button', { name: /Uploads/ });

    iconButton.focus();
    expect(iconButton).toHaveFocus();
    userEvent.tab();
    expect(uploadButton).toHaveFocus();
    userEvent.tab();

    userEvent.keyboard('{Enter}');

    const closeWidgetMenuButton = screen.getByLabelText(/Close widget menu/i);
    expect(closeWidgetMenuButton).toHaveFocus();
  });
});
