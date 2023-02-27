import { memo, useMemo } from 'react';
import { Box } from '@chakra-ui/react';

import { selectInfographHeightPx, selectInfographWidthPx } from 'modules/Editor/store/infographSelector';
import { useAppSelector } from 'modules/Editor/store';
import { useFlowCoreValue } from '../FlowModeAPI';
import LineConnector from './LineConnector';
import LineCreator from './LineCreator';
import NodeCreatorModal from './NodeCreatorModal';
import { PORT_CONTAINER_CLASS } from 'constants/bounding-box';
import { selectZoom } from 'modules/Editor/store/selectEditorSettings';

function PortRenderer() {
  const zoom = useAppSelector(selectZoom);
  const isFlowModeEnabled = useFlowCoreValue('isEnabled');
  const pageWidthPx = useAppSelector(selectInfographWidthPx);
  const pageHeightPx = useAppSelector(selectInfographHeightPx);
  const scaledPageWidth = useMemo(() => `${pageWidthPx * zoom}px`, [pageWidthPx, zoom]);
  const scaledPageHeight = useMemo(() => `${pageHeightPx * zoom}px`, [pageHeightPx, zoom]);

  return isFlowModeEnabled ? (
    <Box
      className={PORT_CONTAINER_CLASS}
      pointerEvents='none'
      zIndex='port'
      position='relative'
      height='100%'
      marginRight={0}
    >
      <Box
        display='block'
        position='relative'
        top={0}
        left={0}
        width={scaledPageWidth}
        height={scaledPageHeight}
        pointerEvents='none'
      >
        <LineCreator zoom={zoom} />
        <LineConnector zoom={zoom} />
        <NodeCreatorModal zoom={zoom} />
      </Box>
    </Box>
  ) : null;
}

export default memo(PortRenderer);
