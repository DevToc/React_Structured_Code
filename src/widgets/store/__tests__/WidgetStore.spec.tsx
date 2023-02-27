import { screen } from '@testing-library/react';
import cloneDeep from 'lodash.clonedeep';
import { renderWithRedux, mockUpdateWidget } from 'utils/test-utils.test';
import { EMPTY_INFOGRAPH } from 'utils/loadSampleInfograph';
import { InfographLoader } from 'modules/InfographLoader';
import { generateDefaultData } from 'widgets/ImageWidget/ImageWidget.helpers';
import { useWidget } from 'widgets/sdk';
import { WidgetStore } from '../WidgetStore';

const MockWidget = () => {
  const { widthPx, url } = useWidget();

  return (
    <>
      <div>width: {widthPx}</div>
      <div>url: {url}</div>
    </>
  );
};

const widgetId = '007.widget-1';
const mockUrl = 'cat.png';
const mockSize = { width: 408, height: 408 };
const props = {
  widgetId,
  ...generateDefaultData(mockUrl, mockSize, {
    width: EMPTY_INFOGRAPH.size.widthPx,
    height: EMPTY_INFOGRAPH.size.heightPx,
  }),
};

const renderMockWidgetWithStore = (customWidgetData) => {
  // add a mock widget to the editor store
  const INFOGRAPH = cloneDeep(EMPTY_INFOGRAPH);
  INFOGRAPH.widgets[widgetId] = props.widgetData;

  renderWithRedux(
    <InfographLoader infographState={INFOGRAPH}>
      <WidgetStore widgetId={widgetId} zIndex={5} customWidgetData={customWidgetData}>
        <MockWidget />
      </WidgetStore>
    </InfographLoader>,
  );
};

describe('widgets/store/WidgetStore', () => {
  it('should provide updated state to child widgets', async () => {
    renderMockWidgetWithStore();

    // Widgetstore should provide the widgetData to the child widget
    const width = await screen.findByText(`width: ${mockSize.width}`);
    const url = await screen.findByText(`url: ${mockUrl}`);
    expect(width).toBeInTheDocument();
    expect(url).toBeInTheDocument();

    // Widgetstore should provide update widgetData to the child widget
    const newUrl = 'dog.png';
    mockUpdateWidget(widgetId, { url: newUrl });
    const newUrlText = await screen.findByText(`url: ${newUrl}`);
    expect(newUrlText).toBeInTheDocument();
  });

  it('should override widget data with custom data', async () => {
    const customWidth = 10;
    renderMockWidgetWithStore({ widthPx: customWidth });

    const width = await screen.findByText(`width: ${customWidth}`);
    expect(width).toBeInTheDocument();
  });
});
