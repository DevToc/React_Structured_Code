import { customAlphabet } from 'nanoid';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { WidgetMap } from '../../../widgets/Widget.types';
import { PageId } from '../../../types/idTypes';
import { Page } from '../../../types/pageTypes';
import { getPageIdToMove } from './pageControlSlice.helper';
import { PageDirection } from './pageControlSlice.types';

/**
 * Used to generate random id for a page. 28 chars.
 */
const nanoid = customAlphabet('0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz', 28);

export type PageClipboard = {
  page: Page;
  widgets: WidgetMap;
};

export interface PageControlState {
  activePageId: PageId;
  pageClipboard: PageClipboard[];
  showTagOverlay: boolean;
  isAllFontsLoaded: boolean;
}

export const initialState: PageControlState = {
  activePageId: '',
  showTagOverlay: false,
  pageClipboard: [],
  isAllFontsLoaded: false,
};

export const pageControl = createSlice({
  name: 'pageControl',
  initialState,
  reducers: {
    setActivePageId: (state, action: PayloadAction<PageId>) => {
      state.activePageId = action.payload;
    },
    setShowTagOverlay: (state, action: PayloadAction<boolean>) => {
      state.showTagOverlay = action.payload;
    },
    switchPage: (
      state,
      action: PayloadAction<{ direction: PageDirection; pageOrder: PageId[]; pageNumber?: number }>,
    ) => {
      const { direction, pageOrder, pageNumber } = action.payload;
      const { activePageId } = state;

      const newPageId = getPageIdToMove(direction, activePageId, pageOrder, pageNumber);

      if (newPageId) {
        state.activePageId = newPageId;
      }
    },
    moveToPage: (state, action: PayloadAction<{ pageOrder: PageId[]; pageId: PageId }>) => {
      const { pageOrder, pageId } = action.payload;

      if (pageOrder.includes(pageId)) {
        state.activePageId = action.payload.pageId;
      }
    },
    addToPageClipboard: (state, action: PayloadAction<PageClipboard[]>) => {
      state.pageClipboard = action.payload;
    },
    setFontsLoaded: (state, action: PayloadAction<boolean>) => {
      state.isAllFontsLoaded = action.payload;
    },
  },
});

export const generatePageId = () => `${nanoid()}`;

export const { setActivePageId, switchPage, addToPageClipboard, setShowTagOverlay, setFontsLoaded, moveToPage } =
  pageControl.actions;

export default pageControl.reducer;
