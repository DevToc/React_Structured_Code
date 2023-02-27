import { MouseEvent, useCallback } from 'react';
import { Portal, Box } from '@chakra-ui/react';

import { useViewport } from 'hooks/useViewport';

import { useAppSelector } from 'modules/Editor/store';
import { selectIsActiveWidget } from 'modules/Editor/store/widgetSelector';
import { useFocus } from 'modules/Editor/components/Focus';
import { useWidget } from './useWidget';

interface WidgetToolbarProps {
  children: React.ReactNode;
}

// Renders the selected widgets toolbar
export const WidgetToolbar = ({ children }: WidgetToolbarProps) => {
  const { widgetToolbarPortalRef } = useFocus();
  const { widgetId } = useWidget();
  const { isMobile } = useViewport();
  const isWidgetSelected = useAppSelector(selectIsActiveWidget(widgetId));

  const onDoubleClick = useCallback((e: MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  if (!isWidgetSelected) return null;

  return (
    <Portal containerRef={widgetToolbarPortalRef as React.RefObject<HTMLElement | null> | undefined}>
      {!isMobile && <Box zIndex='var(--vg-zIndices-toolbar)' onDoubleClick={onDoubleClick}>
        {children}
      </Box>}
      {isMobile && (
        <Box overflowY='auto' w='100%' display='flex' h='5rem' zIndex='var(--vg-zIndices-toolbar)'>
          {children}
        </Box>
      )}
    </Portal>
  );
};