import { RootState } from './store';
import { PageId } from '../../../types/idTypes';
import { PageClipboard } from './pageControlSlice';

const selectActivePage = (state: RootState): PageId => state.pageControl.activePageId;
const selectPageClipboard = (state: RootState): PageClipboard[] => state.pageControl.pageClipboard;
const selectShowTagOverlay = (state: RootState): boolean => state.pageControl.showTagOverlay;
const selectIsAllFontsLoaded = (state: RootState): boolean => state.pageControl.isAllFontsLoaded;

export { selectActivePage, selectPageClipboard, selectShowTagOverlay, selectIsAllFontsLoaded };
