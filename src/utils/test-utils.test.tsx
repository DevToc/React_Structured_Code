// @ts-nocheck
import { ReactNode, cloneElement } from 'react';
import { render, act } from '@testing-library/react';
import { ChakraProvider } from '@chakra-ui/react';
import { I18nextProvider } from 'react-i18next';
import { Provider } from 'react-redux';
import cloneDeep from 'lodash.clonedeep';
import { theme } from 'theme';
import i18n from 'i18n-test';

import { EMPTY_INFOGRAPH } from 'utils/loadSampleInfograph';
import { generateDefaultData as generateBasicShapeData } from 'widgets/BasicShapeWidget/BasicShapeWidget.helpers';
import { generateDefaultData as generateTextWidgetData } from 'widgets/TextBasedWidgets/TextWidget/TextWidget.helpers';
import { generateDefaultData as generateLineWidgetData } from 'widgets/LineWidget/LineWidget.helpers';
import { generateDefaultData as generateLineChartWidgetData } from 'widgets/ChartWidgets/LineChartWidget/LineChartWidget.helpers';
import { generateDefaultData as generateIconWidgetData } from 'widgets/IconWidget/IconWidget.helpers';
import { BasicShapeType } from 'widgets/BasicShapeWidget/BasicShapeWidget.types';
import { store, addNewWidget, setActivePage } from 'modules/Editor/store';
import { HistoryManagerProvider } from 'modules/Editor/store/history/historyManager';
import { addNewPage, setActiveWidget } from 'modules/Editor/store/store';
import { updateWidget } from 'modules/Editor/store/infographSlice';
import { setAccessibilityViewIndex } from 'modules/Editor/store/editorSettingsSlice';
import { AccessibilityViewIndex } from 'types/accessibilityViewIndex';
import { loadInfograph } from 'modules/Editor/store/infographSlice';
import { WidgetStore } from 'widgets/store';

const WithAppProviders = ({ children }: { children: ReactNode }) => (
  <I18nextProvider i18n={i18n}>
    <ChakraProvider theme={theme}>{children}</ChakraProvider>
  </I18nextProvider>
);

const WithRedux = ({ children }: { children: ReactNode }) => (
  <I18nextProvider i18n={i18n}>
    <ChakraProvider theme={theme}>
      <Provider store={store}>
        <HistoryManagerProvider>{children}</HistoryManagerProvider>
      </Provider>
    </ChakraProvider>
  </I18nextProvider>
);

// For rendering one widget with all the editor contexts and with redux and the widget store
const WidgetWithRedux = ({ children, widget }: { children: ReactNode }) => {
  const { widgetId, widgetData } = widget;

  return (
    <WithRedux>
      <WidgetStore widgetId={widgetId} customWidgetData={widgetData}>
        {/* Temporary: Once useWidget is added this can be removed */}
        {cloneElement(children, { widgetData, widgetId })}
      </WidgetStore>
    </WithRedux>
  );
};

type RenderParamType = Parameters<typeof render>;
export const renderWithAppProviders = (ui: RenderParamType[0], options?: RenderParamType[1]) =>
  render(ui, { wrapper: WithAppProviders, ...options });
export const renderWithRedux = (ui: RenderParamType[0], options?: RenderParamType[1]) =>
  render(ui, { wrapper: WithRedux, ...options });

export const renderWidget = (ui: RenderParamType[0], options?: RenderParamType[1]) => {
  return render(ui, { wrapper: (props) => <WidgetWithRedux {...props} widget={options.widget} />, ...options });
};

export const mockAddBasicShapeWidget = (type: BasicShapeType = BasicShapeType.Rectangle) => {
  const basicShapeWidget = generateBasicShapeData(type, false);
  act(() => {
    store.dispatch(addNewWidget(basicShapeWidget));
  });
};

export const mockAddTextWidget = (addLink: boolean = false) => {
  const textWidget = generateTextWidgetData('paragraph', 'hello', addLink);
  act(() => store.dispatch(addNewWidget(textWidget)));
};

export const mockAddLineWidget = () => {
  const lineWidget = generateLineWidgetData('straight');
  act(() => store.dispatch(addNewWidget(lineWidget)));
};

export const mockAddLineChartWidget = () => {
  const lineChartWidget = generateLineChartWidgetData();
  act(() => store.dispatch(addNewWidget(lineChartWidget)));
};

export const mockAddIconWidget = (
  iconId?: string,
  viewBox?: string,
  topPxOverride?: number,
  leftPxOverride?: number,
  iconConfig?: Partial<IconWidgetData>,
) => {
  const iconWidget = generateIconWidgetData(iconId, viewBox, topPxOverride, leftPxOverride, iconConfig);
  act(() => store.dispatch(addNewWidget(iconWidget)));
};

// selection relies on document.elementFromPoint() which is not provided by JSDOM
// --> can't fire click event to select widget
export const mockSetActiveWidget = (id: string | string[]) => act(() => store.dispatch(setActiveWidget(id)));

export const mockAddNewPage = () => {
  const pageId = store.getState().pageControl.activePageId;
  act(() => store.dispatch(addNewPage({ insertAfterId: pageId })));
};

export const mockUpdateWidget = (widgetId, widgetData) => {
  act(() => store.dispatch(updateWidget({ widgetId, widgetData })));
};

export const mockOpenAccessibilityManager = () => {
  act(() => store.dispatch(setAccessibilityViewIndex(AccessibilityViewIndex.CHECK)));
};
export const mockCloseAccessibilityManager = () => {
  act(() => store.dispatch(setAccessibilityViewIndex(AccessibilityViewIndex.CLOSED)));
};
export const mockLoadWidgetToInfograph = (widget) => {
  const { widgetId, widgetData } = widget;
  const EMPTY_INFOGRAPH_COPY = cloneDeep(EMPTY_INFOGRAPH);
  EMPTY_INFOGRAPH_COPY.widgets[widgetId] = widgetData;
  EMPTY_INFOGRAPH_COPY.pages['page-1'].widgetLayerOrder = [widgetId];

  act(() => store.dispatch(loadInfograph(EMPTY_INFOGRAPH_COPY)));
  act(() => store.dispatch(setActivePage('page-1')));
};
