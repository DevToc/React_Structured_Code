import { ReactNode, ReactElement, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useAppDispatch, useAppSelector, setActivePage } from './Editor/store';
import { setFontsLoaded } from './Editor/store/pageControlSlice';
import { filterUnloadedFamilies, loadFonts } from '../hooks/useFont';
import { findFontsInPage } from './Editor/store/infographSlice.helpers';
import { loadInfograph } from './Editor/store/infographSlice';
import widgetVersionManager from '../widgets/WidgetVersionManager';
import { getFullInfograph } from '../libs/e2api/get';
import { InfographState } from '../types/infographTypes';
import { setOriginalEditorId } from './Editor/store/editorSettingsSlice';
import { removeDeletedWidgets } from '../widgets/Widget.helpers';
import { selectActivePage } from './Editor/store/pageSelector';
import { selectInfograph } from './Editor/store/infographSelector';

interface InfographLoaderProps {
  children: ReactNode;
  infographState?: InfographState;
}

/**
 * Loads infograph to the store.
 *
 * If infographId param is available in the route, loads it from the backend api.
 *
 * If static local infograph is provided in prop, it'll load it.
 *
 * @param children
 * @param infographState
 * @constructor
 */
const InfographLoader = ({ children, infographState }: InfographLoaderProps): ReactElement => {
  const params = useParams();

  const { id: infographId, pageId, privateLinkId } = params || {};

  const dispatch = useAppDispatch();
  const infograph = useAppSelector(selectInfograph);
  const activePageId = useAppSelector(selectActivePage);

  useEffect(() => {
    const fetchId = infographId ?? privateLinkId;
    if (fetchId) {
      // Fetch infograph
      getFullInfograph(fetchId, !!privateLinkId).then((infograph) => {
        // console.debug('fetched infograph', infograph)
        const openPageId = pageId || infograph?.pageOrder[0] || '';

        // Load fonts asynchronously, to block page render before font fetching, use await loadFonts instead
        // TODO: hmm clean this up into single dispatch?
        // Set e1 uuid as a reference id
        !!infographId && dispatch(setOriginalEditorId(infographId));

        // Temporary: filter out deleted widgets from the Infograph
        // until they are removed from the infograph object returned from the BE (as they are not updated)
        const filteredInfograph = removeDeletedWidgets(infograph);

        // update widgets to latest version
        const updatedWidgets = widgetVersionManager.update(filteredInfograph.widgets);
        filteredInfograph.widgets = updatedWidgets;

        dispatch(loadInfograph(filteredInfograph));
        dispatch(setActivePage({ pageId: openPageId }));
        loadFonts(findFontsInPage(filteredInfograph, openPageId)).then(() => {
          dispatch(setFontsLoaded(true));
        });
      });
    } else if (infographState) {
      const pageId = infographState.pageOrder[0] || '';
      dispatch(loadInfograph(infographState));
      dispatch(setActivePage({ pageId }));
      //   TODO: improve this, not loading fonts here as this is used for integration tests
      //   loadFonts(findFontsInPage(infograph, openPageId));
    }
  }, [dispatch, infographId, infographState, pageId, privateLinkId]);

  useEffect(() => {
    // Handle multipage font loads
    // when the current active page changes
    // Skip the first page load
    if (!!activePageId && infograph?.pageOrder.length > 1 && infograph?.pageOrder[0] !== activePageId) {
      const fonts = findFontsInPage(infograph, activePageId);
      const unloadedFamilies = filterUnloadedFamilies(fonts);

      if (unloadedFamilies.length > 0) {
        dispatch(setFontsLoaded(false));
        loadFonts(unloadedFamilies).then(() => {
          dispatch(setFontsLoaded(true));
        });
      }
    }
  }, [dispatch, infograph, activePageId]);

  return <>{children}</>;
};

export { InfographLoader };
