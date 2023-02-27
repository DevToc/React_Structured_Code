import { useCallback } from 'react';
import { PageId, WidgetId } from 'types/idTypes';
import { useAppDispatch, useAppSelector, setActiveWidget, setActivePage } from 'modules/Editor/store';
import { selectActivePage } from 'modules/Editor/store/pageSelector';

type SelectionTarget = {
  widgetId: WidgetId;
  pageId: PageId;
};

/**
 * Hook to select a widget from a page other than the current active one
 *
 * @returns { dispatchSelectWidget }
 */
export const useSelectWidgetFromOtherPage = () => {
  const dispatch = useAppDispatch();
  const activePageId = useAppSelector(selectActivePage);

  const dispatchSelectWidget = useCallback(
    ({ widgetId, pageId }: SelectionTarget) => {
      const isSamePage = pageId === activePageId;

      if (!isSamePage) dispatch(setActivePage({ pageId }));
      dispatch(setActiveWidget({ widgetId, shouldScrollToWidget: true }));
    },
    [dispatch, activePageId],
  );

  return { dispatchSelectWidget };
};
