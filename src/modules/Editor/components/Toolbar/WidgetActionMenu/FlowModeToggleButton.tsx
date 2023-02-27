import { IconButton, Tooltip } from '@chakra-ui/react';
import { useCallback } from 'react';

import { ReactComponent as CubeTransparent } from 'assets/icons/cube_transparent.svg';
import { useFlowCoreValue, useSetFlowCoreState } from 'modules/Editor/components/FlowCore';

// NOTE: [JB] This component is for rendering the temporary button to toggle flow mode. It will be removed
export const FlowModeToggleButton = () => {
  const isEnabled = useFlowCoreValue('isEnabled');
  const setIsEnabled = useSetFlowCoreState('setIsEnabled');

  const label = `[BETA] Toggle Flow Mode - ${isEnabled ? 'ON' : 'OFF'}`;

  const toggleFlowMode = useCallback(() => {
    setIsEnabled(!isEnabled);
  }, [setIsEnabled, isEnabled]);

  return (
    <Tooltip hasArrow placement='bottom' label={label} bg='black'>
      <IconButton
        data-testid={'flowmode-toggle-button'}
        size='sm'
        aria-label={label}
        backgroundColor={isEnabled ? 'blue.100' : 'gray.50'}
        _hover={{
          backgroundColor: 'blue.100',
        }}
        _active={{
          backgroundColor: 'blue.200',
        }}
        color={isEnabled ? 'red.600' : 'gray.400'}
        icon={<CubeTransparent />}
        onClick={toggleFlowMode}
      />
    </Tooltip>
  );
};
