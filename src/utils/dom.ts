import { PORT_CONTAINER_CLASS, PORT_SELECTOR_CLASS, WIDGETBASE_CLASS } from 'constants/bounding-box';
import { WrapperPos } from 'types/flowCore.types';
import { WidgetType } from 'types/widget.types';
import { getWidgetTypeFromId } from 'widgets/Widget.helpers';
import { parseStrictNumber } from './number';

const detectElement = (clientX: number, clientY: number, className: string): HTMLElement | null =>
  document
    .elementsFromPoint(clientX, clientY)
    .find((element) =>
      element?.classList?.contains(className) ? element : element?.closest(`.${className}`),
    ) as HTMLElement;
/**
 * Check that the mouse cursor detects the port element.
 * @param clientX
 * @param clientY
 * @returns
 */
export const detectPortElement = (clientX: number, clientY: number): HTMLElement | null =>
  detectElement(clientX, clientY, PORT_SELECTOR_CLASS);

/**
 * Check that the mouse cursor detects the port container.
 * @param clientX
 * @param clientY
 * @returns
 */
export const detectPortContainer = (clientX: number, clientY: number): HTMLElement | null =>
  detectElement(clientX, clientY, PORT_CONTAINER_CLASS);

/**
 * Check that the mouse cursor detects widget elements except for line widgets
 * @param clientX
 * @param clientY
 * @returns
 */
export const detectWidgetElement = (clientX: number, clientY: number): HTMLElement | undefined => {
  const targetWidgetElement =
    (document.elementsFromPoint(clientX, clientY).find((element) => {
      const widgetContainer = element?.classList?.contains(WIDGETBASE_CLASS)
        ? element
        : element?.closest(`.${WIDGETBASE_CLASS}`);
      if (!widgetContainer) return false;
      return getWidgetTypeFromId(widgetContainer.id) !== WidgetType.Line; // Ignore line widget
    }) as HTMLElement) ?? null;
  const widgetContainer =
    (targetWidgetElement?.classList?.contains(WIDGETBASE_CLASS)
      ? targetWidgetElement
      : (targetWidgetElement?.closest(`.${WIDGETBASE_CLASS}`) as HTMLElement)) ?? null;

  return widgetContainer;
};

/**
 * Return the parent widget element
 * @param widgetElm
 * @returns {HTMLElement | null}
 */
export const getParentWidgetElement = (widgetElm: HTMLElement): HTMLElement | null => {
  const parentElement = widgetElm.parentElement?.closest(`.${WIDGETBASE_CLASS}`) as HTMLElement;
  return parentElement || null;
};

/**
 * Calculate the matrix value using the element's transform value
 * @param targe {HTMLElement}
 * @returns {DOMMatrix} https://developer.mozilla.org/en-US/docs/Web/API/DOMMatrix/DOMMatrix
 */
export const getDOMMatrix = (target: HTMLElement): DOMMatrix => {
  return new DOMMatrix(getComputedStyle(target).transform);
};

/**
 * return the WrapperPosition by html element
 * @param targetElm
 * @returns {WrapperPos}
 */
export const getWidgetPosition = (targetElm: HTMLElement): WrapperPos => {
  const result = {
    topPx: parseStrictNumber(targetElm.offsetTop),
    leftPx: parseStrictNumber(targetElm.offsetLeft),
    widthPx: parseStrictNumber(targetElm.clientWidth),
    heightPx: parseStrictNumber(targetElm.clientHeight),
  };

  return result;
};
/**
 * Return the calculated offset of all parent widgets of the target element (Responsive widget and Group widget)
 * @param targetElm
 * @returns
 */
export const calculateAllParentWidgetOffset = (
  targetElm: HTMLElement,
  offset: { leftPx: number; topPx: number } = { leftPx: 0, topPx: 0 },
) => {
  let result = offset;
  const parentElement = getParentWidgetElement(targetElm);
  if (parentElement) {
    const parentWrapperPosition = getWidgetPosition(parentElement);
    result.leftPx += parentWrapperPosition.leftPx;
    result.topPx += parentWrapperPosition.topPx;
    result = calculateAllParentWidgetOffset(parentElement, offset);
  }

  return result;
};
