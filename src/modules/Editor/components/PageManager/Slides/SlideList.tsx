import { memo, useRef, useEffect, useCallback, ReactElement } from 'react';
import {
  DragDropContext,
  Droppable,
  Draggable,
  DroppableProvided,
  DraggableProvided,
  DropResult,
  DraggableStateSnapshot,
  DraggableRubric,
} from '@hello-pangea/dnd';
import { FixedSizeList, areEqual, ListChildComponentProps } from 'react-window';

import { PageId } from 'types/idTypes';
import { useAppDispatch, useAppSelector } from 'modules/Editor/store/hooks';
import { setPageOrder } from 'modules/Editor/store/infographSlice';
import { selectPageOrder } from 'modules/Editor/store/infographSelector';
import { dangerouslySetHasKeyboardIgnore } from 'modules/Editor/store/editorSettingsSlice';
import { setActivePage } from 'modules/Editor/store';
import { selectActivePage } from 'modules/Editor/store/pageSelector';
import { SLIDE_WIDTH, SLIDE_HEIGHT } from './Slide.config';
import { Slide } from './Slide';
import { reOrder } from './Slide.helpers';
import { EmptyBoundingBoxProvider } from '../../BoundingBox/useBoundingBox';

const ADD_BUTTON_HEIGHT = 38;

interface SlidesContainerProps {
  menuHeight: number;
}

const SlideList = ({ menuHeight }: SlidesContainerProps): ReactElement => {
  const listRef = useRef<any>();

  const pageOrder = useAppSelector(selectPageOrder);
  const activePageId = useAppSelector(selectActivePage);
  const dispatch = useAppDispatch();

  const onDragEnd = (result: DropResult): void => {
    dispatch(dangerouslySetHasKeyboardIgnore({ hasKeyboardIgnore: false }));

    if (!result.destination) return;
    if (result.source.index === result.destination.index) return;

    const newPageOrder: PageId[] = reOrder(pageOrder, result.source.index, result.destination.index);
    dispatch(setPageOrder({ pageOrder: newPageOrder }));
  };

  const onDragStart = () => dispatch(dangerouslySetHasKeyboardIgnore({ hasKeyboardIgnore: true }));
  const onSetActivePageId = useCallback((pageId: PageId) => dispatch(setActivePage({ pageId })), [dispatch]);

  const scrollToActiveSlide = (): void => {
    if (!listRef?.current?.scrollToItem) return;

    const idx = pageOrder.findIndex((id: PageId) => id === activePageId);
    listRef.current.scrollToItem(idx, 'smart');
  };

  useEffect(scrollToActiveSlide, [pageOrder, activePageId]);

  // TODO: decouple BoundingBoxProvider from Renderer here
  return (
    <EmptyBoundingBoxProvider>
      <DragDropContext onDragStart={onDragStart} onDragEnd={onDragEnd}>
        <Droppable
          droppableId='droppable'
          mode='virtual'
          renderClone={(provided: DraggableProvided, snapshot: DraggableStateSnapshot, rubric: DraggableRubric) => (
            <Slide
              provided={provided}
              activePageId={activePageId}
              isDragging={snapshot.isDragging}
              pageId={pageOrder[rubric.source.index]}
            />
          )}
        >
          {(provided: DroppableProvided) => (
            <FixedSizeList
              ref={listRef}
              height={menuHeight - ADD_BUTTON_HEIGHT}
              itemCount={pageOrder.length}
              itemSize={SLIDE_HEIGHT}
              width={SLIDE_WIDTH}
              outerRef={provided.innerRef}
              itemData={{ pageOrder, onSetActivePageId, activePageId }}
            >
              {SlideRow}
            </FixedSizeList>
          )}
        </Droppable>
      </DragDropContext>
    </EmptyBoundingBoxProvider>
  );
};

export default SlideList;

const SlideRow = memo((props: ListChildComponentProps) => {
  const { data, index, style } = props;
  const { pageOrder, onSetActivePageId, activePageId } = data;
  const pageId = pageOrder[index];

  return (
    <Draggable draggableId={pageId} index={index} key={pageId}>
      {(provided: DraggableProvided) => (
        <Slide
          activePageId={activePageId}
          onSetActivePageId={onSetActivePageId}
          idx={index}
          provided={provided}
          pageId={pageId}
          style={style}
        />
      )}
    </Draggable>
  );
}, areEqual);
