import { screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithRedux } from 'utils/test-utils.test';
import { InContextToolbar } from '../InContextToolbar';

describe('components/InContextToolbar', () => {
  it('should set active menu', () => {
    renderWithRedux(<InContextToolbar />);

    const iconButton = screen.getByRole('button', { name: /Icons/ });
    const shapeButton = screen.getByRole('button', { name: /Shapes/ });

    fireEvent.click(iconButton);
    expect(screen.getByTestId(/Icons-active/)).toBeInTheDocument();

    fireEvent.click(shapeButton);
    expect(screen.getByTestId(/Shapes-active/)).toBeInTheDocument();
  });

  it('should support accessible keyboard navigation', () => {
    renderWithRedux(<InContextToolbar />);

    const iconButton = screen.getByRole('button', { name: /Icons/ });
    const uploadButton = screen.getByRole('button', { name: /Uploads/ });

    iconButton.focus();
    expect(iconButton).toHaveFocus();
    userEvent.tab();
    expect(uploadButton).toHaveFocus();
    userEvent.tab();

    userEvent.keyboard('{Enter}');

    const closeInContextToolbarButton = screen.getByLabelText(/Close widget menu/i);
    expect(closeInContextToolbarButton).toHaveFocus();
  });
});
