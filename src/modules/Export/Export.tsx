import { ReactElement } from 'react';
import { Provider } from 'react-redux';

import { store, useAppSelector } from '../Editor/store';
import {
  selectInfographHeightPx,
  selectInfographWidthPx,
  selectPageBackground,
} from '../../modules/Editor/store/infographSelector';

import { selectActivePage } from '../../modules/Editor/store/pageSelector';
import { Page } from '../common/components/Page';
import { ReadOnlyStructureTreeListWidgetRenderer } from '../../widgets/WidgetRenderer';
import { InfographLoader } from '../InfographLoader';
import { movePage } from './Export.helpers';

const InfographExportViewLoader = (): ReactElement => {
  const widthPx = useAppSelector(selectInfographWidthPx);
  const heightPx = useAppSelector(selectInfographHeightPx);
  const activePageId = useAppSelector(selectActivePage);
  const pageBackground = useAppSelector(selectPageBackground(activePageId));

  return (
    <InfographLoader>
      {activePageId && (
        <Page
          testId={activePageId}
          className='page-container'
          bg={pageBackground}
          width={widthPx}
          height={heightPx}
          zoom={1}
          borderRadius='none'
          boxShadow='none'
          overflow='hidden'
        >
          <ReadOnlyStructureTreeListWidgetRenderer pageId={activePageId} />
        </Page>
      )}
    </InfographLoader>
  );
};

const Export = (): ReactElement => {
  return (
    <Provider store={store}>
      <InfographExportViewLoader />
    </Provider>
  );
};

export default Export;

// Internal method to navigate the page in Export page
window.__moveToPage = movePage;
