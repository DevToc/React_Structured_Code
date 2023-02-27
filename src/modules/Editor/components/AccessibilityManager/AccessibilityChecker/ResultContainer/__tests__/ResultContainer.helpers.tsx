import { AlternativeTextChecker } from 'modules/Editor/components/AccessibilityManager/AccessibilityChecker/AlternativeTextChecker';
import { ColorContrastChecker } from 'modules/Editor/components/AccessibilityManager/AccessibilityChecker/ColorContrastChecker';
import { DocumentLanguageChecker } from 'modules/Editor/components/AccessibilityManager/AccessibilityChecker/DocumentLanguageChecker';
import { DocumentTitleChecker } from 'modules/Editor/components/AccessibilityManager/AccessibilityChecker/DocumentTitleChecker';
import { HeadingChecker } from 'modules/Editor/components/AccessibilityManager/AccessibilityChecker/HeadingChecker';
import { ImageTextChecker } from 'modules/Editor/components/AccessibilityManager/AccessibilityChecker/ImageTextChecker';
import { LinkChecker } from 'modules/Editor/components/AccessibilityManager/AccessibilityChecker/LinkChecker';
import { LogicalOrderChecker } from 'modules/Editor/components/AccessibilityManager/AccessibilityChecker/LogicalOrderChecker';
import { TableChecker } from 'modules/Editor/components/AccessibilityManager/AccessibilityChecker/TableChecker';
import { TextSizeChecker } from 'modules/Editor/components/AccessibilityManager/AccessibilityChecker/TextSizeChecker';
import { UseOfColorChecker } from 'modules/Editor/components/AccessibilityManager/AccessibilityChecker/UseOfColorChecker';
import {
  createCheckerComponent,
  getGroupCheckers,
} from 'modules/Editor/components/AccessibilityManager/AccessibilityChecker/ResultContainer/ResultContainer.helpers';
import { initAccessibilitySettingsState } from 'modules/Editor/components/AccessibilityManager/AccessibilityManager.config';
import { AccessibilityCheckers } from 'modules/Editor/components/AccessibilityManager/AccessibilityManager.types';

describe('AccessibilityManager/AccessibilityChecker/ResultContainer/ResultContainer.helpers', () => {
  describe('getGroupCheckers', () => {
    const { checkers } = initAccessibilitySettingsState;
    const props = { thumbnailsRefs: undefined };
    const groupCheckers = getGroupCheckers(checkers, props);

    it('should have 3 default group sections', () => {
      expect(Object.keys(groupCheckers)).toEqual(3);
    });

    it('should have document title and document language checker in last group section', () => {
      const { documentSettingGroup } = groupCheckers;
      expect(documentSettingGroup[0]).toMatchObject({
        type: AccessibilityCheckers.documentTitle,
      });
      expect(documentSettingGroup[1]).toMatchObject({
        type: AccessibilityCheckers.documentLanguage,
      });
    });
  });

  describe('createCheckerComponent', () => {
    it('should create correct checker component base on giving type', () => {
      const Component1 = createCheckerComponent(AccessibilityCheckers.alternativeText);
      expect(Component1).toBeInstanceOf(AlternativeTextChecker);

      const Component2 = createCheckerComponent(AccessibilityCheckers.colorContrast);
      expect(Component2).toBeInstanceOf(ColorContrastChecker);

      const Component3 = createCheckerComponent(AccessibilityCheckers.documentLanguage);
      expect(Component3).toBeInstanceOf(DocumentLanguageChecker);

      const Component4 = createCheckerComponent(AccessibilityCheckers.documentTitle);
      expect(Component4).toBeInstanceOf(DocumentTitleChecker);

      const Component5 = createCheckerComponent(AccessibilityCheckers.headings);
      expect(Component5).toBeInstanceOf(HeadingChecker);

      const Component6 = createCheckerComponent(AccessibilityCheckers.imageTexts);
      expect(Component6).toBeInstanceOf(ImageTextChecker);

      const Component7 = createCheckerComponent(AccessibilityCheckers.links);
      expect(Component7).toBeInstanceOf(LinkChecker);

      const Component8 = createCheckerComponent(AccessibilityCheckers.logicalReadingOrder);
      expect(Component8).toBeInstanceOf(LogicalOrderChecker);

      const Component9 = createCheckerComponent(AccessibilityCheckers.tables);
      expect(Component9).toBeInstanceOf(TableChecker);

      const Component10 = createCheckerComponent(AccessibilityCheckers.textSize);
      expect(Component10).toBeInstanceOf(TextSizeChecker);

      const Component11 = createCheckerComponent(AccessibilityCheckers.useOfColor);
      expect(Component11).toBeInstanceOf(UseOfColorChecker);
    });
  });
});
