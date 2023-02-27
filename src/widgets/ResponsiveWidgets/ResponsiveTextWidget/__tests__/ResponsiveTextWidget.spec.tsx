import { screen } from '@testing-library/react';

import Editor from 'modules/Editor';
import { addNewWidget, store } from 'modules/Editor/store';
import { InfographLoader } from 'modules/InfographLoader';
import { act } from 'react-dom/test-utils';
import { EMPTY_INFOGRAPH } from 'utils/loadSampleInfograph';
import { renderWithRedux } from 'utils/test-utils.test';

import { STYLED_RESPONSIVE_TEXT_WIDGETS } from 'modules/Editor/components/WidgetMenu/SideMenu/ElementsMenu/ElementsMenu.config';
import { generateDefaultData } from '../ResponsiveTextWidget.helpers';

describe('widgets/ResponsiveTextWidget', () => {
  const disableWarnings = () => {
    // TODO figure out why this error is thrown for tests but not in browser
    // Suppress error 'Received NaN for data-rotation attribute'
    jest.spyOn(console, 'error').mockImplementation((message) => {
      if (message.includes('Received NaN')) return;
      else console.error(message);
    });
  };

  const setup = () => {
    const { container } = renderWithRedux(
      <InfographLoader infographState={EMPTY_INFOGRAPH}>
        <Editor />
      </InfographLoader>,
    );
    return container;
  };

  const mockAddResponsiveTextWidget = async () => {
    const predefinedStyle = STYLED_RESPONSIVE_TEXT_WIDGETS[0];
    const { widthPx, heightPx, backgroundShapeData, textWidgetData } = predefinedStyle;
    const widget = generateDefaultData({
      parentDataOverride: { widthPx, heightPx },
      shapeDataOverride: {
        ...backgroundShapeData,
        widthPx,
        heightPx,
      },
      textDataOverride: textWidgetData,
    });

    act(() => {
      store.dispatch(addNewWidget(widget));
    });
  };

  it('should render correctly', async () => {
    disableWarnings();
    setup();
    mockAddResponsiveTextWidget();

    // Responsive widget should be on page
    const responsiveTextWidget = screen.queryByTestId(/widgetbase-019.*/);
    expect(responsiveTextWidget).toBeInTheDocument();

    // Text widget should have width = 100%
    const textWidget = screen.queryByTestId(/widgetbase-003.*/);
    expect(textWidget).toBeInTheDocument();
    expect(textWidget).toHaveStyle('width: 100%');

    // Background shape whould have width/height = 100%
    const shapeWidget = screen.queryByTestId(/widgetbase-006.*/);
    expect(shapeWidget).toBeInTheDocument();
    expect(shapeWidget).toHaveStyle('width: 100%');
    expect(shapeWidget).toHaveStyle('height: 100%');
  });
});
