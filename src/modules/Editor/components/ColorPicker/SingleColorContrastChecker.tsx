import { useState, useCallback, useMemo, useEffect } from 'react';
import { Flex, Spacer, Box, Text, List, ListItem, Link } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import styled from '@emotion/styled';

import { PAGE_CONTAINER_CLASSNAME } from '../../Editor.config';
import { Toggletip } from '../../../common/components/Toggletip';
import { SingleColorContrastCheckerProps } from '../../../common/components/ColorPicker/ColorPicker.types';
import { useColorContrastChecker } from '../../../../hooks/useColorContrastChecker';
import { selectWidget, selectInfographSize } from '../../store/infographSelector';
import { useAppSelector } from '../../store/hooks';
import { selectActiveWidgets } from '../../store/widgetSelector';
import { selectActivePage } from '../../store/pageSelector';
import { useDebouncedCallback } from '../../../../hooks/useDebounce';
import { WidgetType } from '../../../../types/widget.types';
import { Config } from '../../../../hooks/useColorContrastChecker/useColorContrastChecker.types';
import { TextWidgetData } from '../../../../widgets/TextBasedWidgets/TextWidget/TextWidget.types';
import {
  getFirstCharacterTextMarks,
  getFontStyleFromTextMarks,
} from '../../../../widgets/TextBasedWidgets/TextWidget/TextWidget.helpers';
import { getWidgetTypeFromId } from '../../../../widgets/Widget.helpers';
import { ScoreBadge } from './ScoreBadge';

import { ReactComponent as OutlineInfoIcon } from '../../../../assets/icons/outline_info.svg';
import { ReactComponent as StatusFailIcon } from '../../../../assets/icons/status_fail.svg';
import { ReactComponent as StatusPassIcon } from '../../../../assets/icons/status_pass.svg';
import { selectZoom } from '../../store/selectEditorSettings';
import { COLOR_CONTRAST_HELP_LINK } from '../../../../constants/links';
import { Mixpanel } from '../../../../libs/third-party/Mixpanel/mixpanel';
import { CHECKER_LABELS, COLOR_MENU, HELP_OPENED } from '../../../../constants/mixpanel';
import { AccessibilityCheckers } from '../AccessibilityManager/AccessibilityManager.types';

const StyledStatusFailIcon = styled(StatusFailIcon)`
  width: var(--vg-sizes-3);
  height: var(--vg-sizes-3);
`;

const StyledStatusPassIcon = styled(StatusPassIcon)`
  width: var(--vg-sizes-3);
  height: var(--vg-sizes-3);
`;

export const SingleColorContrastChecker = ({ color, textStyle, targetRect }: SingleColorContrastCheckerProps) => {
  const { t } = useTranslation('editor_color_picker', { useSuspense: false });
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const activeWidgets = useAppSelector(selectActiveWidgets);
  const isSingleWidget = useMemo(() => activeWidgets.length === 1, [activeWidgets]);
  const isResponsiveMember = useMemo(
    () => isSingleWidget && activeWidgets[0].responsiveGroupId,
    [isSingleWidget, activeWidgets],
  );
  const selectedSingleWidget = useAppSelector(selectWidget(isSingleWidget ? activeWidgets[0].id : ''));
  const activePageId = useAppSelector(selectActivePage);
  const pageSize = useAppSelector(selectInfographSize);
  const zoom = useAppSelector(selectZoom);
  const [score, calculateScore, setOptions, resetScore] = useColorContrastChecker();

  const colorRatio = useMemo(() => (score.length > 0 ? score?.[0]?.ratio : null), [score]);
  const colorScore = useMemo(() => (score.length > 0 ? score?.[0]?.score : null), [score]);
  const isAAA = useMemo(() => !!colorScore && colorScore.indexOf('AAA') === 0, [colorScore]);
  const isAA = useMemo(() => isAAA || (!!colorScore && colorScore.indexOf('AA') === 0), [colorScore, isAAA]);
  const hasScore = useMemo(() => !isLoading && score.length, [isLoading, score]);
  const widgetType = useMemo(() => activeWidgets[0]?.id && getWidgetTypeFromId(activeWidgets[0].id), [activeWidgets]);
  const isText = [WidgetType.Text, WidgetType.Table].includes(widgetType as WidgetType);
  const isLargeText = useMemo(() => colorScore && colorScore.indexOf('Large') > 0, [colorScore]);
  const label = useMemo(
    () => (isText ? (isLargeText ? 'Large Text' : 'Normal Text') : 'Graphics'),
    [isText, isLargeText],
  );

  const handleScan = useCallback(() => {
    if (!isSingleWidget) return;

    let targetPage = document.querySelector(`.${PAGE_CONTAINER_CLASSNAME}`);

    let xPx = selectedSingleWidget.leftPx;
    let yPx = selectedSingleWidget.topPx;

    /**
     * Responsive widget members don't use topPx and leftPx values since
     * they are positioned relative to a parent in a specific layout
     */
    if (isResponsiveMember) {
      const singleWidgetEl = document.getElementById(activeWidgets[0].id);
      if (singleWidgetEl && targetPage) {
        const bb = singleWidgetEl.getBoundingClientRect();
        const targetPageRect = targetPage.getBoundingClientRect();

        xPx = Number(bb.x) - Number(targetPageRect.x);
        yPx = Number(bb.y) - Number(targetPageRect.y);
      }
    }

    let options = {
      pageId: activePageId,
      widgetId: activeWidgets[0].id,
      targetPage,
      targetColor: color,
      targetRect: {
        xPx,
        yPx,
        widthPx: selectedSingleWidget.widthPx,
        heightPx: selectedSingleWidget.heightPx,
      },
      pageWidthPx: pageSize.widthPx * zoom,
      pageHeightPx: pageSize.heightPx * zoom,
    } as Config;

    switch (widgetType) {
      case WidgetType.Text: {
        const widgetData = selectedSingleWidget as TextWidgetData;
        const textMarks = getFirstCharacterTextMarks(widgetData?.proseMirrorData);

        if (!textMarks) return;

        const { fontSize, isBold } = getFontStyleFromTextMarks(textMarks);

        Object.assign(options, {
          targetFontSize: fontSize,
          targetFontWeight: isBold ? 'bold' : undefined,
        });

        break;
      }

      // TODO: update checker to support multi cells
      case WidgetType.Table: {
        if (!targetRect || !targetPage) return;
        const targetPageRect = targetPage.getBoundingClientRect();

        Object.assign(options, {
          targetFontSize: textStyle?.fontSize,
          targetFontWeight: textStyle?.fontWeight,
          targetRect: {
            xPx: Number(targetRect.x) - Number(targetPageRect.x),
            yPx: Number(targetRect.y) - Number(targetPageRect.y),
            widthPx: Number(targetRect.width),
            heightPx: Number(targetRect.height),
          },
          enabledFilter: false,
          enabledTextFilter: true,
        });

        break;
      }

      default:
        break;
    }

    setOptions(options);

    if (!calculateScore) return;
    calculateScore();

    setIsLoading(false);
  }, [
    color,
    activePageId,
    activeWidgets,
    isSingleWidget,
    pageSize,
    zoom,
    targetRect,
    textStyle,
    selectedSingleWidget,
    widgetType,
    calculateScore,
    setOptions,
    isResponsiveMember,
  ]);

  const debounceHandleScan = useDebouncedCallback(handleScan, 200);

  useEffect(() => {
    setIsLoading(true);
    resetScore();

    debounceHandleScan();
  }, [color, resetScore, debounceHandleScan]);

  const handleClickHelpLink = () => {
    Mixpanel.track(HELP_OPENED, {
      from: COLOR_MENU,
      help_type: CHECKER_LABELS[AccessibilityCheckers.colorContrast],
    });
  };

  return (
    <Box h='54px'>
      <Flex flexDirection='row'>
        <Flex alignItems='center' fontWeight='medium' fontSize='sm' mr='1'>
          {'Contrast Ratio'}
        </Flex>
        <Toggletip
          placement={'bottom'}
          buttonAriaLabel={'Contrast Ratio Tooltip'}
          hasArrow
          icon={<OutlineInfoIcon color={'var(--vg-colors-upgrade-500)'} />}
          testLabel={'decorative-toggletip-button'}
        >
          <Box>
            <Text fontSize='xs' textAlign='left'>
              {t('contrastRatio.description')}
            </Text>

            <List styleType='disc' mx='5' my='1'>
              <ListItem>
                <Text fontSize='xs' textAlign='left'>
                  {t('contrastRatio.list1')}
                </Text>
              </ListItem>
              <ListItem>
                <Text fontSize='xs' textAlign='left'>
                  {t('contrastRatio.list2')}
                </Text>
              </ListItem>
              <ListItem>
                <Text fontSize='xs' textAlign='left'>
                  {t('contrastRatio.list3')}
                </Text>
              </ListItem>
            </List>

            <Link
              variant={'inline-dark'}
              display='block'
              w={'full'}
              href={COLOR_CONTRAST_HELP_LINK}
              isExternal
              onClick={handleClickHelpLink}
            >
              <Text fontSize='xs' textAlign='left'>
                {t('contrastRatio.link')}
              </Text>
            </Link>
          </Box>
        </Toggletip>

        <Spacer></Spacer>

        {hasScore ? (
          <Flex fontWeight='medium' fontSize='sm' mr='2' alignItems='center'>
            {`${colorRatio}:1`}
          </Flex>
        ) : null}
      </Flex>
      <Flex flexDirection='row' mt='2'>
        {hasScore ? (
          <Flex alignItems='center'>
            <Text fontWeight='medium' fontSize='xs'>
              {label}
            </Text>
          </Flex>
        ) : null}

        <Spacer></Spacer>

        {hasScore ? (
          <ScoreBadge isChecked={isAA}>
            {isAA ? <StyledStatusPassIcon /> : <StyledStatusFailIcon />}
            <Text ml='1'>AA</Text>
          </ScoreBadge>
        ) : null}

        {hasScore && isText ? (
          <ScoreBadge isChecked={isAAA}>
            {isAAA ? <StyledStatusPassIcon /> : <StyledStatusFailIcon />}
            <Text ml='1'>AAA</Text>
          </ScoreBadge>
        ) : null}
      </Flex>
    </Box>
  );
};
