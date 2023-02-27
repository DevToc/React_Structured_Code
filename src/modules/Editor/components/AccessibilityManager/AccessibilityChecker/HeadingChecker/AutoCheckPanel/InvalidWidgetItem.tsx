import { Flex, Text } from '@chakra-ui/react';
import { memo, ReactElement, useCallback, useEffect } from 'react';
import { PageId, WidgetId } from '../../../../../../../types/idTypes';
import { useAppSelector } from '../../../../../store';
import { selectWidget } from '../../../../../store/infographSelector';
import { selectIsActiveWidgetByGroup } from '../../../../../store/widgetSelector';

import { getTextWidgetLabel } from '../../../AccessibilityManager.helpers';

import { TextWidgetData } from '../../../../../../../widgets/TextBasedWidgets/TextWidget/TextWidget.types';
import { TextWidgetTag } from '../../../../../../../widgets/TextBasedWidgets/common/TextBasedWidgets.types';

import { ReactComponent as TextIcon } from '../../../../../../../assets/icons/a11ymenu_text.svg';
import { InvalidWidgetItemContainer } from '../../common/InvalidWidgetItemContainer';
import { DropdownPopover } from '../../../../../../common/components/ToolbarPopover';
import { Mixpanel } from '../../../../../../../libs/third-party/Mixpanel/mixpanel';
import { ACCESSIBILITY_CHECKER, TEXT_TAG_EDITED } from '../../../../../../../constants/mixpanel';

type SelectionTarget = {
  widgetId: WidgetId;
  pageId: PageId;
};

interface InvalidWidgetItemProps {
  widgetId: WidgetId;
  pageId: PageId;
  dispatchSelectWidget: ({ widgetId, pageId }: SelectionTarget) => void;
  dispatchUpdateWidgetTag: (tag: TextWidgetTag) => void;
  removeInvalidWidgetFromList: (widgetId: WidgetId) => void;
}

export const TEXT_WIDGET_TAG_OPTIONS = [
  { value: TextWidgetTag.Title, label: 'Title' },
  { value: TextWidgetTag.H1, label: 'H1' },
  { value: TextWidgetTag.H2, label: 'H2' },
  { value: TextWidgetTag.H3, label: 'H3' },
  { value: TextWidgetTag.H4, label: 'H4' },
  { value: TextWidgetTag.H5, label: 'H5' },
  { value: TextWidgetTag.H6, label: 'H6' },
  { value: TextWidgetTag.Paragraph, label: 'P' },
];

export const InvalidWidgetItem = memo(
  ({
    widgetId,
    pageId,
    dispatchSelectWidget,
    dispatchUpdateWidgetTag,
    removeInvalidWidgetFromList,
  }: InvalidWidgetItemProps): ReactElement | null => {
    const widget = useAppSelector(selectWidget(widgetId)) as TextWidgetData;

    // Widget is considered active if it is the only widget selected or if it belongs to a responsive group that is selected
    const isActive = useAppSelector(selectIsActiveWidgetByGroup(widgetId));
    const text = widget ? getTextWidgetLabel(widget as TextWidgetData) : '';

    const selectedIndex = TEXT_WIDGET_TAG_OPTIONS.findIndex((opt) => opt.value === widget?.textTag);

    const isWidgetDeleted = !widget;

    // Remove from list if widget was deleted
    useEffect(() => {
      if (isWidgetDeleted) {
        removeInvalidWidgetFromList(widgetId);
      }
    }, [isWidgetDeleted, removeInvalidWidgetFromList, widgetId]);

    /**
     * Selects the given widget
     * Triggered when clicking on a widget item or when opening the alt text modal
     */
    const handleSelectWidget = useCallback(() => {
      dispatchSelectWidget({ widgetId, pageId });
    }, [dispatchSelectWidget, widgetId, pageId]);

    /**
     * Triggered when selecting text tag in dropdown
     * Will dispatch widget update
     */
    const handleSelectTag = useCallback(
      (textTag: TextWidgetTag) => {
        dispatchUpdateWidgetTag(textTag);

        const selectedTagIndex = TEXT_WIDGET_TAG_OPTIONS.findIndex((opt) => opt.value === textTag);
        Mixpanel.track(TEXT_TAG_EDITED, {
          from: ACCESSIBILITY_CHECKER,
          text_tag: TEXT_WIDGET_TAG_OPTIONS[selectedTagIndex].label,
        });
      },
      [dispatchUpdateWidgetTag],
    );

    if (!widget) {
      return null;
    }

    return (
      <InvalidWidgetItemContainer isActive={isActive} onClick={handleSelectWidget}>
        <Flex alignItems={'center'} w={'70%'}>
          <TextIcon stroke={isActive ? 'var(--vg-colors-upgrade-blue-700)' : 'var(--vg-colors-gray-800)'} />
          <Text
            fontSize={'xs'}
            ml={2}
            fontWeight={500}
            overflow={'hidden'}
            textOverflow={'ellipsis'}
            w={'80%'}
            whiteSpace={'nowrap'}
          >
            {text}
          </Text>
        </Flex>
        <Flex justifyContent={'flex-end'} flexBasis={'100%'}>
          <DropdownPopover
            options={TEXT_WIDGET_TAG_OPTIONS}
            selectedIndex={selectedIndex}
            label={''}
            showSelectedIcon={true}
            onSelect={handleSelectTag}
            w={'5rem'}
            placement={'bottom'}
            buttonVariant={'a11ymenu-outline'}
          />
        </Flex>
      </InvalidWidgetItemContainer>
    );
  },
);
