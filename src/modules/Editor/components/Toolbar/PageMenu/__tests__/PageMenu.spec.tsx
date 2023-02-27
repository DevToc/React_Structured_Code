import { screen, fireEvent } from '@testing-library/react';
import { renderWithRedux } from 'utils/test-utils.test';
import { EMPTY_INFOGRAPH } from 'utils/loadSampleInfograph';
import { InfographLoader } from 'modules/InfographLoader';
import Editor from 'modules/Editor';
import { PageSizeUnit, PaperType } from 'types/paper.types';
import { PageSizePreset } from 'constants/paper';

describe('PageMenu/EditPageSize', () => {
  beforeEach(() => {
    jest.setTimeout(10000);
  });

  const assertPageSize = ({ width, height }: { width: number; height: number }) => {
    const pageStyle = window.getComputedStyle(screen.getByTestId(EMPTY_INFOGRAPH.pageOrder[0]));
    expect(parseInt(pageStyle?.width)).toEqual(width);
    expect(parseInt(pageStyle?.height)).toEqual(height);
  };

  it('should select letter from dropdown and change page canvas correctly', async () => {
    renderWithRedux(
      <InfographLoader infographState={EMPTY_INFOGRAPH}>
        <Editor />
      </InfographLoader>,
    );

    // Open menu
    fireEvent.click(screen.getByText(/Edit Page Size/, { selector: 'button' }));

    fireEvent.change(screen.getByTestId(/page-menu-resize-paper-select/), {
      target: { value: PaperType.LEGAL },
    });

    assertPageSize({ width: PageSizePreset.legal.widthPx, height: PageSizePreset.legal.heightPx });
  });

  it('should change orientation correctly', async () => {
    renderWithRedux(
      <InfographLoader infographState={EMPTY_INFOGRAPH}>
        <Editor />
      </InfographLoader>,
    );

    // Open menu
    fireEvent.click(screen.getByText(/Edit Page Size/, { selector: 'button' }));
    const landscapeButton = screen.getByLabelText(/landscape size button/, { selector: 'button' });

    fireEvent.click(landscapeButton);

    assertPageSize({ width: PageSizePreset.letter.heightPx, height: PageSizePreset.letter.widthPx });
  });

  it('should be able to change page size via input', async () => {
    renderWithRedux(
      <InfographLoader infographState={EMPTY_INFOGRAPH}>
        <Editor />
      </InfographLoader>,
    );

    // Open menu
    fireEvent.click(screen.getByText(/Edit Page Size/, { selector: 'button' }));

    const widthInput = screen.getByTestId(/page-menu-resize-width-input/);
    const heightInput = screen.getByTestId(/page-menu-resize-height-input/);

    const changeWidth = 800;
    fireEvent.change(widthInput, { target: { value: changeWidth } });
    fireEvent.blur(widthInput);

    const changeHeight = 1000;
    fireEvent.change(heightInput, { target: { value: changeHeight } });
    fireEvent.blur(heightInput);

    assertPageSize({ width: changeWidth, height: changeHeight });
  });

  it('should be able to change page size unit', async () => {
    renderWithRedux(
      <InfographLoader infographState={EMPTY_INFOGRAPH}>
        <Editor />
      </InfographLoader>,
    );

    // Open menu
    fireEvent.click(screen.getByText(/Edit Page Size/, { selector: 'button' }));

    const widthInput = screen.getByTestId(/page-menu-resize-width-input/);
    const heightInput = screen.getByTestId(/page-menu-resize-height-input/);
    const unitSelect = screen.getByTestId(/page-menu-resize-unit-select/);

    fireEvent.change(unitSelect, {
      target: { value: PageSizeUnit.in },
    });

    expect(unitSelect).toHaveValue(PageSizeUnit.in);
    expect(widthInput).toHaveValue(PageSizePreset.letter.widthIn.toString());
    expect(heightInput).toHaveValue(PageSizePreset.letter.heightIn.toString());

    fireEvent.change(unitSelect, {
      target: { value: PageSizeUnit.cm },
    });

    expect(unitSelect).toHaveValue(PageSizeUnit.cm);
    expect(widthInput).toHaveValue(PageSizePreset.letter.widthCm.toString());
    expect(heightInput).toHaveValue(PageSizePreset.letter.heightCm.toString());
  });
});
