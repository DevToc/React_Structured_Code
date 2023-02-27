import { ReactElement, useRef } from 'react';
import { Box, useMergeRefs } from '@chakra-ui/react';

import { Page } from 'modules/common/components/Page';
import { WidgetRenderer } from 'widgets/WidgetRenderer';
import { useAppSelector } from 'modules/Editor/store/hooks';
import { selectActivePage } from 'modules/Editor/store/pageSelector';
import {
  selectInfographWidthPx,
  selectInfographHeightPx,
  selectPageBackground,
} from 'modules/Editor/store/infographSelector';
import { selectIsAccessibilityView, selectIsSlideView, selectZoom } from 'modules/Editor/store/selectEditorSettings';
import { BoundingBox } from '../BoundingBox';
import { PageScrollContainer, PageTransformContainer } from './PageContainer';
import { PageManager } from '../PageManager';
import { PAGE_CONTAINER_CLASSNAME, EDITOR_ACTIVE_PAGE_FOCUS_ID } from 'modules/Editor/Editor.config';
import { ACCESSIBILITY_MENU_WIDTH } from '../AccessibilityManager/AccessibilityManager.config';
import { useFocus } from '../Focus';
import { PageColorVisionFilter } from 'modules/Editor/components/PageArea/PageColorVisionFilter';
import { SLIDE_WIDTH } from '../PageManager/Slides/Slide.config';
import PortRenderer from '../FlowCore/components/PortRenderer';

export const PageArea = (): ReactElement => {
  const activePageId = useAppSelector(selectActivePage);
  const zoom = useAppSelector(selectZoom);
  const widthPx = useAppSelector(selectInfographWidthPx);
  const heightPx = useAppSelector(selectInfographHeightPx);
  const pageBackground = useAppSelector(selectPageBackground(activePageId));
  const isAccessibilityView = useAppSelector(selectIsAccessibilityView);
  const isSlideView = useAppSelector(selectIsSlideView);

  const scrollAreaRef = useRef(null);
  const { pageScrollContainerRef } = useFocus();
  const pageScrollRefs = useMergeRefs(pageScrollContainerRef, scrollAreaRef);
  const { activePageRef } = useFocus();

  let containerMarginRight = '0px';
  if (isSlideView) containerMarginRight = `${SLIDE_WIDTH}px`;
  if (isAccessibilityView) containerMarginRight = `${ACCESSIBILITY_MENU_WIDTH}px`;

  return (
    <>
      <PageScrollContainer ref={pageScrollRefs} mr={containerMarginRight}>
        <PageTransformContainer>
          <Page
            testId={activePageId}
            className={PAGE_CONTAINER_CLASSNAME}
            bg={pageBackground}
            width={widthPx}
            height={heightPx}
            zoom={zoom}
            tabIndex={0}
            focusElementId={EDITOR_ACTIVE_PAGE_FOCUS_ID}
            focusElementTestId='page-focus-element'
            pageRef={activePageRef}
          >
            <PageColorVisionFilter>
              <WidgetRenderer pageId={activePageId} />
            </PageColorVisionFilter>
            <div id='smartguide-container' />
          </Page>
        </PageTransformContainer>
        <BoundingBox />
        {/* PortRenderer */}
        <Box zIndex='port' position='relative' width='full' height='full' pointerEvents='none'>
          <PageTransformContainer readonly={true}>
            <PortRenderer />
          </PageTransformContainer>
        </Box>
      </PageScrollContainer>
      <PageManager scrollAreaRef={scrollAreaRef.current} />
    </>
  );
};
