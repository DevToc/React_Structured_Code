import { useState, ReactElement, useRef, useLayoutEffect } from 'react';

import { useUpdateEffect } from 'hooks/useUpdateEffect';
import { Slides } from './Slides';
import { PageManagerControl } from './PageManagerControl';
import { useAppSelector, useAppDispatch } from 'modules/Editor/store/hooks';
import { setActiveWidget } from 'modules/Editor/store/store';
import { selectZoom, selectIsSlideView, selectIsAccessibilityView } from 'modules/Editor/store/selectEditorSettings';
import { PageManagerWidgetProvider } from './usePageManager';
import { ACCESSIBILITY_MENU_WIDTH } from '../AccessibilityManager/AccessibilityManager.config';
import { selectInfographSize } from 'modules/Editor/store/infographSelector';
import { SLIDE_WIDTH } from './Slides/Slide.config';

const SCROLLBAR_OFFSET = 15;

interface PageManagerProps {
  scrollAreaRef: HTMLElement | null;
}

export const PageManager = ({ scrollAreaRef }: PageManagerProps): ReactElement => {
  const [rightOffset, setRightOffset] = useState('0px');
  const slideToggleButtonRef = useRef<HTMLButtonElement>(null);
  const pageManagerToggleButtonRef = useRef<HTMLButtonElement>(null);

  const zoom = useAppSelector(selectZoom);
  const isSlideView = useAppSelector(selectIsSlideView);
  const isAccessibilityView = useAppSelector(selectIsAccessibilityView);
  const pageSize = useAppSelector(selectInfographSize);
  const dispatch = useAppDispatch();

  useUpdateEffect(() => {
    if (isSlideView) {
      dispatch(setActiveWidget([]));
      return slideToggleButtonRef.current?.focus();
    } else return pageManagerToggleButtonRef.current?.focus();
  }, [isSlideView]);

  useLayoutEffect(() => {
    if (!scrollAreaRef) return;
    const hasVerticalScrollbar = scrollAreaRef.scrollHeight > scrollAreaRef.clientHeight;
    let offset = hasVerticalScrollbar ? SCROLLBAR_OFFSET : 0;

    if (isSlideView) {
      offset += SLIDE_WIDTH;
    } else if (isAccessibilityView) {
      offset += ACCESSIBILITY_MENU_WIDTH;
    }

    setRightOffset(`${offset}px`);
  }, [zoom, scrollAreaRef, isAccessibilityView, pageSize, isSlideView]);

  return (
    <>
      <PageManagerControl pageManagerToggleButtonRef={pageManagerToggleButtonRef} rightOffset={rightOffset} />
      {isSlideView && (
        <PageManagerWidgetProvider disableTabbability={isSlideView}>
          <Slides slideToggleButtonRef={slideToggleButtonRef} />
        </PageManagerWidgetProvider>
      )}
    </>
  );
};
