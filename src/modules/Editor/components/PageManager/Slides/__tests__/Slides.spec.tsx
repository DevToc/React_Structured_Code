import { screen, fireEvent } from '@testing-library/react';
import { renderWithRedux } from 'utils/test-utils.test';
import Editor from 'modules/Editor/Editor';
import { InfographLoader } from 'modules/InfographLoader';
import { EMPTY_INFOGRAPH } from 'utils/loadSampleInfograph';
import userEvent from '@testing-library/user-event';

describe('components/PageManager/Slides', () => {
  const setup = () => {
    renderWithRedux(
      <InfographLoader infographState={EMPTY_INFOGRAPH}>
        <Editor />
      </InfographLoader>,
    );
  };

  it('should add slide', async () => {
    setup();

    const showPageSlideBtn = screen.getByLabelText(/Show All Pages/);
    await fireEvent.click(showPageSlideBtn);

    const newPageBtn = await screen.findByText(/New page/);
    expect(newPageBtn).toBeInTheDocument();
    fireEvent.click(newPageBtn);
    expect(screen.getByTestId(/slide-idx-1/)).toBeInTheDocument();
    expect(screen.getByTestId(/slide-idx-2-active/)).toBeInTheDocument();
    fireEvent.click(newPageBtn);
    expect(screen.getByTestId(/slide-idx-3-active/)).toBeInTheDocument();
  });

  it('should tab through in the correct order', async () => {
    setup();

    // Add page
    fireEvent.click(screen.getByText(/New page/));
    fireEvent.click(screen.getByText(/New page/));
    const firstPage = await screen.findByRole('button', { name: '1' });
    const secondPage = await screen.findByRole('button', { name: /2/ });
    const thirdPage = await screen.findByRole('button', { name: /3/ });

    // Check tab order between pages
    firstPage.focus();
    expect(firstPage).toHaveFocus();
    userEvent.tab();
    expect(secondPage).toHaveFocus();
    userEvent.tab();
    expect(thirdPage).toHaveFocus();

    // Check tab order backward
    userEvent.tab({ shift: true });
    expect(secondPage).toHaveFocus();
    userEvent.tab({ shift: true });
    expect(firstPage).toHaveFocus();
  });
});
