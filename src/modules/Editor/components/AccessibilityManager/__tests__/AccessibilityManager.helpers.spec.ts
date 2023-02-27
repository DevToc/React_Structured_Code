import { WidgetType } from '../../../../../types/widget.types';
import { AllWidgetData } from '../../../../../widgets/Widget.types';
import { TextWidgetData } from '../../../../../widgets/TextBasedWidgets/TextWidget/TextWidget.types';
import { TextWidgetTag } from '../../../../../widgets/TextBasedWidgets/common/TextBasedWidgets.types';
import { IconWidgetData } from '../../../../../widgets/IconWidget/IconWidget.types';
import { TreeNode } from '../../../../../types/structuredContentTypes';
import { ArrowStyleTypes, LineWidgetData, LineWidgetTypes } from '../../../../../widgets/LineWidget/LineWidget.types';
import { LineWidgetArrowType, DEFAULT_LABEL } from '../AccessibilityManager.config';
import { generateWidgetId } from '../../../../../widgets/Widget.helpers';
import {
  getIconType,
  getLabel,
  getLeafNodes,
  getTag,
  isTaggedTypesChanged,
  reOrderStructureTree,
  WIDGET_TYPES_FOR_TAG,
} from '../AccessibilityManager.helpers';
import { generateDefaultData as generateIconDefaultData } from '../../../../../widgets/IconWidget/IconWidget.helpers';
import { generateDefaultData as generateTextDefaultData } from '../../../../../widgets/TextBasedWidgets/TextWidget/TextWidget.helpers';
import { generateDefaultData as generateLineDefaultData } from '../../../../../widgets/LineWidget/LineWidget.helpers';
import { generateDefaultData as generateShapeDefaultData } from '../../../../../widgets/BasicShapeWidget/BasicShapeWidget.helpers';
import { generateDefaultData as generateImageDefaultData } from '../../../../../widgets/ImageWidget/ImageWidget.helpers';
import { generateDefaultData as generateTableDefaultData } from '../../../../../widgets/TextBasedWidgets/TableWidget/TableWidget.helpers';
import { mockIds, mockStructureTree, nestedMockStructureTree } from './mockData';
import cloneDeep from 'lodash.clonedeep';
import { AccessibilityCheckers, NonTextWidgetTag } from '../AccessibilityManager.types';
import { BasicShapeType, BasicShapeWidgetData } from '../../../../../widgets/BasicShapeWidget/BasicShapeWidget.types';
import { ImageWidgetData } from '../../../../../widgets/ImageWidget/ImageWidget.types';
import { TableWidgetData } from '../../../../../widgets/TextBasedWidgets/TableWidget/TableWidget.types';

describe('AccessibilityManager/AccessibilityManager.helpers', () => {
  describe('getIconType', () => {
    it('should return BasicShape icon type', () => {
      const widgetId = generateWidgetId(WidgetType.BasicShape);
      const mockShapeData = {} as AllWidgetData;

      // Expect basic shape widget icon
      expect(getIconType(widgetId, mockShapeData)).toEqual(WidgetType.BasicShape);
    });

    it('should return IconWidget icon type', () => {
      const widgetId = generateWidgetId(WidgetType.Icon);
      const mockIconData = {} as IconWidgetData;

      // Expect icon widget icon
      expect(getIconType(widgetId, mockIconData)).toEqual(WidgetType.Icon);
    });

    it('should return LineWidget icon type', () => {
      const widgetId = generateWidgetId(WidgetType.Line);
      const mockLineData = generateLineDefaultData(LineWidgetTypes.straight).widgetData as LineWidgetData;

      // Expect normal line icon
      expect(getIconType(widgetId, mockLineData)).toEqual(WidgetType.Line);

      mockLineData.startArrowStyle = ArrowStyleTypes.long;
      // Expect arrow line icon
      expect(getIconType(widgetId, mockLineData)).toEqual(LineWidgetArrowType.arrow);
    });

    it('should return ImageWidget icon type', () => {
      const widgetId = generateWidgetId(WidgetType.Image);
      const mockTextData = {} as AllWidgetData;

      // Expect normal line icon
      expect(getIconType(widgetId, mockTextData)).toEqual(WidgetType.Image);
    });

    it('should return TextWidget icon type', () => {
      const widgetId = generateWidgetId(WidgetType.Text);
      const mockTextData = {} as AllWidgetData;

      // Expect normal line icon
      expect(getIconType(widgetId, mockTextData)).toEqual(WidgetType.Text);
    });
  });

  describe('getLabel', () => {
    it('should return BasicShape label', () => {
      const widgetId = generateWidgetId(WidgetType.BasicShape);
      const mockShapeData = {} as AllWidgetData;

      // Expect label starts with default type text
      expect(getLabel(widgetId, mockShapeData)?.startsWith('Shape:')).toBeTruthy();
    });

    it('should return IconWidget label', () => {
      const widgetId = generateWidgetId(WidgetType.Icon);
      const mockIconData = generateIconDefaultData('icon-1').widgetData as IconWidgetData;

      // Expect label starts with default type text
      expect(getLabel(widgetId, mockIconData)?.startsWith('Icon:')).toBeTruthy();
    });

    it('should return LineWidget label', () => {
      const widgetId = generateWidgetId(WidgetType.Line);
      const mockLineData = generateLineDefaultData('straight').widgetData as LineWidgetData;

      // Expect line label
      expect(getLabel(widgetId, mockLineData)?.startsWith('Line:')).toBeTruthy();

      mockLineData.startArrowStyle = ArrowStyleTypes.long;
      // Expect arrow label
      expect(getLabel(widgetId, mockLineData)?.startsWith('Arrow:')).toBeTruthy();
    });

    it('should return ImageWidget label', () => {
      const widgetId = generateWidgetId(WidgetType.Image);
      const mockImageData = {} as AllWidgetData;

      // Expect label with default text
      expect(getLabel(widgetId, mockImageData)).toEqual(`Image: ${DEFAULT_LABEL}`);
    });

    it('should return TextWidget label', () => {
      const widgetId = generateWidgetId(WidgetType.Text);
      const text = 'Hello world';
      const mockTextData = generateTextDefaultData('paragraph', text).widgetData as TextWidgetData;

      // Expect label with text content
      expect(getLabel(widgetId, mockTextData)).toEqual(`Text: ${text}`);
    });
  });

  describe('getLeafNodes', () => {
    it('should return a list of widget ids from structure tree data, one level depth recursive)', () => {
      expect(getLeafNodes(mockStructureTree)).toEqual(mockIds);
    });

    it('should return a list of widget ids from structure tree data, multi level depth recursive', () => {
      expect(getLeafNodes(nestedMockStructureTree)).toEqual(mockIds);
    });

    it('should return empty list for invalid structure tree', () => {
      const mockInvalidStructureTree = ['div', {}, ['div']] as TreeNode[];

      expect(getLeafNodes(mockInvalidStructureTree)).toEqual([]);
    });
  });

  describe('reOrderStructureTree', () => {
    it('should insert source node after target node', () => {
      const expectedStructureTree = cloneDeep(mockStructureTree);
      const [, , childNode] = expectedStructureTree;
      const sourceNodeId = mockIds[0];
      const targetNodeId = mockIds[1];

      // expect swap
      childNode.splice(1, 0, childNode.splice(0, 1)[0]);
      expect(reOrderStructureTree(mockStructureTree, sourceNodeId, targetNodeId, false)).toEqual(expectedStructureTree);
    });

    it('should insert source node before target node', () => {
      const expectedStructureTree = cloneDeep(mockStructureTree);
      const [, , childNode] = expectedStructureTree;
      const sourceNodeId = mockIds[1];
      const targetNodeId = mockIds[0];

      // expect swap
      childNode.splice(1, 0, childNode.splice(0, 1)[0]);
      expect(reOrderStructureTree(mockStructureTree, sourceNodeId, targetNodeId)).toEqual(expectedStructureTree);
    });

    it('should return undefined if source or target node not found in structure tree', () => {
      const structureTree = cloneDeep(mockStructureTree);
      const sourceNodeId = 'notFoundFakeId';
      const targetNodeId = mockIds[0];

      expect(reOrderStructureTree(structureTree, sourceNodeId, targetNodeId)).toBeUndefined();
    });
  });

  describe('getTag', () => {
    it('should return corresponding text tag to text type', () => {
      const text = 'Hello world';
      const mockParagraphTextData = generateTextDefaultData(TextWidgetTag.Paragraph, text).widgetData as TextWidgetData;
      const mockTitleTextData = generateTextDefaultData(TextWidgetTag.Title, text).widgetData as TextWidgetData;
      const mockH1TextData = generateTextDefaultData(TextWidgetTag.H1, text).widgetData as TextWidgetData;

      expect(
        getTag(
          WidgetType.Text,
          mockParagraphTextData.textTag,
          mockParagraphTextData.isDecorative,
          mockParagraphTextData.altText,
        ),
      ).toBe(TextWidgetTag.Paragraph);
      expect(
        getTag(WidgetType.Text, mockTitleTextData.textTag, mockTitleTextData.isDecorative, mockTitleTextData.altText),
      ).toBe(TextWidgetTag.Title);
      expect(getTag(WidgetType.Text, mockH1TextData.textTag, mockH1TextData.isDecorative, mockH1TextData.altText)).toBe(
        TextWidgetTag.H1,
      );
    });

    it('should return `Decorative` tags to icon widget by default', () => {
      const iconId = generateWidgetId(WidgetType.Icon);
      const mockIconData = generateIconDefaultData(iconId).widgetData as IconWidgetData;

      expect(getTag(WidgetType.Icon, mockIconData.textTag, mockIconData.isDecorative, mockIconData.altText)).toBe(
        NonTextWidgetTag.Decorative,
      );
    });

    it('should return `MissingAlt` tags to image and line widget by default', () => {
      const DEFAULT_DIMENSION = { width: 10, height: 10 };
      const mockLineData = generateLineDefaultData('straight').widgetData as LineWidgetData;
      const mockImageData = generateImageDefaultData('src', DEFAULT_DIMENSION, DEFAULT_DIMENSION)
        .widgetData as ImageWidgetData;

      expect(getTag(WidgetType.Line, mockLineData.textTag, mockLineData.isDecorative, mockLineData.altText)).toBe(
        NonTextWidgetTag.MissingAlt,
      );
      expect(getTag(WidgetType.Image, mockImageData.textTag, mockImageData.isDecorative, mockImageData.altText)).toBe(
        NonTextWidgetTag.MissingAlt,
      );
    });

    it('should return `Alt` tags if non text widget has alt text', () => {
      const DEFAULT_DIMENSION = { width: 10, height: 10 };
      const mockImageData = generateImageDefaultData('src', DEFAULT_DIMENSION, DEFAULT_DIMENSION)
        .widgetData as ImageWidgetData;

      mockImageData.isDecorative = false;
      mockImageData.altText = 'This is cute cat';

      expect(getTag(WidgetType.Image, mockImageData.textTag, mockImageData.isDecorative, mockImageData.altText)).toBe(
        NonTextWidgetTag.Alt,
      );
    });

    it('should return `Decorative` tags to non text widget type where its default is decorative', () => {
      const mockShapeData = generateShapeDefaultData(BasicShapeType.Rectangle).widgetData as BasicShapeWidgetData;

      expect(
        getTag(WidgetType.BasicShape, mockShapeData.textTag, mockShapeData.isDecorative, mockShapeData.altText),
      ).toBe(NonTextWidgetTag.Decorative);
    });

    it('should return null if widget type passed does not match', () => {
      const mockTableData = generateTableDefaultData().widgetData as TableWidgetData;
      expect(getTag(WidgetType.Table, mockTableData.textTag, mockTableData.isDecorative, mockTableData.altText)).toBe(
        null,
      );
    });
  });

  describe('isTaggedTypesChanged', () => {
    it('should return `true` if widget types of 1st parameter and second parameter are different', () => {
      const isTypesDifferent = isTaggedTypesChanged(
        WIDGET_TYPES_FOR_TAG[AccessibilityCheckers.alternativeText],
        WIDGET_TYPES_FOR_TAG[AccessibilityCheckers.headings],
      );

      expect(isTypesDifferent).toBeTruthy();
    });

    it('should return `false` if widget types of 1st parameter and second parameter are the same', () => {
      const isTypesDifferent = isTaggedTypesChanged(
        WIDGET_TYPES_FOR_TAG[AccessibilityCheckers.alternativeText],
        WIDGET_TYPES_FOR_TAG[AccessibilityCheckers.alternativeText],
      );

      expect(isTypesDifferent).toBeFalsy();
    });
  });
});
