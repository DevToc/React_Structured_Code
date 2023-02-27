import { memo, ReactElement } from 'react';
import { Flex, Text, Box } from '@chakra-ui/react';
import { DraggableProvided } from '@hello-pangea/dnd';

import { Page } from 'modules/common/components/Page';
import { useAppSelector, useAppDispatch } from 'modules/Editor/store/hooks';
import { setActiveWidget } from 'modules/Editor/store';
import {
  selectInfographWidthPx,
  selectInfographHeightPx,
  selectPageBackground,
} from 'modules/Editor/store/infographSelector';
import { selectActiveWidgetIds } from 'modules/Editor/store/widgetSelector';
import { WidgetRenderer } from 'widgets/WidgetRenderer';
import { useUpdateEffect } from 'hooks/useUpdateEffect';
import { getScale, focusSlide } from './Slide.helpers';
import { THUMBNAIL_HEIGHT, THUMBNAIL_WIDTH, BORDER_WIDTH } from './Slide.config';
import { blurActiveWidget } from 'widgets/Widget.helpers';

const TEMP_Z_INDEX_VALUE = 1002;
interface SlideProps {
  provided: DraggableProvided;
  pageId: string;
  isDragging?: boolean;
  onSetActivePageId?: (pageId: string) => void;
  activePageId?: string;
  style?: any;
  idx?: number;
}

export const Slide = ({
  provided,
  pageId,
  style,
  isDragging,
  idx,
  onSetActivePageId,
  activePageId,
}: SlideProps): ReactElement => {
  const isActivePage = activePageId === pageId;

  const virtualItemStyle = {
    ...style,
    ...provided.draggableProps.style,
    // TODO: We should avoid using this random value.
    // Instead, we should manage it by our organized index system where we store all important indexes.
    // The best case would be to not use it in the first place unless it's very specific or limited cases.
    // In case we have to use it, it needs detailed explanation in here.
    // When changing this file, please check this value and update it accordingly.
    zIndex: TEMP_Z_INDEX_VALUE,
    background: isActivePage ? 'var(--vg-colors-hover-blue)' : '',
    display: 'flex',
    alignItems: 'center',
  };

  const focusStyle = {
    background: isDragging && !isActivePage ? 'var(--vg-colors-white)' : '',
    outline: '2px solid var(--chakra-ring-color)',
    outlineOffset: '-2px',
  };

  const hoverStyle = {
    background: 'hover.gray',
  };

  const dispatch = useAppDispatch();
  const activeWidgetIds = useAppSelector(selectActiveWidgetIds);
  const activeWidgetId = activeWidgetIds.length === 1 ? activeWidgetIds[0] : undefined;

  const onClick = () => {
    if (onSetActivePageId) {
      onSetActivePageId(pageId);
      focusSlide(pageId);
      if (activeWidgetId) {
        dispatch(setActiveWidget([]));
        // Remove focus ring on widget
        // that remained from keyboard navigation
        blurActiveWidget(activeWidgetId);
      }
    }
  };

  useUpdateEffect(() => {
    if (isActivePage) focusSlide(pageId);
  }, [isActivePage, pageId]);

  return (
    <Flex
      id={pageId}
      onClick={onClick}
      {...provided.draggableProps}
      {...provided.dragHandleProps}
      ref={provided.innerRef}
      style={virtualItemStyle}
      boxSizing='border-box'
      _focus={focusStyle}
      _hover={hoverStyle}
    >
      <ThumbnailText isActivePage={isActivePage} isDragging={isDragging} idx={idx} />
      <PageThumbnail isActivePage={isActivePage} isDragging={isDragging} pageId={pageId} />
    </Flex>
  );
};

interface ThumbnailTextProps {
  isDragging: boolean | undefined;
  idx: number | undefined;
  isActivePage: boolean;
}

const ThumbnailText = memo(({ isDragging, idx, isActivePage }: ThumbnailTextProps): ReactElement | null => {
  if (isDragging) return null;
  if (idx === undefined) return null;

  const displayIdx = idx + 1;
  const testId = `slide-idx-${displayIdx}${isActivePage ? '-active' : ''}`;

  return (
    <Text userSelect='none' data-testid={testId} w='40px' color='gray.600' textAlign='center' fontSize='xs'>
      {displayIdx}
    </Text>
  );
});

interface PageThumbnailProps {
  pageId: string;
  isDragging: boolean | undefined;
  isActivePage: boolean;
}

const PageThumbnail = memo(({ pageId, isDragging, isActivePage }: PageThumbnailProps): ReactElement => {
  const widthPx = useAppSelector(selectInfographWidthPx);
  const heightPx = useAppSelector(selectInfographHeightPx);
  const pageBackground = useAppSelector(selectPageBackground(pageId));

  const scale = getScale(heightPx, widthPx);
  const hasActiveBorder = isDragging || isActivePage;
  const border = hasActiveBorder
    ? `${BORDER_WIDTH}px solid var(--vg-colors-brand-500)`
    : `${BORDER_WIDTH}px solid var(--vg-colors-gray-200)`;

  return (
    <Flex
      align='center'
      justify='center'
      ml='auto'
      w={THUMBNAIL_WIDTH}
      h={THUMBNAIL_HEIGHT}
      mr='18px'
      border={border}
      borderRadius={4}
      bg='gray.700'
      overflow='hidden'
    >
      <Box maxHeight={THUMBNAIL_HEIGHT} overflow='hidden'>
        <Page bg={pageBackground} width={widthPx} height={heightPx} zoom={scale}>
          <WidgetRenderer pageId={pageId} isReadOnly />
        </Page>
      </Box>
    </Flex>
  );
});
