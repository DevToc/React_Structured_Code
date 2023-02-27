import { useState, memo, useRef } from 'react';
import { Flex } from '@chakra-ui/react';
import { DraggableProvided } from '@hello-pangea/dnd';
import { ReadOrderIcon } from './ReadOrderIcon';
import { ReadOrderLabel } from './ReadOrderLabel';
import { PageId, WidgetId } from '../../../../types/idTypes';
import { ReactComponent as GrabberIcon } from '../../../../assets/icons/a11ymenu_grabber.svg';
import { AllWidgetData } from '../../../../widgets/Widget.types';
import { SelectionTarget } from './AccessibilityManager.types';
import { WIDGET_ITEM_TESTID_PREFIX } from './AccessibilityManager.config';

interface ReadOrderItemProps {
  pageId: PageId;
  widgetId: WidgetId;
  widgetData?: AllWidgetData;
  isDragging: boolean;
  isActive: boolean;
  isInActivePage: boolean;
  provided: DraggableProvided;
  onClick?: ({ pageId, widgetId }: SelectionTarget) => void;
}

const ReadOrderItem = memo(
  ({ pageId, widgetId, widgetData, isDragging, isActive, provided, onClick }: ReadOrderItemProps) => {
    const grabRef = useRef<SVGSVGElement>(null);
    const [hover, setHover] = useState(false);

    if (!widgetId || !widgetData) return null;

    const handleOnHover = () => setHover(true);
    const handleOffHover = () => setHover(false);
    const handleFocus = () => (grabRef.current?.parentElement as HTMLElement)?.focus();
    const handleClick = () => onClick?.({ widgetId, pageId });

    return (
      <Flex
        data-testid={`${WIDGET_ITEM_TESTID_PREFIX}-${widgetId}`}
        ref={provided.innerRef}
        minH='32px'
        gap='8px'
        padding='8px'
        alignItems='center'
        borderLeft={isDragging ? '4px solid var(--vg-colors-upgrade-blue-500)' : ''}
        background={isActive || isDragging ? 'var(--vg-colors-a11yMenu-active)' : ''}
        _hover={{ bg: !isActive && hover ? 'var(--vg-colors-a11yMenu-hover)' : '' }}
        _focus={{ outline: '2px solid var(--chakra-ring-color)', outlineOffset: '-2px' }}
        {...provided.draggableProps}
        {...provided.dragHandleProps}
        onClick={handleClick}
        onMouseEnter={handleOnHover}
        onMouseLeave={handleOffHover}
        onMouseDown={handleFocus}
      >
        {<GrabberIcon ref={grabRef} opacity={isActive || hover || isDragging ? 1 : 0} />}
        <ReadOrderIcon widgetId={widgetId} widgetData={widgetData} />
        <ReadOrderLabel widgetId={widgetId} widgetData={widgetData} />
      </Flex>
    );
  },
);

export { ReadOrderItem };
