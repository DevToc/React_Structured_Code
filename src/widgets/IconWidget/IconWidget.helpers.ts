import { WidgetType } from 'types/widget.types';
import { WidgetId } from 'types/idTypes';
import {
  IconStyle,
  AdjustSvgViewBox,
  Dimensions,
  IconWidgetData,
  IconWidgetType,
  FillDirection,
} from './IconWidget.types';
import { VERSION } from './IconWidget.upgrade';
import {
  DEFAULT_NR_ICONS,
  DEFAULT_GRID_ITEM_SIZE_PX,
  DEFAULT_GRID_GAP_PX,
  DEFAULT_SHAPE_COLOR_ONE,
  DEFAULT_SHAPE_COLOR_TWO,
} from './IconWidget.config';

const FILL_SVG_REGEX = /fill=".*?"/g;
const removeAllFill = (svgHtml: string): string => svgHtml?.replace(FILL_SVG_REGEX, '');

const preProcessSvg = (svgHtml: string, color: number): string => (color ? svgHtml : removeAllFill(svgHtml));

const generateClipPath = (fill: number, fillDirection: FillDirection): string => {
  const clipFill = 100 - fill;

  if (fillDirection === FillDirection.TopDown) return `inset(0% 0% ${clipFill}% 0%)`;
  if (fillDirection === FillDirection.LeftRight) return `inset(0% ${clipFill}% 0% 0%)`;

  return '';
};

const getIconStyle = (isMirrored: boolean): IconStyle => {
  const iconStyle: IconStyle = { width: '100%', height: '100%' };

  if (isMirrored) {
    iconStyle.transform = 'scale(-1, 1)';
    iconStyle.transformOrigin = 'center';
  }

  return iconStyle;
};

const getIconGridId = (widgetId: WidgetId): string => `iconGrid${widgetId}`;
const getIconGridEl = (widgetId: WidgetId): HTMLElement => document.getElementById(getIconGridId(widgetId))!;

/**
 * Get the height of the grid based on the number of icons.
 * This is done by cloning the widget and adding the new number of icons.
 * This is then measured and the clone is removed.
 * This is done because the grid height is not known until the icons are rendered.
 *
 * @param widgetId
 * @param numberOfIcons
 * @return {number} - new height of the grid
 */
const getHeightOfGrid = (widgetId: WidgetId, numberOfIcons: number) => {
  const clonedWidget = document.getElementById(widgetId)!.cloneNode(true) as HTMLElement;
  const iconGridEl = clonedWidget.querySelector('div')! as HTMLElement;
  const firstChildClone = iconGridEl.firstChild!.cloneNode(true);

  // remove all children
  while (iconGridEl.firstChild) {
    iconGridEl.removeChild(iconGridEl.firstChild);
  }

  // add the new number of icons
  for (let i = 0; i < numberOfIcons; i++) {
    iconGridEl.appendChild(firstChildClone.cloneNode(true));
  }

  // add the cloned widget to the DOM
  clonedWidget.style.visibility = 'hidden';
  document.body.appendChild(clonedWidget);

  // measure the height
  const newHeight = iconGridEl.clientHeight;

  // remove the clone
  document.body.removeChild(clonedWidget);

  return newHeight;
};

/**
 * Get the height of the grid based on the grid gap.
 * This is done by cloning the widget and setting the new grid gap.
 * This is then measured and the clone is removed.
 * This is done because the grid height is not known until the icons with gap are rendered.
 *
 * @param widgetId
 * @param gapPx
 * @return {number} - new height of the grid
 */
const getHeightOfGap = (widgetId: WidgetId, gapPx: number) => {
  const clonedWidget = document.getElementById(widgetId)!.cloneNode(true) as HTMLElement;
  const iconGridEl = clonedWidget.querySelector('div')! as HTMLElement;

  // set new grid gap
  iconGridEl.style.gap = `${gapPx}px`;

  // add the cloned widget to the DOM
  clonedWidget.style.visibility = 'hidden';
  document.body.appendChild(clonedWidget);

  // measure the height
  const newHeightPx = iconGridEl.clientHeight;

  // remove the clone
  document.body.removeChild(clonedWidget);

  return newHeightPx;
};

/**
 * Get the height of the grid widget for a new icon size.
 * This is done by cloning the widget and setting the new icon size for all icons.
 * This is then measured and the clone is removed.
 * This is done because the height is not known until the icons with the new dimensions are rendered.
 *
 * @param widgetId
 * @param gridIconWidth - new width of the grid icon
 * @param gridIconHeight - new height of the grid icon
 * @return {{ width: number, height: number}} - new height of the grid
 */
const getGridIconSize = (widgetId: WidgetId, gridIconWidth: number, gridIconHeight: number) => {
  const clonedWidget = document.getElementById(widgetId)!.cloneNode(true) as HTMLElement;
  const iconGridEl = clonedWidget.querySelector('div')! as HTMLElement;

  // update size of all children
  const children = iconGridEl.children as HTMLCollectionOf<HTMLElement>;
  for (let i = 0; i < children.length; i++) {
    const child = children[i];
    child.style.width = `${gridIconWidth}px`;
    child.style.height = `${gridIconHeight}px`;
  }

  // add the cloned widget to the DOM
  clonedWidget.style.visibility = 'hidden';
  document.body.appendChild(clonedWidget);

  // measure the height
  const newHeightPx = iconGridEl.clientHeight;
  const newWidthPx = iconGridEl.clientWidth;

  // remove the clone
  document.body.removeChild(clonedWidget);

  return { width: newWidthPx, height: newHeightPx };
};

/**
 * Convert svg and calculate the aspect ratio fit for the provided max size.
 *
 * @param viewBox - The icon meta data object
 * @param maxSize - max size for height / width
 * @return {Dimensions}
 */
const adjustSVGViewBox = ({ viewBox, maxSize }: AdjustSvgViewBox): Dimensions => {
  if (!viewBox) return { width: maxSize, height: maxSize };

  const viewBoxArr = viewBox.split(' ').map((view) => +view);
  const adjustRatio = maxSize / Math.max(viewBoxArr[2], viewBoxArr[3]);

  const width = adjustRatio * viewBoxArr[2];
  const height = adjustRatio * viewBoxArr[3];

  return { width, height };
};

/**
 * Get the icon grid array.
 * This is used to determine the fill color of each icon in the grid
 * The fill color is determined by the fill percentage and the number of icons.
 *
 * // 0 = 100% fill color one , 1 = 100% fill color two
 * E.g 55% fill w/ 10 icons -> [0, 0, 0, 0, 0.5, 1, 1, 1, 1, 1]
 * E.g 30% fill w/ 10 icons -> [0, 0, 0, 1, 1, 1, 1, 1, 1, 1]
 *
 * @param viewBox - The icon meta data object
 * @param maxSize - max size for height / width
 * @return {{ shapeFill: number; shapeColorOne: string; shapeColorTwo: string | undefined }[]}
 */
const getIconGridArr = (
  numberOfIcons: number,
  shapeFill: number,
  shapeColorOne: string,
  shapeColorTwo: string,
): { shapeFill: number; shapeColorOne: string; shapeColorTwo: string | undefined }[] => {
  const fillPercent = shapeFill / 100;
  const startFillIndex = fillPercent * numberOfIcons;

  // split the number into whole integer and float part
  // e.g. 5.5 -> [5, 5], 33.33 -> [33, 33],
  const [num, float] = startFillIndex
    .toString()
    .split('.')
    .map((n) => {
      if (n.length > 1 && n[0] === '0') return parseInt(n[1]) / 10;
      return parseInt(n);
    });

  const iconArr = [];
  for (let i = 0; i < numberOfIcons; i++) {
    let colorOne = i < startFillIndex ? shapeColorOne : shapeColorTwo;

    // default fill is 100% for all icons in the grid
    let fill = 100;
    // only partially filled icons need the secondary color
    let colorTwo = undefined;

    const hasPartialFill = i === num && float > 0;
    if (hasPartialFill) {
      // shape colors are reversed for partial filled icons
      colorTwo = shapeColorOne;
      colorOne = shapeColorTwo;

      // if the float is less than 1 (e.g. 0.1), then the fill is the float * 10
      if (!Number.isInteger(float) && float < 1) {
        fill = float * 10;
      } else {
        // get the first two numbers of the float part
        const fillPrecision = 2;
        const formatFloatString = float < 10 ? String(float).padEnd(fillPrecision, '0') : String(float);
        const partialFill = Number(formatFloatString.slice(0, fillPrecision));

        fill = partialFill;
      }
    }

    iconArr.push({ shapeColorOne: colorOne, shapeColorTwo: colorTwo, shapeFill: fill });
  }

  return iconArr;
};

/**
 * Generate default icon widget data
 *
 * @param iconId - icon id from the icon API
 * @param viewBox - icon meta data viewbox string (for the icons aspect ratio)
 * @param topPxOverride - top position override
 * @param leftPxOverride - left position override
 * @param iconConfig - config for overriding default icon widget data
 * @returns default icon widget data
 */
const generateDefaultData = (
  iconId: string,
  viewBox?: string,
  topPxOverride?: number,
  leftPxOverride?: number,
  iconConfig?: Partial<IconWidgetData>,
) => {
  const { width: widthPx, height: heightPx } = adjustSVGViewBox({ viewBox, maxSize: 300 });

  const widget = {
    widgetType: WidgetType.Icon,
    widgetData: {
      version: VERSION,
      topPx: topPxOverride || 0,
      leftPx: leftPxOverride || 0,
      rotateDeg: 0,
      iconId,
      widthPx: iconConfig?.widthPx || widthPx,
      heightPx: iconConfig?.heightPx || heightPx,
      shapeColorOne: iconConfig?.shapeColorOne || DEFAULT_SHAPE_COLOR_ONE,
      shapeColorTwo: iconConfig?.shapeColorTwo || DEFAULT_SHAPE_COLOR_TWO,
      shapeFill: iconConfig?.shapeFill || 0,
      isMirrored: false,
      altText: '',
      isDecorative: true,
      numberOfIcons: DEFAULT_NR_ICONS,
      gridGapPx: DEFAULT_GRID_GAP_PX,
      gridItemWidthPx: DEFAULT_GRID_ITEM_SIZE_PX,
      gridItemHeightPx: DEFAULT_GRID_ITEM_SIZE_PX,
      type: iconConfig?.type || IconWidgetType.Single,
      isHidden: iconConfig?.isHidden || false,
    },
  };

  return widget;
};

export {
  adjustSVGViewBox,
  getIconGridArr,
  generateDefaultData,
  getHeightOfGap,
  generateClipPath,
  getIconStyle,
  getHeightOfGrid,
  getIconGridId,
  getIconGridEl,
  preProcessSvg,
  getGridIconSize,
};
