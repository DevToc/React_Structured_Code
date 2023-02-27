import { JSONContent, Mark } from '@tiptap/core';
import { getMarksOfType, checkTextSize } from '../TextSizeChecker.helpers';
import {
  generatePageData,
  invalidTextSizeData,
  missingContentData,
  missingMarksData,
  PageWidgetMapping,
  paragraphData,
  titleData,
  invalidTableTextSizeData,
} from './mockData';

describe('AccessibilityManager/AccessibilityChecker/TextSizeChecker/TextSizeChecker.helpers', () => {
  const noEmptyTextNodeFilter = (node: JSONContent) => node.type === 'text' && !!node.text?.length;

  describe('getMarksOfType', () => {
    it('should return all the textStyle marks in the basic title data', () => {
      const type = 'textStyle';
      const expectedData = [
        {
          attrs: {
            color: '#2B2B35',
            fontFamily: 'Inter',
            fontSize: '40px',
          },
          type: 'textStyle',
        },
      ] as JSONContent;

      const result = getMarksOfType(type, titleData.proseMirrorData);
      expect(result).toEqual(expectedData);
    });

    it('should return all the textStyle in none empty text node', () => {
      const type = 'textStyle';
      const expectedData = [
        {
          attrs: {
            color: '#2B2B35',
            fontFamily: 'Inter',
            fontSize: '40px',
          },
          type: 'textStyle',
        },
      ] as JSONContent;

      const result = getMarksOfType(type, titleData.proseMirrorData);
      expect(result).toEqual(expectedData);

      const result1 = getMarksOfType(type, titleData.proseMirrorData, [], (_) => true);
      expect(result1).toEqual(expectedData);

      const result2 = getMarksOfType(type, titleData.proseMirrorData, [], noEmptyTextNodeFilter);
      expect(result2).toEqual(expectedData);
    });

    it('should return all the bold marks in the basic title data', () => {
      const type = 'bold';
      const expectedData = [
        {
          type: 'bold',
        },
      ] as Mark[];

      const result = getMarksOfType(type, titleData.proseMirrorData);
      expect(result).toEqual(expectedData);

      const result1 = getMarksOfType(type, titleData.proseMirrorData, [], noEmptyTextNodeFilter);
      expect(result1).toEqual(expectedData);
    });

    it('should return an empty array if specified mark does not exist', () => {
      const type = 'bold';
      const expectedData = [] as Mark[];

      const result = getMarksOfType(type, paragraphData.proseMirrorData);
      expect(result).toEqual(expectedData);

      const result1 = getMarksOfType(type, paragraphData.proseMirrorData, [], noEmptyTextNodeFilter);
      expect(result1).toEqual(expectedData);
    });

    it('should return an empty array if the text nodes are missing marks data', () => {
      const type = 'bold';
      const expectedData = [] as Mark[];

      const result = getMarksOfType(type, missingMarksData.proseMirrorData);
      expect(result).toEqual(expectedData);

      const result1 = getMarksOfType(type, paragraphData.proseMirrorData, [], noEmptyTextNodeFilter);
      expect(result1).toEqual(expectedData);
    });

    it('should return an empty array if the text nodes are missing content data', () => {
      const type = 'bold';
      const expectedData = [] as Mark[];

      const result = getMarksOfType(type, missingContentData.proseMirrorData);
      expect(result).toEqual(expectedData);

      const result1 = getMarksOfType(type, paragraphData.proseMirrorData, [], noEmptyTextNodeFilter);
      expect(result1).toEqual(expectedData);
    });
  });

  describe('checkTextSize', () => {
    it('should return an empty array if no widget has a text size smaller than 16px', () => {
      const page = generatePageData(titleData);
      const expectedData: PageWidgetMapping = [];

      const result = checkTextSize(page);
      expect(result).toEqual(expectedData);
    });

    it('should return an array of table widget if table widget has a cell size smaller than 16px', () => {
      const page = generatePageData(invalidTableTextSizeData);
      const result = checkTextSize(page);
      expect(result.length).toEqual(1);
    });

    it('should return a list of pageWidgetMappings for all widgets with text size smaller than 16px', () => {
      const pageToWidgetsMap = generatePageData(invalidTextSizeData);
      const pageId = Object.keys(pageToWidgetsMap)[0];
      const widgetId = pageToWidgetsMap[pageId][0].widgetId;
      const expectedData: PageWidgetMapping = [{ pageId, widgetId }];

      const result = checkTextSize(pageToWidgetsMap);
      expect(result).toEqual(expectedData);
    });

    it('should return an empty array if the text nodes are missing marks data', () => {
      const pageToWidgetsMap = generatePageData(missingMarksData);
      const expectedData: PageWidgetMapping = [];

      const result = checkTextSize(pageToWidgetsMap);
      expect(result).toEqual(expectedData);
    });
  });
});
