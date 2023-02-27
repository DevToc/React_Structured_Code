import { ReactElement } from 'react';
import {
  AccessibilityCheckers,
  AllCheckerComponentType,
  AllCheckerState,
} from 'modules/Editor/components/AccessibilityManager/AccessibilityManager.types';
import {
  GroupCheckerType,
  ResultContainerProps,
} from 'modules/Editor/components/AccessibilityManager/AccessibilityChecker/ResultContainer/ResultContainer.types';
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

/**
 * Group and sort the checkers into sepecific group
 * The UI order requirement reference: https://www.figma.com/file/56CrF8qFl6ltt61LH7sqr3/Accessibility-Checker?node-id=2819%3A61767
 *
 * @param checkers - list of checker
 * @param props
 * @returns
 */
const getGroupCheckers = (
  checkers: Record<string, AllCheckerState>,
  { thumbnailsRefs }: Partial<ResultContainerProps>,
) => {
  const autoCheckerGroup: GroupCheckerType = [
    {
      type: AccessibilityCheckers.colorContrast,
      props: {
        thumbnailsRefs,
      },
    },
    {
      type: AccessibilityCheckers.textSize,
    },
  ];
  const manualReviewGroup: GroupCheckerType = [
    {
      type: AccessibilityCheckers.alternativeText,
    },
    {
      type: AccessibilityCheckers.logicalReadingOrder,
    },
    {
      type: AccessibilityCheckers.headings,
    },
    {
      type: AccessibilityCheckers.useOfColor,
    },
    {
      type: AccessibilityCheckers.imageTexts,
    },
  ];
  const documentSettingGroup: GroupCheckerType = [
    {
      type: AccessibilityCheckers.documentTitle,
    },
    {
      type: AccessibilityCheckers.documentLanguage,
    },
  ];

  const linkChecker = {
    type: AccessibilityCheckers.links,
  };
  const tableChecker = {
    type: AccessibilityCheckers.tables,
  };

  [linkChecker, tableChecker].forEach((checker) => {
    const { requireManualCheck } = checkers[checker.type];
    requireManualCheck ? manualReviewGroup.push(checker) : autoCheckerGroup.push(checker);
  });

  autoCheckerGroup.sort(
    (checker1, checker2) =>
      Number(checkers[checker1.type].isMarkAsResolved) - Number(checkers[checker2.type].isMarkAsResolved),
  );

  return {
    autoCheckerGroup,
    manualReviewGroup,
    documentSettingGroup,
  };
};

/**
 * A checker factory component uses to create checker component dynamically
 *
 * @param checker - Checker type
 * @param props - Checker props
 * @returns
 */
const createCheckerComponent = <S extends string, T extends unknown>(
  checker: string,
  props?: AllCheckerComponentType<S, T>,
): ReactElement | undefined => {
  switch (checker) {
    case AccessibilityCheckers.alternativeText:
      return <AlternativeTextChecker key={checker} {...props} />;
    case AccessibilityCheckers.colorContrast:
      return <ColorContrastChecker key={checker} {...props} />;
    case AccessibilityCheckers.documentLanguage:
      return <DocumentLanguageChecker key={checker} {...props} />;
    case AccessibilityCheckers.documentTitle:
      return <DocumentTitleChecker key={checker} {...props} />;
    case AccessibilityCheckers.headings:
      return <HeadingChecker key={checker} {...props} />;
    case AccessibilityCheckers.imageTexts:
      return <ImageTextChecker key={checker} {...props} />;
    case AccessibilityCheckers.links:
      return <LinkChecker key={checker} {...props} />;
    case AccessibilityCheckers.logicalReadingOrder:
      return <LogicalOrderChecker key={checker} {...props} />;
    case AccessibilityCheckers.tables:
      return <TableChecker key={checker} {...props} />;
    case AccessibilityCheckers.textSize:
      return <TextSizeChecker key={checker} {...props} />;
    case AccessibilityCheckers.useOfColor:
      return <UseOfColorChecker key={checker} {...props} />;
    default:
      break;
  }
};

/**
 * Returns first matching index value of checker that is not marked as resolved.
 * Returns -1 if there aren't any unresolved marks.
 * The index value is based on the order of each checker in accordion.
 *
 * @param checkers - Accessibility Checker state
 * @returns
 */
const getDefaultIndex = (checkers: Record<string, AllCheckerState>, checkerList: GroupCheckerType) => {
  return checkerList.findIndex(({ type }) => {
    const { isMarkAsResolved } = checkers[type];
    return !isMarkAsResolved;
  });
};

export { createCheckerComponent, getGroupCheckers, getDefaultIndex };
