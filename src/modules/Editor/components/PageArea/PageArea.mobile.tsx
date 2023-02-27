import { ReactElement, useCallback, useRef, useEffect } from 'react';
import { Box } from '@chakra-ui/react';

import { useResizeObserver } from 'hooks/useResizeObserver';
import { Page } from 'modules/common/components/Page';
import { WidgetRenderer } from 'widgets/WidgetRenderer';
import { useAppSelector, useAppDispatch } from 'modules/Editor/store/hooks';
import { selectActivePage } from 'modules/Editor/store/pageSelector';
import {
  selectInfographWidthPx,
  selectInfographHeightPx,
  selectPageBackground,
} from 'modules/Editor/store/infographSelector';
import { setActiveWidget } from 'modules/Editor/store/store';
import { selectZoom } from 'modules/Editor/store/selectEditorSettings';
import { getCanvasScale } from './PageArea.helpers';
import { BoundingBoxMobile } from '../BoundingBox';
import { setZoom } from '../../store/editorSettingsSlice';
import { PageScrollContainer, PageTransformContainer } from './PageContainer.mobile';
import { PAGE_CONTAINER_CLASSNAME, EDITOR_ACTIVE_PAGE_FOCUS_ID } from 'modules/Editor/Editor.config';
import { useFocus } from '../Focus';
import { PageColorVisionFilter } from 'modules/Editor/components/PageArea/PageColorVisionFilter';
import PortRenderer from '../FlowCore/components/PortRenderer';

export const PageAreaMobile = (): ReactElement => {
  const zoom = useAppSelector(selectZoom);
  const activePageId = useAppSelector(selectActivePage);
  const widthPx = useAppSelector(selectInfographWidthPx);
  const heightPx = useAppSelector(selectInfographHeightPx);
  const pageBackground = useAppSelector(selectPageBackground(activePageId));

  const hasResizedCanvas = useRef<boolean>(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const transformAreaRef = useRef<HTMLDivElement>(null);

  const dispatch = useAppDispatch();
  const { activePageRef } = useFocus();

  const unselectAll = () => {
    dispatch(setActiveWidget([]));
  };

  const calculateCanvasArea = useCallback(() => {
    if (hasResizedCanvas.current) return;
    const zoomScale = getCanvasScale(transformAreaRef);
    dispatch(setZoom(zoomScale));
    hasResizedCanvas.current = true;
  }, [dispatch]);

  useResizeObserver({
    ref: transformAreaRef.current,
    onResize: calculateCanvasArea,
  });

  useEffect(unselectAll, [activePageId, dispatch]);

  return (
    <>
      <PageScrollContainer ref={scrollAreaRef}>
        <PageTransformContainer ref={transformAreaRef}>
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
            {/* FIXME: Re-enable once SmartGuide is working correctly with touch events on mobile */}
            <div id='smartguide-container' style={{ display: 'none' }} />
          </Page>
        </PageTransformContainer>
        <BoundingBoxMobile />
        {/* PortRenderer */}
        <Box zIndex='port' position='relative' width='full' height='full' pointerEvents='none'>
          <PageTransformContainer readonly={true}>
            <PortRenderer />
          </PageTransformContainer>
        </Box>
      </PageScrollContainer>
    </>
  );
};