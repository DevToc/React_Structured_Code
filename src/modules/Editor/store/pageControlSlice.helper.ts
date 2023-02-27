import { PageId } from 'types/idTypes';
import { PageDirection } from './pageControlSlice.types';

/**
 * Find target page id based on direction and page number(manual only)
 *
 * @param direction - direction of moving
 * @param activePageId - current page id
 * @param pageOrder - list of pages in order
 * @param pageNumber - page number to move (only applicable when direction is `manual`)
 * @returns
 */
export function getPageIdToMove(
  direction: PageDirection,
  activePageId: PageId,
  pageOrder: PageId[],
  pageNumber?: number,
) {
  const currentPageIdx = pageOrder.findIndex((pageId) => pageId === activePageId);
  let newPageIdx = -1;

  switch (direction) {
    case PageDirection.next:
      newPageIdx = currentPageIdx + 1;
      break;
    case PageDirection.previous:
      newPageIdx = currentPageIdx - 1;
      break;
    case PageDirection.manual:
      if (pageNumber !== undefined) {
        newPageIdx = pageNumber - 1;
      }
      break;
  }

  return pageOrder[newPageIdx];
}

/**
 * Find the page number of the page slide that is focused.
 *
 * @param pageOrder - list of pages in order
 * @returns The page number of the focused page or undefined.
 */
export function getFocusedPageNumber(pageOrder: PageId[]) {
  const focusedPageId = document.activeElement?.id;

  if (!focusedPageId || !pageOrder.includes(focusedPageId)) return;

  return pageOrder.indexOf(focusedPageId) + 1;
}
