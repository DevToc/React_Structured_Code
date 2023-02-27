import { ReactElement, useState, useMemo, useCallback, memo } from 'react';
import { Collapse, Box, Button, SimpleGrid, Text } from '@chakra-ui/react';
import {
  DragDropContext,
  Droppable,
  Draggable,
  DroppableProvided,
  DraggableProvided,
  DropResult,
  DraggableRubric,
  DragStart,
} from '@hello-pangea/dnd';

import { ReactComponent as ChevronDownIcon } from 'assets/icons/chevron_down.svg';
import { ReactComponent as ChevronRightIcon } from 'assets/icons/chevron_right.svg';
import { PageId, WidgetId } from 'types/idTypes';
import { AccessibleElement } from 'types/widget.types';
import { TreeNode } from 'types/structuredContentTypes';
import { AllWidgetData } from 'widgets/Widget.types';
import { Mixpanel } from 'libs/third-party/Mixpanel/mixpanel';
import { useAppSelector, useAppDispatch, setActiveWidget } from 'modules/Editor/store';
import { selectPageStructureTree, selectWidgets } from 'modules/Editor/store/infographSelector';
import { setPageStructureTree } from 'modules/Editor/store/infographSlice';
import { dangerouslySetHasKeyboardIgnore } from 'modules/Editor/store/editorSettingsSlice';
import { ActiveWidget } from 'modules/Editor/store/widgetControlSlice';
import { getLabelWidgetId, getLeafNodes, reOrderStructureTree } from './AccessibilityManager.helpers';
import { ReadOrderItem } from './ReadOrderItem';
import { SelectionTarget } from './AccessibilityManager.types';
import { PAGE_ITEM_TESTID_PREFIX } from './AccessibilityManager.config';
import { useSelectWidgetFromOtherPage } from './AccessibilityChecker/common/hooks/useSelectWidgetFromOtherPage';

interface PageReadOrderProps {
  index: number;
  pageId: PageId;
  activePageId?: PageId;
  activeWidgetId?: WidgetId;
  activeWidget?: ActiveWidget;
}

/**
 * Check if a reading order item should have ACTIVE state in list
 * Widgets in responsive groups need to check the `activeWidget` property from redux
 *
 * @param widgetId Widget id to check
 * @param activeWidgetId activeWidgetId (from redux)
 * @param activeWidget activeWidget (from redux)
 * @returns
 */
const isWidgetActive = (widgetId: WidgetId, activeWidgetId?: WidgetId, activeWidget?: ActiveWidget) => {
  return (
    activeWidgetId === widgetId ||
    activeWidget?.id === widgetId ||
    (!!activeWidget?.responsiveGroupId && !activeWidget?.groupId && !!activeWidget?.groupMembers?.includes(widgetId))
  );
};

const PageReadOrder = memo(
  ({ index, pageId, activePageId, activeWidgetId, activeWidget }: PageReadOrderProps): ReactElement => {
    const [show, setShow] = useState(pageId === activePageId);
    const { dispatchSelectWidget } = useSelectWidgetFromOtherPage();

    const structureTree = useAppSelector(selectPageStructureTree(pageId)) as TreeNode;
    const widgets = useAppSelector(selectWidgets);
    // Note: expensive call here, we may need to isDecorative to structure tree for better performance
    const widgetList = useMemo(() => {
      const widgetIds = structureTree ? getLeafNodes(structureTree) : [];
      return widgetIds.filter((id) => (widgets[id] as AccessibleElement)?.isDecorative !== true);
    }, [structureTree, widgets]);
    const dispatch = useAppDispatch();

    const handleToggle = () => setShow(!show);
    const onDragStart = useCallback(
      ({ draggableId }: DragStart) => {
        dispatch(dangerouslySetHasKeyboardIgnore({ hasKeyboardIgnore: true }));

        // Note: Set select widget on drag start may cause lag at begin
        if (pageId === activePageId && draggableId !== activeWidgetId) {
          dispatch(setActiveWidget(draggableId));
        }
      },
      [pageId, activePageId, activeWidgetId, dispatch],
    );
    const onDragEnd = useCallback(
      (result: DropResult) => {
        dispatch(dangerouslySetHasKeyboardIgnore({ hasKeyboardIgnore: false }));
        if (!result.destination || result.source.index === result.destination.index || !structureTree) return;
        const sourceWidgetId = widgetList.at(result.source.index) as WidgetId;
        const targetWidgetId = widgetList.at(result.destination.index) as WidgetId;
        const newStructureTree = reOrderStructureTree(
          structureTree,
          sourceWidgetId,
          targetWidgetId,
          result.source.index > result.destination.index,
        ) as TreeNode;
        if (newStructureTree) {
          dispatch(setPageStructureTree({ pageId, structureTree: newStructureTree }));
        }

        dispatchSelectWidget({ pageId, widgetId: result.draggableId });

        Mixpanel.track('Reading Order Edited');
      },
      [pageId, structureTree, widgetList, dispatchSelectWidget, dispatch],
    );

    const handleWidgetSelect = useCallback(
      ({ pageId, widgetId }: SelectionTarget) => {
        dispatchSelectWidget({ pageId, widgetId });
      },
      [dispatchSelectWidget],
    );

    return (
      <Box>
        <Button
          data-testid={`${PAGE_ITEM_TESTID_PREFIX}-${pageId}`}
          colorScheme='white'
          onClick={handleToggle}
          leftIcon={show ? <ChevronDownIcon /> : <ChevronRightIcon />}
          _focus={{ boxShadow: 'inset var(--vg-shadows-outline)' }}
        >
          <Text as='span' fontSize='14px' fontWeight='400' color='blackAlpha.900'>
            Page {index + 1}
          </Text>
        </Button>
        <Collapse in={show}>
          <DragDropContext onDragStart={onDragStart} onDragEnd={onDragEnd}>
            <Droppable
              droppableId='droppable'
              renderClone={(provided: DraggableProvided, _, rubric: DraggableRubric) => {
                // Get the widget id of the widget data required for label
                const widgetId = rubric.draggableId;
                const labelWidgetId = getLabelWidgetId(rubric.draggableId, widgets) || rubric.draggableId;

                return (
                  <ReadOrderItem
                    provided={provided}
                    pageId={pageId}
                    widgetId={widgetId}
                    widgetData={widgets[labelWidgetId] as AllWidgetData}
                    isDragging={true}
                    isInActivePage={activePageId === pageId}
                    isActive={isWidgetActive(widgetId, activeWidgetId, activeWidget)}
                  />
                );
              }}
            >
              {(provided: DroppableProvided) => (
                <SimpleGrid ref={provided.innerRef} mt={0} padding={0} columns={1} alignItems='center' gap={0}>
                  {widgetList.map((id, index) => {
                    return (
                      <Draggable key={id} draggableId={id} index={index}>
                        {(provided: DraggableProvided) => {
                          // Get the widget id of the widget data required for label
                          const labelWidgetId = getLabelWidgetId(id, widgets) || id;

                          return (
                            <ReadOrderItem
                              provided={provided}
                              key={id}
                              pageId={pageId}
                              widgetId={id}
                              widgetData={widgets[labelWidgetId] as AllWidgetData}
                              isDragging={false}
                              isInActivePage={activePageId === pageId}
                              isActive={isWidgetActive(id, activeWidgetId, activeWidget)}
                              onClick={handleWidgetSelect}
                            />
                          );
                        }}
                      </Draggable>
                    );
                  })}
                  {provided.placeholder}
                </SimpleGrid>
              )}
            </Droppable>
          </DragDropContext>
        </Collapse>
      </Box>
    );
  },
);

export { PageReadOrder };
