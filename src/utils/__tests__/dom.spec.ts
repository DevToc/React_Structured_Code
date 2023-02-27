import { WIDGETBASE_CLASS } from 'constants/bounding-box';
import { calculateAllParentWidgetOffset, getParentWidgetElement, getWidgetPosition } from 'utils/dom';

/**
 * NOTE: It doens't test some functions because of the testing library don't support the document.elementsFromPoint and DOMMatrix
 * [document.elementsFromPoint]: detectPortElement, detectPortContainer, detectWidgetElement
 * [DOMMatrix]: getDOMMatrix
 */
describe('utils/dom.ts', () => {
  let parentElement: HTMLElement | undefined;
  let childrenElement: HTMLElement | undefined;
  let pureElement: HTMLElement | undefined;

  beforeAll(() => {
    // parentElement
    parentElement = document.createElement('div');
    parentElement.style.height = '200px';
    parentElement.style.width = '100px';
    parentElement.style.top = '20px';
    parentElement.style.left = '40px';
    parentElement.style.display = 'block';
    parentElement.style.position = 'absolute';
    parentElement.classList.add(WIDGETBASE_CLASS);

    // childrenElement
    childrenElement = document.createElement('div');
    childrenElement.style.height = '200px';
    childrenElement.style.width = '100px';
    childrenElement.style.top = '50px';
    childrenElement.style.left = '60px';
    childrenElement.style.display = 'block';
    childrenElement.style.position = 'absolute';
    childrenElement.classList.add(WIDGETBASE_CLASS);

    // offsetTop, offsetLeft always 0 so manually override the property.
    Object.defineProperty(parentElement, 'offsetTop', {
      configurable: true,
      value: 20,
    });
    Object.defineProperty(parentElement, 'offsetLeft', {
      configurable: true,
      value: 40,
    });
    Object.defineProperty(parentElement, 'clientWidth', {
      configurable: true,
      value: 100,
    });
    Object.defineProperty(parentElement, 'clientHeight', {
      configurable: true,
      value: 200,
    });
    Object.defineProperty(childrenElement, 'offsetTop', {
      configurable: true,
      value: 50,
    });
    Object.defineProperty(childrenElement, 'offsetLeft', {
      configurable: true,
      value: 60,
    });

    // pureElement
    pureElement = document.createElement('div');

    parentElement.appendChild(childrenElement);
    document.body.appendChild(parentElement);
    document.body.appendChild(pureElement);
  });

  describe('getParentWidgetElement', () => {
    it('should return the parent element for the children widget element', () => {
      const parentElm = getParentWidgetElement(childrenElement as HTMLElement);
      expect(parentElm).not.toBeNull();
      expect(parentElm).toBe(parentElement);
    });
    it('should return the null for parent widget element', () => {
      const nothing = getParentWidgetElement(parentElement as HTMLElement);
      expect(nothing).toBeNull();
    });
  });

  describe('getWidgetPosition', () => {
    it('should return widget position', () => {
      const position = getWidgetPosition(parentElement as HTMLElement);
      expect(position).toEqual({ heightPx: 200, leftPx: 40, topPx: 20, widthPx: 100 });
    });

    it('should trigger error without specific styles', () => {
      const position = getWidgetPosition(pureElement as HTMLElement);
      expect(position).toEqual({ heightPx: 0, leftPx: 0, topPx: 0, widthPx: 0 });
    });
  });

  describe('calculateAllParentWidgetOffset', () => {
    it('should return the calculated offset for the children element', () => {
      const matrix = calculateAllParentWidgetOffset(childrenElement as HTMLElement);
      expect(matrix).toEqual({ leftPx: 40, topPx: 20 });
    });

    it('should return the 0 offset for the parent element', () => {
      const parentElementMatrix = calculateAllParentWidgetOffset(parentElement as HTMLElement);
      const pureElementMatrix = calculateAllParentWidgetOffset(pureElement as HTMLElement);
      expect(parentElementMatrix).toEqual({ leftPx: 0, topPx: 0 });
      expect(pureElementMatrix).toEqual({ leftPx: 0, topPx: 0 });
    });
  });
});
