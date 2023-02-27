import { useCallback } from 'react';
import { detectLanguage } from 'libs/google-translator';
import { useAppDispatch, useAppSelector } from 'modules/Editor/store';
import { selectLanguageUpdatedOnce } from 'modules/Editor/store/editorSettingsSelector';
import {
  selectLanguage,
  selectPageToWidgetMap,
  selectPageToWidgetMapByReadingOrder,
  selectWidgets,
} from 'modules/Editor/store/infographSelector';
import { AccessibilityCheckers, AllCheckerState } from '../../../AccessibilityManager.types';
import { checkAltText } from '../../AlternativeTextChecker/AlternativeTextChecker.helpers';
import { updateChecker } from '../../checker.actions';
import { useAccessibilityChecker } from '../../checker.hooks';
import { checkHeadingOrder } from '../../HeadingChecker/HeadingChecker.helpers';
import { checkLinks } from '../../LinkChecker/LinkChecker.helper';
import { checkTableHeading } from '../../TableChecker/TableChecker.helpers';
import { checkTextSize } from '../../TextSizeChecker/TextSizeChecker.helpers';
import { useScanColorContrast } from './useScanColorContrast';
import { getDocumentTextContent } from 'modules/Editor/components/AccessibilityManager/AccessibilityChecker/DocumentLanguageChecker/DocumentLanguageChecker.helpers';
import { setLanguage } from 'modules/Editor/store/infographSlice';
import { LANGUAGES } from 'constants/language';

/**
 * Hook to perform automatic checks on the document
 *
 * @returns { scanDocument }
 */
export const useScanDocument = (thumbnailRefs?: Array<HTMLDivElement | null>) => {
  const appDispatch = useAppDispatch();
  const { dispatch } = useAccessibilityChecker();
  const pageToWidgetMap = useAppSelector(selectPageToWidgetMap);
  const readingOrderWidgetMap = useAppSelector(selectPageToWidgetMapByReadingOrder);
  const allWidgets = useAppSelector(selectWidgets);
  const currentLanguage = useAppSelector(selectLanguage);
  const languageUpdatedOnce = useAppSelector(selectLanguageUpdatedOnce);

  const { scanColorContrast } = useScanColorContrast(thumbnailRefs);

  /**
   * Perform alternative text check
   */
  const scanAltText = useCallback(() => {
    const invalidAltTextWidgets = checkAltText(pageToWidgetMap);
    dispatch(
      updateChecker<AllCheckerState>(AccessibilityCheckers.alternativeText, { invalidWidgets: invalidAltTextWidgets }),
    );
  }, [pageToWidgetMap, dispatch]);

  /**
   * Perform links check
   */
  const scanLinks = useCallback(() => {
    const invalidLinks = checkLinks(pageToWidgetMap);

    dispatch(
      updateChecker<AllCheckerState>(AccessibilityCheckers.links, {
        isMarkAsResolved: !invalidLinks.length,
        requireManualCheck: invalidLinks?.length > 0,
        invalidWidgets: invalidLinks,
      }),
    );
  }, [pageToWidgetMap, dispatch]);

  /**
   * Perform text size check
   */
  const scanTextSize = useCallback(() => {
    const invalidTextSizeWidgets = checkTextSize(pageToWidgetMap);
    dispatch(
      updateChecker<AllCheckerState>(AccessibilityCheckers.textSize, {
        isMarkAsResolved: !invalidTextSizeWidgets?.length,
        invalidWidgets: invalidTextSizeWidgets,
      }),
    );
  }, [pageToWidgetMap, dispatch]);

  /**
   * Perform heading order check
   */
  const scanHeadingOrder = useCallback(() => {
    const invalidHeadingOrderWidgets = checkHeadingOrder(readingOrderWidgetMap, allWidgets);
    dispatch(updateChecker(AccessibilityCheckers.headings, { invalidWidgets: invalidHeadingOrderWidgets }));
  }, [readingOrderWidgetMap, allWidgets, dispatch]);

  /**
   * Perform table headers check
   */
  const scanTable = useCallback(() => {
    const invalidTableWidgets = checkTableHeading(readingOrderWidgetMap);
    dispatch(
      updateChecker(AccessibilityCheckers.tables, {
        isMarkAsResolved: !invalidTableWidgets?.length,
        requireManualCheck: invalidTableWidgets?.length > 0,
        invalidWidgets: invalidTableWidgets,
      }),
    );
  }, [readingOrderWidgetMap, dispatch]);

  const scanDocumentLanguage = useCallback(async () => {
    try {
      if (languageUpdatedOnce) return;

      const textContent = getDocumentTextContent(pageToWidgetMap);
      const languageCode = await detectLanguage(textContent);
      const language = LANGUAGES.find((lang) => lang.iso639_1_Code === languageCode);

      if (language && language.iso639_1_Code !== currentLanguage.iso639_1_Code) appDispatch(setLanguage({ language }));
    } catch (error) {
      // Safe to output error as warning
      console.warn(error);
    }
  }, [currentLanguage, languageUpdatedOnce, appDispatch, pageToWidgetMap]);

  /**
   * Performs all automatic checks on the document
   */
  const scanDocument = useCallback(() => {
    scanAltText();
    scanTextSize();
    scanLinks();
    scanHeadingOrder();
    scanColorContrast();
    scanTable();
    scanDocumentLanguage();
  }, [scanAltText, scanTextSize, scanHeadingOrder, scanColorContrast, scanTable, scanLinks, scanDocumentLanguage]);

  return {
    scanDocument,
    scanHeadingOrder,
    scanTable,
    scanDocumentLanguage,
  };
};
