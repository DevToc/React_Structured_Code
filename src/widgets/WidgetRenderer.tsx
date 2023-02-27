import { ReactElement, memo, useMemo } from 'react';

import { PageId, WidgetId } from 'types/idTypes';
import { WidgetType, Widget } from 'types/widget.types';
import { TreeNode } from 'types/structuredContentTypes';
import { useAppSelector } from 'modules/Editor/store/hooks';
import { selectPageStructureTree } from 'modules/Editor/store/infographSelector';
import { getLeafNodes } from 'modules/Editor/components/AccessibilityManager/AccessibilityManager.helpers';
import { WidgetStore } from 'widgets/store';
import { getWidgetTypeFromId, getPageWidgetIdsToRender, calculateZIndexOrdering } from 'widgets/Widget.helpers';
import { WIDGET_TYPE_MAP } from 'widgets/Widget.config';

interface RenderWidgetProps {
  widgetId: WidgetId;
  zIndex: number;
  includeAltTextImg?: boolean;
  isReadOnly?: boolean;
}

/**
 * This component is responsible for rendering the widget based on the widget type
 *
 * @param widgetId
 * @param isReadOnly - if true, will render read only widget
 * @param zIndex - zIndex to append to widget data
 * @param includeAltTextImg - if true, will render alt text image
 * @returns
 */
const RenderWidget = ({
  widgetId,
  zIndex,
  isReadOnly = false,
  includeAltTextImg,
}: RenderWidgetProps): ReactElement | null => {
  if (!widgetId) return null;

  // Get corresponding widget component and type converter function
  const WidgetComponent = getWidgetComponent();

  return (
    <WidgetComponent
      isReadOnly={isReadOnly}
      widgetId={widgetId}
      zIndex={zIndex}
      getWidgetMemberComponent={getWidgetComponent}
      includeAltTextImg={includeAltTextImg}
    />
  );
};

interface WidgetRendererProps {
  pageId: PageId;
  isReadOnly?: boolean;
}

/**
 * This component is responsible for rendering all widgets on a page.
 * The widgets layer position / z-index is calculated based on the widget's position in the page widgetLayerOrder
 *
 * @param pageId ID of the page
 * @param isReadOnly - if true, will render read only widgets
 * @returns
 */
export const WidgetRenderer = ({ pageId, isReadOnly = false }: WidgetRendererProps): ReactElement => {
  const layers: Array<WidgetId> = useAppSelector((state) => state.infograph.pages[pageId]?.widgetLayerOrder || []);
  return (
    <>
      {layers.map((wId, i) => (
        <RenderWidget isReadOnly={isReadOnly} key={wId} widgetId={wId} zIndex={layers.indexOf(wId)} />
      ))}
    </>
  );
};

/**
 * Render widgets as a simple list base on flattern structure tree
 * Note: requires further update when we introduce nested group structure
 *
 * @param pageId ID of the page to render, from infographSlice
 * @returns
 */
export const ReadOnlyStructureTreeListWidgetRenderer = memo(({ pageId }: { pageId: PageId }): ReactElement => {
  const widgets = useAppSelector((state) => state.infograph.widgets);
  const page = useAppSelector((state) => state.infograph.pages[pageId]);
  const pageWidgetLayers = getPageWidgetIdsToRender(page, widgets);
  // Remove group widgets from the layers as they are not a part of the structure tree
  const layers: Array<WidgetId> = pageWidgetLayers.filter((wId) => getWidgetTypeFromId(wId) !== WidgetType.Group);
  const structureTree = useAppSelector(selectPageStructureTree(pageId)) as TreeNode;
  const widgetOrderList = useMemo(() => (structureTree ? getLeafNodes(structureTree) : []), [structureTree]);

  const difference = widgetOrderList
    .filter((id) => !layers.includes(id))
    .concat(layers.filter((id) => !widgetOrderList.includes(id)));

  // Fallback to normal layers if there is out of sync widgets between widgetLayerOrder and widgetStructureTree
  const widgetList = difference.length === 0 ? widgetOrderList : layers;

  // Out of sync warning
  if (difference.length > 0) {
    console.warn('There is out of sync widgets between widgetLayerOrder and widgetStructureTree', difference);
  }

  // Adobe Acrobat reader and NVDA use the reading order based on the element's zIndex.
  // Re-calculate the zIndex-ordered array using the structure tree and the array of layers.
  const newWidgetLayers = calculateZIndexOrdering(widgets, widgetOrderList, layers);

  return (
    <>
      {widgetList.map((wId) => (
        <RenderWidget isReadOnly key={wId} widgetId={wId} zIndex={newWidgetLayers.indexOf(wId)} includeAltTextImg />
      ))}
    </>
  );
});

interface WidgetWithStoreProps {
  widgetId: WidgetId;
  zIndex?: number;
  customWidgetData?: Partial<Widget>;
  getWidgetMemberComponent?: () => typeof WidgetWithStore;
  isReadOnly?: boolean;
  includeAltTextImg?: boolean;
}

/**
 *  This component is responsible for rendering the widget based on the widget type
 *  It also provides the widget data to the widget component
 *
 * @param widgetId
 * @param zIndex - zIndex to append to widget data
 * @param customWidgetData - custom widget data to override the widget data from the store
 * @param getWidgetMemberComponent - function to get the widget component
 * @param isReadOnly - if true, will render read only widget
 * @param includeAltTextImg - if true, will render alt text image
 *
 */

const WidgetWithStore = ({
  zIndex,
  customWidgetData,
  getWidgetMemberComponent,
  widgetId,
  isReadOnly = false,
  includeAltTextImg = false,
}: WidgetWithStoreProps) => {
  const widgetTypeId = getWidgetTypeFromId(widgetId);

  const Component = isReadOnly ? WIDGET_TYPE_MAP[widgetTypeId]?.readOnlyWidget : WIDGET_TYPE_MAP[widgetTypeId]?.widget;
  const isHidden = useAppSelector((state) => state.infograph.widgets[widgetId]?.isHidden);

  if (!Component) {
    console.warn(`Widget ${widgetTypeId} not found`);
    return null;
  }

  // Hidden widgets are not rendered
  if (isHidden) return null;

  return (
    <WidgetStore widgetId={widgetId} zIndex={zIndex} customWidgetData={customWidgetData}>
      <Component getWidgetMemberComponent={getWidgetMemberComponent} includeAltTextImg={includeAltTextImg} />
    </WidgetStore>
  );
};

/**
 * Returns the WidgetWithStore component for rendering a widget
 * it's also passed to group / responsive widget to render their member widgets
 */

export const getWidgetComponent = () => WidgetWithStore;
