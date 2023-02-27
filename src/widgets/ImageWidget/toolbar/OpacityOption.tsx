import { Box } from '@chakra-ui/react';
import { SliderPopover } from 'modules/common/components/ToolbarPopover';
import { useWidget } from 'widgets/sdk';
import { ImageWidgetData } from '../ImageWidget.types';

import { ReactComponent as OpacityIcon } from 'assets/icons/opacity.svg';

const LABEL = 'Opacity';

const OpacityOption = () => {
  const { opacity = 1, updateWidget } = useWidget<ImageWidgetData>();

  const onChangeOpacity = (newValue: number) => updateWidget({ opacity: newValue / 100 });

  return (
    <Box data-testid='opacity-option'>
      <SliderPopover
        value={Math.trunc(opacity * 100)}
        icon={<OpacityIcon />}
        label={LABEL}
        onChange={onChangeOpacity}
        suffix='%'
        max={100}
        title={LABEL}
      />
    </Box>
  );
};

export default OpacityOption;
