import { useState, useRef, useEffect, lazy, Suspense } from 'react';
import { Flex, Box, Skeleton } from '@chakra-ui/react';

import { NAVBAR_HEIGHT } from '../../Navbar';
import { TOOLBAR_HEIGHT } from '../../Toolbar';
import { useAppSelector } from '../../../store/hooks';
import { selectPageOrder } from '../../../store/infographSelector';
import { SkipNavLink } from '../../../../common/components/SkipNavLink';
import { SlideNewButton } from './SlideNewButton';
import { SLIDE_WIDTH, SLIDE_HEIGHT, ADD_NEW_SLIDES_ID } from './Slide.config';

let measuredMenuHeight = 0;

// react-testing-library cannot measure clientHeight from ref
// set this default height instead
const TEST_DEFAULT_HEIGHT = 500;

const SlideList = lazy(
  () =>
    import(
      /* webpackChunkName: "SlideList" */
      /* webpackPrefetch: true */
      './SlideList'
    ),
);

interface SlidesProps {
  slideToggleButtonRef: React.RefObject<HTMLButtonElement>;
}

export const Slides = ({ slideToggleButtonRef }: SlidesProps) => {
  const [menuHeight, setMenuHeight] = useState<number>(measuredMenuHeight);
  const slidesMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const menuClientHeight = slidesMenuRef.current?.clientHeight || TEST_DEFAULT_HEIGHT;
    measuredMenuHeight = menuClientHeight;
    setMenuHeight(menuClientHeight);
  }, []);

  return (
    <Flex
      bg='white'
      h={`calc(100% - ${NAVBAR_HEIGHT + TOOLBAR_HEIGHT}px)`}
      w={`${SLIDE_WIDTH}px`}
      position='fixed'
      right='0'
      top='105px'
      border='1px solid var(--vg-colors-gray-200)'
      zIndex={1001}
      ref={slidesMenuRef}
      direction='column'
    >
      <SlideSkipLink />
      {!!menuHeight && (
        <Suspense fallback={<SlideListSkeleton />}>
          <SlideList menuHeight={menuHeight} />
        </Suspense>
      )}
      <SlideNewButton />
    </Flex>
  );
};

const SlideSkipLink = () => <SkipNavLink id={ADD_NEW_SLIDES_ID}>Skip to end of carousel</SkipNavLink>;

const SlideListSkeleton = () => {
  const pageOrder = useAppSelector(selectPageOrder);
  const maxNrOfLoaders = 3;

  return (
    <Box w='100%'>
      {pageOrder.slice(0, maxNrOfLoaders).map((id: string) => (
        <Skeleton key={id} my={4} ml={10} mr={4} h={SLIDE_HEIGHT} />
      ))}
    </Box>
  );
};
