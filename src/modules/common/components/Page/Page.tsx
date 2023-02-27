import { ReactNode } from 'react';
import { Box } from '@chakra-ui/react';

interface PageProps {
  children: ReactNode;
  bg: string;
  borderRadius?: string;
  boxShadow?: string;
  width: number;
  height: number;
  zoom: number;
  className?: string;
  testId?: string;
  overflow?: string;
  tabIndex?: number;
  focusElementId?: string;
  focusElementTestId?: string;
  pageRef?: React.RefObject<HTMLDivElement> | null;
}

export const Page = ({
  children,
  bg,
  borderRadius,
  boxShadow,
  width,
  height,
  zoom,
  className,
  testId,
  overflow = '',
  tabIndex,
  focusElementId,
  focusElementTestId,
  pageRef,
}: PageProps) => {
  const scaledWidth = width * zoom + 'px';
  const scaledHeight = height * zoom + 'px';
  const widthPx = width + 'px';
  const HeightPx = height + 'px';
  const isFocusable = typeof tabIndex === 'number';

  return (
    <Box data-testid={testId} className={className} width={scaledWidth} height={scaledHeight} m='0'>
      <Box overflow={overflow} height={HeightPx} width={widthPx} transform={`scale(${zoom})`} transformOrigin='0 0'>
        <Box
          height={HeightPx}
          width={widthPx}
          borderRadius={borderRadius ?? 'sm'}
          boxShadow={boxShadow ?? 'lg'}
          bg={bg}
          tabIndex={tabIndex}
          id={focusElementId}
          _focus={isFocusable ? { boxShadow: 'var(--vg-shadows-outline)' } : {}}
          data-testid={focusElementTestId}
          ref={pageRef}
        >
          {children}
        </Box>
      </Box>
    </Box>
  );
};
