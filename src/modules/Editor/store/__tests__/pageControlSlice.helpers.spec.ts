import { PageDirection } from '../pageControlSlice.types';
import { getFocusedPageNumber, getPageIdToMove } from '../pageControlSlice.helper';

describe('pageControlSlice.helpers.ts', () => {
  it('should getPageIdToMove as expected', () => {
    const pageOrder = ['page-1', 'page-2', 'page-3'];

    // Move to the next page
    let direction = PageDirection.next;
    let activePageId = pageOrder[1];
    let nextPageId = pageOrder[2];
    let newPageId = getPageIdToMove(direction, activePageId, pageOrder);
    expect(newPageId).toEqual(nextPageId);

    // Move to the previous page
    direction = PageDirection.previous;
    let previousPageId = pageOrder[0];
    newPageId = getPageIdToMove(direction, activePageId, pageOrder);
    expect(newPageId).toEqual(previousPageId);

    // Move to the last page manually
    direction = PageDirection.manual;
    let pageNumber = 3;
    activePageId = pageOrder[0];
    newPageId = getPageIdToMove(direction, activePageId, pageOrder, pageNumber);
    expect(newPageId).toEqual(pageOrder[2]);

    // Returns undefined if accessing non existing page
    pageNumber = 7;
    newPageId = getPageIdToMove(direction, activePageId, pageOrder, pageNumber);
    expect(newPageId).toBeUndefined();
  });

  it('should getFocusedPageNumber as expected', async () => {
    const pageOrder = ['page-1', 'page-2', 'page-3'];
    const mockPageSlide = document.createElement('div');
    document.body.appendChild(mockPageSlide);
    // Second page
    mockPageSlide.id = pageOrder[1];
    mockPageSlide.tabIndex = 0;
    mockPageSlide.focus();

    let focusedPageNumber = getFocusedPageNumber(pageOrder);
    expect(focusedPageNumber).toEqual(2);
  });
});
