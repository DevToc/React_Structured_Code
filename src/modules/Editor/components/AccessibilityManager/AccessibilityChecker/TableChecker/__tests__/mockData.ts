import { PageId, WidgetId } from '../../../../../../../types/idTypes';
import { PageToWidgetsMap } from '../../../../../../../types/infographTypes';
import { WidgetType } from '../../../../../../../types/widget.types';
import { generateWidgetId } from '../../../../../../../widgets/Widget.helpers';
import { generateDefaultData } from '../../../../../../../widgets/TextBasedWidgets/TableWidget/TableWidget.helpers';

const tableWithoutHeader = generateDefaultData();
const tableWithHeader = generateDefaultData();

// Change first row to header
tableWithHeader.widgetData.proseMirrorData.content[0].content[0].content.forEach((row) => {
  row.type = 'tableHeader';
});

const generatePageData = (withHeader = false) => {
  const widgetId: WidgetId = generateWidgetId(WidgetType.Table);
  const pageId: PageId = 'page-1';
  const pageData = {
    [pageId]: [
      {
        widgetId,
        widgetData: withHeader ? tableWithHeader.widgetData : tableWithoutHeader.widgetData,
      },
    ],
  } as PageToWidgetsMap;

  return pageData;
};

const generatePageDataWithoutTable = () => {
  const widgetId: WidgetId = generateWidgetId(WidgetType.Text);
  const pageId: PageId = 'page-1';
  const pageData = {
    [pageId]: [
      {
        widgetId,
        widgetData: {},
      },
    ],
  } as PageToWidgetsMap;

  return pageData;
};

export { generatePageData, generatePageDataWithoutTable };
