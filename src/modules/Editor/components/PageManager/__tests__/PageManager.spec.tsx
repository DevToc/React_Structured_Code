import { screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithRedux, mockAddBasicShapeWidget, mockAddNewPage } from 'utils/test-utils.test';
import Editor from 'modules/Editor';
import { InfographLoader } from 'modules/InfographLoader';
import { EMPTY_INFOGRAPH } from 'utils/loadSampleInfograph';
import { MAXIMUM_PAGE_LIMIT } from 'modules/Editor/Editor.config';

describe('components/PageManager', () => {
  const setup = () => {
    renderWithRedux(
      <InfographLoader infographState={EMPTY_INFOGRAPH}>
        <Editor />
      </InfographLoader>,
    );

    const pageNumberInput: HTMLInputElement = screen.getByLabelText(/Find Page/);
    const prevBtn = screen.getByLabelText(/Previous Page/);
    const nextBtn = screen.getByLabelText(/Next Page/);
    const addPageBtn = screen.getByLabelText(/Add Page/);
    const duplicatePageBtn = screen.getByLabelText(/Duplicate Page/);
    const deletePageBtn = screen.getByLabelText(/Delete Page/);
    const showSlideBtn = screen.getByLabelText(/Show All Pages/);

    return {
      pageNumberInput,
      prevBtn,
      nextBtn,
      addPageBtn,
      duplicatePageBtn,
      deletePageBtn,
      showSlideBtn,
    };
  };

  it('should add and delete page', () => {
    const { deletePageBtn } = setup();

    expect(screen.getByTestId(/active-page-idx-1/)).toBeInTheDocument();
    fireEvent.click(screen.getByLabelText(/Add Page/));
    expect(screen.getByTestId(/active-page-idx-2/)).toBeInTheDocument();
    fireEvent.click(deletePageBtn);
    expect(deletePageBtn).toBeDisabled();
  });

  it('should duplicate page', () => {
    const { duplicatePageBtn } = setup();

    mockAddBasicShapeWidget();
    mockAddBasicShapeWidget();

    const allWidgets = screen.getAllByTestId(/widgetbase/);

    expect(screen.getByTestId(/active-page-idx-1/)).toBeInTheDocument();

    fireEvent.click(duplicatePageBtn);

    const allWidgetsAfter = screen.getAllByTestId(/widgetbase/);
    expect(screen.getByTestId(/active-page-idx-2/)).toBeInTheDocument();
    expect(allWidgetsAfter.length).toEqual(allWidgets.length);
  });

  it('should switch between pages', () => {
    const { addPageBtn, nextBtn, prevBtn } = setup();

    fireEvent.click(addPageBtn);

    expect(nextBtn).toBeDisabled();
    fireEvent.click(prevBtn);
    expect(prevBtn).toBeDisabled();
    fireEvent.click(nextBtn);
  });

  it('should be keyboard accessible', () => {
    const { pageNumberInput, addPageBtn, duplicatePageBtn, showSlideBtn } = setup();

    showSlideBtn.focus();
    expect(showSlideBtn).toHaveFocus();
    userEvent.tab();
    expect(pageNumberInput).toHaveFocus();
    userEvent.tab();
    expect(duplicatePageBtn).toHaveFocus();
    userEvent.tab();
    expect(addPageBtn).toHaveFocus();
  });

  it('should navigate to the correct page', () => {
    const { pageNumberInput, nextBtn, prevBtn } = setup();

    mockAddNewPage();
    fireEvent.click(nextBtn);
    expect(pageNumberInput.value).toBe('2');

    mockAddNewPage();
    fireEvent.click(nextBtn);
    expect(pageNumberInput.value).toBe('3');
    expect(nextBtn).toBeDisabled();

    fireEvent.click(prevBtn);
    expect(pageNumberInput.value).toBe('2');

    fireEvent.click(prevBtn);
    expect(pageNumberInput.value).toBe('1');
    expect(prevBtn).toBeDisabled();
  });

  it('should have `Delete Page` button disabled when only having 1 page', () => {
    const { deletePageBtn } = setup();

    expect(deletePageBtn).toBeDisabled();
  });

  it('should toggle slide view', async () => {
    const { showSlideBtn } = setup();

    await fireEvent.click(showSlideBtn);
    const hideSlideBtn = await screen.findByLabelText(/Hide All Pages/);
    expect(hideSlideBtn).toBeInTheDocument();

    await fireEvent.click(hideSlideBtn);
    const toggledSlideButton = await screen.findByLabelText(/Show All Pages/);
    expect(toggledSlideButton).toBeInTheDocument();
  });

  it('should have `+ New page` button disabled when number of pages reached maximum limit', async () => {
    const { showSlideBtn } = setup();

    await fireEvent.click(showSlideBtn);
    const hideSlideBtn = await screen.findByLabelText(/Hide All Pages/);
    expect(hideSlideBtn).toBeInTheDocument();

    for (let i = 0; i < MAXIMUM_PAGE_LIMIT - 1; i++) {
      mockAddNewPage();
    }

    const newPageBtn = screen.getByText(/New page/);
    expect(newPageBtn).toBeInTheDocument();
    expect(newPageBtn).toBeDisabled();

    await fireEvent.click(hideSlideBtn);
  });

  it('should have page menu control be always seen even when the slide view is open', async () => {
    const { showSlideBtn } = setup();

    await fireEvent.click(showSlideBtn);
    const hideSlideBtn = await screen.findByLabelText(/Hide All Pages/);
    expect(hideSlideBtn).toBeInTheDocument();
    // page menu is still visible
    expect(screen.getByTestId(/active-page-idx-1/)).toBeInTheDocument();
  });
});
