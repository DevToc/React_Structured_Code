import {
  CustomOnResize,
  CustomOnResizeEnd,
  CustomOnResizeStart,
} from 'modules/Editor/components/BoundingBox/BoundingBox.types';
import { isCornerHandle, isSideHandle } from 'utils/boundingBox';
import { useWidget } from 'widgets/sdk';
import { DEFAULT_GRID_ITEM_SIZE_PX, DEFAULT_GRID_GAP_PX } from './IconWidget.config';
import { IconWidgetData, IconWidgetType } from './IconWidget.types';
import { getIconGridEl } from './IconWidget.helpers';

// The normal single icon has no custom resize behavior
// The grid type icon has custom resize behavior for:
// stacking the icons on top of each other when resizing from the side
// scaling all icons + gap when resizing from the corner
export const useIconResize = () => {
  const {
    widgetId,
    widthPx,
    gridItemWidthPx = DEFAULT_GRID_ITEM_SIZE_PX,
    gridItemHeightPx = DEFAULT_GRID_ITEM_SIZE_PX,
    gridGapPx = DEFAULT_GRID_GAP_PX,
    type = IconWidgetType.Single,
  } = useWidget<IconWidgetData>();

  // if the widget is a single icon, don't do any custom resizing
  if (type === IconWidgetType.Single) {
    return { customOnResizeStart: undefined, customOnResize: undefined, customOnResizeEnd: undefined };
  }

  const customOnResizeStart = ({ event, onResizeStart }: CustomOnResizeStart) => {
    const { direction, target } = event;
    const isSide = isSideHandle(direction);

    if (isSide) target.style.height = 'fit-content';
    onResizeStart(event);
  };

  const customOnResize = ({ event, onResize }: CustomOnResize) => {
    onResize(event);

    const isResizingFromCorner = isCornerHandle(event.direction);
    if (!isResizingFromCorner) return;

    // scale all the icons to fit the new width
    // scaling shouldn't wrap icons to the next line

    // get ratio for scaling icons
    const ratio = event.target.clientWidth / widthPx;

    const iconGridEl = getIconGridEl(widgetId)!;
    const iconEls = iconGridEl.children as HTMLCollectionOf<HTMLDivElement>;

    // Math.floor to be on the safe side to prevent the grid icons from wrapping
    const width = gridItemWidthPx * ratio;
    const height = gridItemHeightPx * ratio;
    const gapScaled = gridGapPx * ratio;

    // scale the gap
    iconGridEl.style.gap = `${gapScaled}px`;

    // scale all the icons
    for (let i = 0; i < iconEls.length; i++) {
      const child = iconEls[i];

      child.style.width = width + 'px';
      child.style.height = height + 'px';
    }
  };

  const customOnResizeEnd = ({ event, onResizeEnd }: CustomOnResizeEnd) => {
    if (!event.lastEvent || !event.lastEvent.direction) return;

    const isResizingFromCorner = isCornerHandle(event.lastEvent.direction);

    // when the icon grid is resized from the corner handles it scales the icons & the gap
    if (isResizingFromCorner) {
      const iconGridEl = getIconGridEl(widgetId)!;
      const firstIconEl = (iconGridEl.firstChild as HTMLDivElement)!;

      // get height/width from the first icon
      const gridItemWidthPx = parseFloat(firstIconEl.style.width);
      const gridItemHeightPx = parseFloat(firstIconEl.style.height);

      // get gap from the icon row
      const gridGapPx = parseFloat(iconGridEl.style.gap);

      // get height from the icon row
      const heightPx = iconGridEl.clientHeight;

      const widgetData = { gridItemWidthPx, gridItemHeightPx, heightPx, gridGapPx };
      onResizeEnd(event, widgetData);
    } else {
      event.target.style.height = event.target.clientHeight + 'px';
      onResizeEnd(event);
    }
  };

  return { customOnResizeStart, customOnResize, customOnResizeEnd };
};
