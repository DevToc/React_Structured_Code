import { screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { LineWidget } from '../LineWidget';
import { renderWithRedux, mockAddLineWidget, mockSetActiveWidget, renderWidget } from 'utils/test-utils.test';
import { generateDefaultData } from '../LineWidget.helpers';
import { LineWidgetTypes } from '../LineWidget.types';
import { SELECTO_TARGET_CLASS } from '../../../constants/bounding-box';
import { EMPTY_INFOGRAPH } from '../../../utils/loadSampleInfograph';
import { InfographLoader } from '../../../modules/InfographLoader';
import Editor from '../../../modules/Editor';

describe('widgets/LineWidget', () => {
  it('should render correctly', () => {
    const widgetId = '005.widget-1';
    const widget = { widgetId, ...generateDefaultData(LineWidgetTypes.straight) };
    const { asFragment } = renderWidget(<LineWidget />, { widget });

    expect(asFragment()).toMatchSnapshot();
  });

  it('should render line widget', () => {
    const widgetId = '005.widget-1';
    const defaultData = generateDefaultData(LineWidgetTypes.straight);

    const widget = {
      widgetId,
      ...defaultData,
      widgetData: {
        ...defaultData.widgetData,
        altText: null,
        isDecorative: true,
      },
    };

    renderWidget(<LineWidget />, { widget });

    expect(screen.getByTestId('line-widget')).toBeInTheDocument();
    expect(screen.getByTestId('line-widget-renderer')).toBeInTheDocument();

    // To use custom selection, there must be no single selection target class.
    const widgetElement = screen.getByTestId(`widgetbase-${widgetId}`);
    expect(widgetElement.classList.contains(SELECTO_TARGET_CLASS)).toBeTruthy();
    expect(widgetElement).toHaveStyle({ pointerEvents: 'none' });
  });

  it('should provide the a11y mode via key input', () => {
    renderWithRedux(
      <InfographLoader infographState={EMPTY_INFOGRAPH}>
        <Editor />
      </InfographLoader>,
    );

    mockAddLineWidget();
    const widget = screen.queryAllByTestId(/widgetbase-/)[0];
    mockSetActiveWidget(widget.id);

    const [startHandler, endHandler] = screen.getAllByTestId('linewidget-customhandler');
    expect(startHandler).toHaveAttribute('data-handler-direction', 'start');
    expect(startHandler).toHaveAttribute('data-handler-index', '0');
    expect(endHandler).toHaveAttribute('data-handler-direction', 'end');
    expect(endHandler).toHaveAttribute('data-handler-index', '1');

    // It use fireEvent instead of the userEvent because of the pointer-events none on the widget base
    fireEvent.click(widget);

    // When entering edit mode for the first time, focusing with start handler
    userEvent.keyboard('{enter}');
    expect(startHandler).toHaveFocus();

    // When triggering tab key, it moves the focus to the next handler
    userEvent.tab();
    expect(endHandler).toHaveFocus();

    // When triggering tab key and it is the last handler, it moves the focus to the first handler
    userEvent.tab();
    expect(startHandler).toHaveFocus();

    // Reset the focus to the widget when triggering the escape key
    userEvent.keyboard('{esc}');
    expect(widget).toHaveFocus();
  });
});
