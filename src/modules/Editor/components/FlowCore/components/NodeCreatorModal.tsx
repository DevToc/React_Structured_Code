import { memo, useCallback, useMemo, useRef } from 'react';
import {
  Box,
  Button,
  Grid,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverContent,
  PopoverHeader,
  PopoverTrigger,
} from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';

import { useFlowCore, useFlowCoreValue, useNodeModalRender, usePortValue } from '../FlowModeAPI';
import { Pos } from 'widgets/LineWidget/LineWidget.types';
import { WidgetId } from 'types/idTypes';
import { getWidgetComponent } from 'widgets/WidgetRenderer';
import { ConnectedWidgetData } from 'types/flowCore.types';
import { getWidgetScale, getButtonWidgetStyle } from '../FlowCore.helpers';
import { BUTTON_GRID_GAP, BUTTON_GRID_PX, PADDING_PX } from '../FlowCore.config';

interface NodeCreatorModalProps {
  zoom: number;
}

function NodeCreatorModal({ zoom }: NodeCreatorModalProps) {
  const { t } = useTranslation('editor_flowmode', {
    useSuspense: false,
  });
  const [, closeNodeModal] = useNodeModalRender();
  const nodeModalData = usePortValue('nodeModalData');
  const { duplicateWidget } = useFlowCore();
  const isOpen = nodeModalData !== null;
  const connectedWidgetData = useFlowCoreValue('connectedWidgetData');
  const connectedWidgetDataList = useMemo<ConnectedWidgetData[]>(
    () => (connectedWidgetData ? connectedWidgetData.filter((data) => data.widgetId !== nodeModalData?.widgetId) : []),
    [nodeModalData, connectedWidgetData],
  );

  // Prevent to change the position during modal closing
  const lastNodeModalPosition = useRef<Pos>({ xPx: 0, yPx: 0 });
  if (nodeModalData !== null) {
    lastNodeModalPosition.current.xPx = nodeModalData?.position.leftPx || 0;
    lastNodeModalPosition.current.yPx = nodeModalData?.position.topPx || 0;
  }

  const handleAddWidget = useCallback(
    (widgetId: WidgetId) => {
      if (!nodeModalData?.lineWidgetData) return;

      duplicateWidget(widgetId, nodeModalData.lineWidgetData);

      closeNodeModal();
    },
    [nodeModalData, duplicateWidget, closeNodeModal],
  );

  const addSelectedWidget = useCallback(() => {
    if (!nodeModalData?.widgetId) return;
    handleAddWidget(nodeModalData.widgetId);
  }, [nodeModalData, handleAddWidget]);

  const renderWidget = useCallback((data: ConnectedWidgetData) => {
    const WidgetComponent = getWidgetComponent();

    return (
      <WidgetComponent
        isReadOnly={true}
        widgetId={data.widgetId}
        zIndex={0}
        getWidgetMemberComponent={getWidgetComponent}
        customWidgetData={{ leftPx: 0, topPx: 0 }}
      />
    );
  }, []);

  return (
    <Box>
      <Popover returnFocusOnClose={false} isOpen={isOpen} onClose={closeNodeModal} placement='bottom'>
        <PopoverTrigger>
          {/* Set position box for rendering the Modal */}
          <Box
            position='absolute'
            left={`${lastNodeModalPosition.current.xPx * zoom - PADDING_PX / 2}px`}
            top={`${lastNodeModalPosition.current.yPx * zoom - PADDING_PX / 2}px`}
            width={`${PADDING_PX}px`}
            height={`${PADDING_PX}px`}
          ></Box>
        </PopoverTrigger>
        <PopoverContent pointerEvents='auto'>
          <PopoverHeader fontWeight='semibold' textAlign='center'>
            <Button colorScheme={'green'} onClick={addSelectedWidget}>
              {t('modal.add-widget-button')}
            </Button>
          </PopoverHeader>
          {isOpen && connectedWidgetDataList.length ? (
            <>
              <PopoverArrow />
              <PopoverBody display='grid' overflowY='scroll' overflowX='hidden' maxHeight={200}>
                <Grid gridTemplateColumns={`repeat(4, ${BUTTON_GRID_PX}px)`} gap={BUTTON_GRID_GAP}>
                  {isOpen &&
                    connectedWidgetDataList.map((widgetData) => (
                      <Button
                        key={widgetData.widgetId}
                        width={`${BUTTON_GRID_PX}px`}
                        height={`${BUTTON_GRID_PX}px`}
                        overflow='hidden'
                        variant='add-widget-button'
                        onClick={() => handleAddWidget(widgetData.widgetId)}
                      >
                        <Box
                          position='absolute'
                          {...getButtonWidgetStyle(widgetData.widgetData.heightPx, widgetData.widgetData.widthPx)}
                          transformOrigin='top left'
                          transform={`scale(${getWidgetScale(
                            widgetData.widgetData.heightPx,
                            widgetData.widgetData.widthPx,
                          )})`}
                        >
                          {renderWidget(widgetData)}
                        </Box>
                      </Button>
                    ))}
                </Grid>
              </PopoverBody>
            </>
          ) : null}
        </PopoverContent>
      </Popover>
    </Box>
  );
}

export default memo(NodeCreatorModal);
