import clonedeep from 'lodash.clonedeep';

import { PageId, WidgetId } from '../../../../../../../types/idTypes';
import { WidgetType } from '../../../../../../../types/widget.types';
import { TextWidgetData } from '../../../../../../../widgets/TextBasedWidgets/TextWidget/TextWidget.types';
import { PageToWidgetsMap } from '../../../../../../../types/infographTypes';
import { AllWidgetData } from '../../../../../../../widgets/Widget.types';
import { TableWidgetData } from '../../../../../../../widgets/TextBasedWidgets/TableWidget/TableWidget.types';

import { generateDefaultData } from '../../../../../../../widgets/TextBasedWidgets/TextWidget/TextWidget.helpers';
import { generateWidgetId } from '../../../../../../../widgets/Widget.helpers';
import { generatePageId } from '../../../../../store/pageControlSlice';
import { generateDefaultData as generateTableData } from '../../../../../../../widgets/TextBasedWidgets/TableWidget/TableWidget.helpers';

const titleData = generateDefaultData('title', 'test').widgetData as TextWidgetData;
const paragraphData = generateDefaultData('paragraph', 'test').widgetData as TextWidgetData;
const tableData = generateTableData().widgetData as TableWidgetData;

const invalidTextSizeData = clonedeep(paragraphData);
const missingMarksData = clonedeep(paragraphData);
const missingContentData = clonedeep(paragraphData);
const invalidTableTextSizeData = clonedeep(tableData);

if (invalidTextSizeData?.proseMirrorData?.content?.[0].content?.[0].marks?.[0].attrs) {
  invalidTextSizeData.proseMirrorData.content[0].content[0].marks[0].attrs.fontSize = '10px';
}

if (missingMarksData?.proseMirrorData?.content?.[0].content?.[0].marks) {
  delete missingMarksData.proseMirrorData.content[0].content[0].marks;
}

if (missingContentData?.proseMirrorData?.content) {
  delete missingContentData.proseMirrorData.content;
}

if (
  invalidTableTextSizeData.proseMirrorData?.content?.[0].content?.[0].content?.[0].content?.[0].content?.[0].marks?.[0]
    .attrs?.fontSize
) {
  invalidTableTextSizeData.proseMirrorData.content[0].content[0].content[0].content[0].content[0].marks[0].attrs.fontSize =
    '12px';
}

const generatePageData = (widgetData: AllWidgetData): PageToWidgetsMap => {
  const pageId = generatePageId();
  const widgetId = generateWidgetId(WidgetType.Text) as WidgetId;
  const pageData = {
    [pageId]: [
      {
        widgetId,
        widgetData,
      },
    ],
  } as PageToWidgetsMap;

  return pageData;
};

export type PageWidgetMapping = { pageId: PageId; widgetId: WidgetId }[];

export {
  titleData,
  paragraphData,
  tableData,
  invalidTextSizeData,
  missingMarksData,
  missingContentData,
  invalidTableTextSizeData,
  generatePageData,
};
