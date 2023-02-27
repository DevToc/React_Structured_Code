import { ComponentProps, ReactElement } from 'react';
import { Box } from '@chakra-ui/react';
import { PageReadOrder } from './PageReadOrder';
import { useAppSelector } from '../../store';
import { selectPageOrder } from '../../store/infographSelector';
import { selectActivePage } from '../../store/pageSelector';
import { selectActiveWidgetIds, selectActiveWidgets } from '../../store/widgetSelector';
import { PageId } from '../../../../types/idTypes';

const ReadingOrderTab = (props: ComponentProps<typeof Box>): ReactElement => {
  const pageOrder = useAppSelector(selectPageOrder);
  const activePageId = useAppSelector(selectActivePage);
  const activeWidgetIds = useAppSelector(selectActiveWidgetIds);
  const activeWidgets = useAppSelector(selectActiveWidgets);
  const activeWidgetId = activeWidgetIds.length === 1 ? activeWidgetIds[0] : undefined;
  const activeWidget = activeWidgets.length === 1 ? activeWidgets[0] : undefined;

  return (
    <Box {...props}>
      {pageOrder.map((pageId: PageId, index: number) => {
        return (
          <PageReadOrder
            key={pageId}
            index={index}
            pageId={pageId}
            activePageId={activePageId}
            activeWidgetId={activeWidgetId}
            activeWidget={activeWidget}
          />
        );
      })}
    </Box>
  );
};

export default ReadingOrderTab;
