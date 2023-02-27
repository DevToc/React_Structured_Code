import { ReactElement } from 'react';
import { Flex, IconButton, Tooltip, Select, Text } from '@chakra-ui/react';

import { useWidget, useEditor } from 'widgets/sdk';
import { useIcon } from 'hooks/useIcon';
import { ColorPicker } from 'modules/Editor/components/ColorPicker';
import { AltTextMenu } from 'modules/Editor/components/Toolbar/AltTextMenu/AltTextMenu';
import { SliderPopover } from 'modules/common/components/ToolbarPopover';
import { ToolbarDivider } from 'modules/common/components/Toolbar/ToolbarDivider';
import { IconWidgetData, IconWidgetType } from './IconWidget.types';
import { getHeightOfGrid, getHeightOfGap } from './IconWidget.helpers';
import { NR_OF_ICONS, DEFAULT_NR_ICONS, DEFAULT_GRID_GAP_PX, MAX_GAP_PX } from './IconWidget.config';

import { ReactComponent as MirrorIcon } from 'assets/icons/switch.svg';
import { ReactComponent as FillIcon } from 'assets/icons/drop.svg';
import { ReplaceMenuButton } from 'widgets/sdk/ReplaceMenuButton';

export const IconWidgetToolbarMenu = (): ReactElement => {
  const { type = IconWidgetType.Single } = useWidget<IconWidgetData>();

  return type === IconWidgetType.Single ? <SingleIconToolbar /> : <GridIconToolbar />;
};

const SingleIconToolbar = () => {
  const { iconId, widgetId } = useWidget<IconWidgetData>();
  const { data: iconData } = useIcon(iconId);

  const iconHasColorMenu = iconData && typeof iconData.color === 'number' && !iconData.color;

  return (
    <Flex mr='8px' gap='8px' align='center'>
      <IconMirrorMenu />
      {iconHasColorMenu && <IconColorMenu />}
      <ReplaceMenuButton />
      <ToolbarDivider />
      <AltTextMenu widgetId={widgetId} />
    </Flex>
  );
};

const GridIconToolbar = () => {
  return (
    <Flex mr='8px' gap='8px' align='center'>
      <FillColorOne label='Data Color' />
      <FillColorTwo label='Non-Data Color' />
      <ToolbarDivider />
      <TotalItems />
      <ToolbarDivider />
      <GridGap />
      <ToolbarDivider />
      <ReplaceMenuButton />
    </Flex>
  );
};

const GridGap = () => {
  const { updateWidget, widgetId, gridGapPx = DEFAULT_GRID_GAP_PX } = useWidget<IconWidgetData>();
  const { boundingBox } = useEditor();

  const onChangeGridGap = (newGridGapPx: number) => {
    if (newGridGapPx === gridGapPx) return;

    const newHeightPx = getHeightOfGap(widgetId, newGridGapPx);
    updateWidget({ gridGapPx: newGridGapPx, heightPx: newHeightPx });
    // widget dimensions have changed update the bounding box rect
    setTimeout(() => boundingBox.updateRect(), 0);
  };

  return (
    <SliderPopover
      value={gridGapPx}
      onChange={onChangeGridGap}
      max={MAX_GAP_PX}
      title='Icon Spacing'
      buttonTitle='Spacing'
    />
  );
};

const TotalItems = () => {
  const { numberOfIcons = DEFAULT_NR_ICONS, updateWidget, widgetId } = useWidget<IconWidgetData>();
  const { boundingBox } = useEditor();

  const selectId = 'icon-grid-select';

  const onChangeIconNumber = (e: React.FormEvent<HTMLSelectElement>) => {
    const target = e.target as HTMLSelectElement;
    const newNumberOfIcons = Number(target.value);
    if (!newNumberOfIcons || newNumberOfIcons === numberOfIcons) return;

    const heightPx = getHeightOfGrid(widgetId, newNumberOfIcons);

    updateWidget({ numberOfIcons: newNumberOfIcons, heightPx });
    // widget dimensions have changed update the bounding box rect
    setTimeout(() => boundingBox.updateRect(), 0);
  };

  return (
    <>
      <Text as='label' htmlFor={selectId} fontSize='sm'>
        Total Items
      </Text>
      <Select
        width='16'
        id={selectId}
        value={numberOfIcons}
        onChange={onChangeIconNumber}
        data-allow-global-event
        size='sm'
      >
        {NR_OF_ICONS.map((value) => (
          <option key={`number-of-icons-${value}`} value={value}>
            {value}
          </option>
        ))}
      </Select>
    </>
  );
};

const IconMirrorMenu = (): ReactElement | null => {
  const { isMirrored, updateWidget } = useWidget<IconWidgetData>();
  const onUpdateIconMirror = () => updateWidget({ isMirrored: !isMirrored });

  if (typeof isMirrored !== 'boolean') return null;

  return (
    <Tooltip hasArrow placement='bottom' label='Mirror' bg='black'>
      <IconButton
        onClick={onUpdateIconMirror}
        size='sm'
        aria-label='Mirror Icon'
        variant='icon-btn-toolbar-option'
        icon={<MirrorIcon />}
      />
    </Tooltip>
  );
};

const IconColorMenu = (): ReactElement => {
  const { updateWidget, shapeFill } = useWidget<IconWidgetData>();

  const onUpdateShapeFill = (newShapeFill: number) => updateWidget({ shapeFill: newShapeFill });
  const hasSecondaryColorFill = shapeFill > 0;

  return (
    <>
      <FillPercentOption value={shapeFill} onChange={onUpdateShapeFill} />
      <FillColorOne />
      {hasSecondaryColorFill && <FillColorTwo />}
    </>
  );
};

const FillColorOne = ({ label = 'Color one' }: { label?: string }) => {
  const { updateWidget, shapeColorOne } = useWidget<IconWidgetData>();
  const onUpdateColorOne = (newShapeColorOne: string) => updateWidget({ shapeColorOne: newShapeColorOne });

  return <ColorPicker color={shapeColorOne} label='Color one' onChange={onUpdateColorOne} showNoColorOption={false} />;
};

const FillColorTwo = ({ label = 'Color two' }: { label?: string }) => {
  const { updateWidget, shapeColorTwo } = useWidget<IconWidgetData>();
  const onUpdateColorTwo = (newShapeColorTwo: string) => updateWidget({ shapeColorTwo: newShapeColorTwo });

  return <ColorPicker color={shapeColorTwo} label='Color two' onChange={onUpdateColorTwo} showNoColorOption={false} />;
};

const FillPercentOption = ({ value, onChange }: { value: number; onChange: (f: number) => void }) => (
  <SliderPopover
    value={value}
    icon={<FillIcon />}
    label={'Color Fill'}
    onChange={onChange}
    suffix={'%'}
    max={100}
    title={'Color Fill'}
  />
);
