import { Box, Tag, TagLabel } from '@chakra-ui/react';
import styled from '@emotion/styled';

import { AccessibleElement, WidgetType } from 'types/widget.types';
import { TextWidgetData } from 'widgets/TextBasedWidgets/TextWidget/TextWidget.types';
import { TextWidgetTag } from 'widgets/TextBasedWidgets/common/TextBasedWidgets.types';
import { useAppSelector } from 'modules/Editor/store';
import { selectShowTagOverlay } from 'modules/Editor/store/pageSelector';
import { selectTaggedWidgetType } from 'modules/Editor/store/widgetSelector';
import { getTag } from 'modules/Editor/components/AccessibilityManager/AccessibilityManager.helpers';
import { AltTextModalTrigger } from 'modules/Editor/components/AltTextModal/AltTextModalTrigger';
import { NonTextWidgetTag } from 'modules/Editor/components/AccessibilityManager/AccessibilityManager.types';
import { groupIdCache } from 'widgets/sdk/GroupIdCache';
import { getWidgetTypeFromId } from '../Widget.helpers';
import { useWidget } from './useWidget';

import { ReactComponent as TagIcon } from 'assets/icons/tag.svg';
import { ReactComponent as AltTagIcon } from 'assets/icons/a11ymenu_status_ok_transparent.svg';
import { ReactComponent as DecorativeTagIcon } from 'assets/icons/a11ymenu_decorative.svg';
import { ReactComponent as MissingAltTagIcon } from 'assets/icons/a11ymenu_missing_alt.svg';

type AllWidgetTag = TextWidgetTag | NonTextWidgetTag;

/**
 * Tags for non essential widgets e.g., Image, Icon, Shape, Line.
 * These tags will be displayed when `Alternative Text` checker tab is selected and open
 * Also used as a default value for the pre-existing widgets before changes
 */
export const DEFAULT_NON_TEXT_TAGS = [NonTextWidgetTag.MissingAlt, NonTextWidgetTag.Alt, NonTextWidgetTag.Decorative];

const TAGS_TO_LABEL = {
  [TextWidgetTag.Paragraph]: 'P',
  [TextWidgetTag.Title]: 'Title',
  [TextWidgetTag.H1]: 'H1',
  [TextWidgetTag.H2]: 'H2',
  [TextWidgetTag.H3]: 'H3',
  [TextWidgetTag.H4]: 'H4',
  [TextWidgetTag.H5]: 'H5',
  [TextWidgetTag.H6]: 'H6',
  [NonTextWidgetTag.MissingAlt]: 'ALT',
  [NonTextWidgetTag.Alt]: 'ALT',
  [NonTextWidgetTag.Decorative]: 'DECORATIVE',
};

const StyledTagIcon = styled(TagIcon)`
  margin-right: 0.25rem;
  & path {
    stroke: white;
  }
`;

const StyledMissingAltTagIcon = styled(MissingAltTagIcon)`
  margin-right: 0.25rem;
  & path {
    fill: white;
  }
`;

const StyledAltTagIcon = styled(AltTagIcon)`
  margin-right: 0.25rem;
  & path {
    fill: white;
  }
`;

const StyledDecorativeTagIcon = styled(DecorativeTagIcon)`
  margin-right: 0.25rem;
`;

const RenderIcon = ({ tag }: { tag: NonTextWidgetTag }) => {
  switch (tag) {
    case NonTextWidgetTag.MissingAlt:
      return <StyledMissingAltTagIcon width={'1em'} height={'1em'} />;
    case NonTextWidgetTag.Alt:
      return <StyledAltTagIcon width={'1em'} height={'1em'} />;
    case NonTextWidgetTag.Decorative:
      return <StyledDecorativeTagIcon width={'1em'} height={'1em'} />;
  }
};

const ModalTrigger = ({ onClick, tag }: { onClick?: () => void; tag: NonTextWidgetTag }) => {
  const isAltMissing = tag === NonTextWidgetTag.MissingAlt;

  return (
    <Tag
      size={'sm'}
      variant={isAltMissing ? 'missing-alt' : 'nonText-tag'}
      pointerEvents={'auto'}
      maxH={'100%'}
      onClick={onClick}
      data-testid='nonTextTag'
    >
      <RenderIcon tag={tag} />
      <TagLabel>{TAGS_TO_LABEL[tag]}</TagLabel>
    </Tag>
  );
};

/**
 * WIDGET TAG OVERLAY
 *
 * This component renders a border around a widget
 * adds a tag badge on the top left corner
 * Currently only supports, text widget tags
 */
export const WidgetTagOverlay = () => {
  const showTagOverlay = useAppSelector(selectShowTagOverlay);
  const taggedWidgetTypes = useAppSelector(selectTaggedWidgetType);

  // TODO: separate from text widget
  const { altText, isDecorative, widgetId, textTag } = useWidget<TextWidgetData & AccessibleElement>();
  const widgetType = getWidgetTypeFromId(widgetId);

  if (!showTagOverlay || !taggedWidgetTypes.includes(widgetType)) return null;

  // Some responsive widget group members are tagged through their parent
  const parentId = groupIdCache.getParentId(widgetId);
  if (parentId && groupIdCache.isResponsiveGroupMember(widgetId)) {
    const parentWidgetType = getWidgetTypeFromId(parentId);
    if (parentWidgetType === WidgetType.StatChart) return null;
  }

  const widgetTag = getTag(widgetType, textTag, isDecorative, altText) as AllWidgetTag;
  if (!widgetTag) return null;

  return (
    <Box
      id={`textTagOverlay-${widgetId}`}
      border={'1px solid'}
      borderColor={'upgrade.blue.500'}
      w={`100%`}
      h={`100%`}
      position={'absolute'}
      top={0}
      left={0}
      pointerEvents={'none'}
      p={'1px'}
    >
      {DEFAULT_NON_TEXT_TAGS.includes(widgetTag as NonTextWidgetTag) ? (
        <AltTextModalTrigger trigger={<ModalTrigger tag={widgetTag as NonTextWidgetTag} />} widgetId={widgetId} />
      ) : (
        <Tag size={'sm'} variant={'editor-tag'} pointerEvents={'auto'} maxH={'100%'}>
          <StyledTagIcon width={'1em'} height={'1em'} />
          <TagLabel>{TAGS_TO_LABEL[widgetTag]}</TagLabel>
        </Tag>
      )}
    </Box>
  );
};
