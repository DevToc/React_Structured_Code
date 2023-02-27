import { screen, fireEvent, within } from '@testing-library/react';
import { renderWithRedux, mockAddBasicShapeWidget, mockSetActiveWidget } from '../../../utils/test-utils.test';
import { EMPTY_INFOGRAPH } from 'utils/loadSampleInfograph';
import { Key } from 'constants/keyboard';

import { InfographLoader } from 'modules/InfographLoader';
import Editor from 'modules/Editor';

describe('widgets/GroupWidget', () => {
  it('should group and ungroup selected widgets', () => {
    renderWithRedux(
      <InfographLoader infographState={EMPTY_INFOGRAPH}>
        <Editor />
      </InfographLoader>,
    );

    mockAddBasicShapeWidget();
    mockAddBasicShapeWidget();

    const groupButton = screen.getByTestId('group-widget-menu');

    // select the widgets
    fireEvent.keyDown(document.body, { which: Key.A, metaKey: true });
    expect(screen.queryAllByTestId(/widgetbase-/)).toHaveLength(2);

    // group selection
    fireEvent.click(groupButton);
    expect(screen.queryAllByTestId(/groupwidget-/)).toHaveLength(1);
    expect(screen.queryAllByTestId(/widgetbase-/)).toHaveLength(2);

    // select the widgets
    fireEvent.keyDown(document.body, { which: Key.A, metaKey: true });
    fireEvent.click(groupButton);

    expect(screen.queryAllByTestId(/widgetbase-/)).toHaveLength(2);
    expect(screen.queryByTestId(/groupwidget-/)).not.toBeInTheDocument();
  });

  it('should group groups', () => {
    renderWithRedux(
      <InfographLoader infographState={EMPTY_INFOGRAPH}>
        <Editor />
      </InfographLoader>,
    );

    mockAddBasicShapeWidget();
    mockAddBasicShapeWidget();
    mockAddBasicShapeWidget();
    mockAddBasicShapeWidget();

    const groupButton = screen.getByTestId('group-widget-menu');

    const widgets = screen.queryAllByTestId(/widgetbase-/);
    const [widget1, widget2, widget3, widget4] = widgets;

    // group the widgets into two groups
    mockSetActiveWidget([widget1.id, widget2.id]);
    fireEvent.click(groupButton);
    expect(screen.queryAllByTestId(/groupwidget-/)).toHaveLength(1);
    mockSetActiveWidget([widget3.id, widget4.id]);
    fireEvent.click(groupButton);
    expect(screen.queryAllByTestId(/groupwidget-/)).toHaveLength(2);

    // select both groups
    fireEvent.keyDown(document.body, { which: Key.A, metaKey: true });
    fireEvent.click(groupButton);

    expect(screen.queryAllByTestId(/groupwidget-/)).toHaveLength(1);

    // select the widgets (TODO: remove this once selection is implemented)
    fireEvent.keyDown(document.body, { which: Key.A, metaKey: true });
    fireEvent.click(groupButton);
    expect(screen.queryAllByTestId(/widgetbase-/)).toHaveLength(4);
    expect(screen.queryByTestId(/groupwidget-/)).not.toBeInTheDocument();
  });

  it('should show selected member widgets toolbar if selected', () => {
    renderWithRedux(
      <InfographLoader infographState={EMPTY_INFOGRAPH}>
        <Editor />
      </InfographLoader>,
    );

    mockAddBasicShapeWidget();
    mockAddBasicShapeWidget();

    const widget = screen.queryAllByTestId(/widgetbase-/)[0];
    const widgetId = widget.id;

    const groupButton = screen.getByTestId('group-widget-menu');

    // select and group the widgets
    fireEvent.keyDown(document.body, { which: Key.A, metaKey: true });
    expect(screen.queryAllByTestId(/widgetbase-/)).toHaveLength(2);
    fireEvent.click(groupButton);

    // select the first group member widget
    mockSetActiveWidget(widgetId);

    const basicShapeToolbar = screen.getByTestId('basic-shape-widget-toolbar');
    expect(basicShapeToolbar).toBeInTheDocument();
  });

  it('should keep grouped widgets at the correct layer index', async () => {
    renderWithRedux(
      <InfographLoader infographState={EMPTY_INFOGRAPH}>
        <Editor />
      </InfographLoader>,
    );

    mockAddBasicShapeWidget();
    mockAddBasicShapeWidget();
    mockAddBasicShapeWidget();
    mockAddBasicShapeWidget();

    const widgets = screen.getAllByTestId(/widgetbase-/);
    const [, widget2, widget3, widget4] = widgets;

    // group the first two widgets
    const groupButton = screen.getByTestId('group-widget-menu');
    mockSetActiveWidget([widget2.id, widget3.id]);
    fireEvent.click(groupButton);

    // grouped widget should be on the same layer after grouping
    [screen.getByTestId(`widgetbase-${widget2.id}`), screen.getByTestId(`widgetbase-${widget3.id}`)].forEach((widget) =>
      expect(widget).toHaveStyle('z-index: 1'),
    );

    const layerButton = screen.getByTestId('widget-layer-menu-trigger-button');
    fireEvent.click(layerButton);

    const layerContent = screen.getByTestId('widget-layer-menu-content');

    // grouped widget should be on the same layer while moving layer
    const [, , moveBackwardsLayerButton] = await within(layerContent).findAllByRole('button');

    fireEvent.click(moveBackwardsLayerButton);
    fireEvent.click(moveBackwardsLayerButton);
    [screen.getByTestId(`widgetbase-${widget2.id}`), screen.getByTestId(`widgetbase-${widget3.id}`)].forEach((widget) =>
      expect(widget).toHaveStyle('z-index: 0'),
    );

    // after ungroup and grouping widgets in group should be at the same layer
    fireEvent.click(groupButton);
    expect(screen.queryByTestId(/groupwidget-/)).not.toBeInTheDocument();

    // ungrouping should set widgets to their own z-index layers
    expect(screen.getByTestId(`widgetbase-${widget2.id}`)).toHaveStyle('z-index: 0');
    expect(screen.getByTestId(`widgetbase-${widget3.id}`)).toHaveStyle('z-index: 1');

    fireEvent.click(groupButton);
    [screen.getByTestId(`widgetbase-${widget2.id}`), screen.getByTestId(`widgetbase-${widget3.id}`)].forEach((widget) =>
      expect(widget).toHaveStyle('z-index: 0'),
    );

    // grouping highest layer widget should set all widgets in group to the highest layer
    // reset group
    fireEvent.click(groupButton);
    mockSetActiveWidget([widget2.id, widget4.id]);
    fireEvent.click(groupButton);
    expect(screen.getByTestId(`widgetbase-${widget2.id}`)).toHaveStyle('z-index: 2');
    expect(screen.getByTestId(`widgetbase-${widget4.id}`)).toHaveStyle('z-index: 2');
  });
});
