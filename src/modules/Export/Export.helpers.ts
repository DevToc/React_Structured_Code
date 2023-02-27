import { loadFonts } from 'hooks/useFont';
import { store } from 'modules/Editor/store';
import { findFontsInPage } from 'modules/Editor/store/infographSlice.helpers';
import { moveToPage } from 'modules/Editor/store/pageControlSlice';
import { PageId } from 'types/idTypes';

/**
 * Move to the page based on pageId parameter
 * and load the fonts used in the page.
 * @param pageId
 */
export const movePage = (pageId: PageId) => {
  const { infograph } = store.getState();
  const { pageOrder } = infograph;
  store.dispatch(moveToPage({ pageOrder, pageId }));
  loadFonts(findFontsInPage(infograph, pageId));
};
