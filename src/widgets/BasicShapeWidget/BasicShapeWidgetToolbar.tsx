import { ReactElement } from 'react';
import { Flex, IconButton, Tooltip } from '@chakra-ui/react';

import { SliderPopover, DropdownPopover } from 'modules/common/components/ToolbarPopover';
import { AltTextMenu } from 'modules/Editor/components/Toolbar/AltTextMenu/AltTextMenu';
import { BasicShapeWidgetData, BorderStyle } from './BasicShapeWidget.types';
import { DEFAULT_BORDER_WIDTH, DEFAULT_SECONDARY_FILL_COLOR } from './BasicShapeWidget.config';
import { ColorPicker } from 'modules/Editor/components/ColorPicker';
import { ToolbarDivider } from 'modules/common/components/Toolbar/ToolbarDivider';
import { useWidget } from 'widgets/sdk';

import { ReactComponent as BorderStyleIcon } from 'assets/icons/border_style.svg';
import { ReactComponent as LineWidthIcon } from 'assets/icons/line_width.svg';
import { ReactComponent as HorizontalMirrorIcon } from 'assets/icons/mirror_horizontal.svg';
import { ReactComponent as VerticalMirrorIcon } from 'assets/icons/mirror_vertical.svg';
import { ReactComponent as SolidLineIcon } from 'assets/icons/solid_line.svg';
import { ReactComponent as DashedLineIcon } from 'assets/icons/dashed_line.svg';
import { ReactComponent as DottedLineIcon } from 'assets/icons/dotted_line.svg';
import { ReactComponent as FillIcon } from 'assets/icons/drop.svg';

const BORDER_STYLE_OPTIONS = [
  {
    value: BorderStyle.Solid,
    label: 'Solid',
    icon: <SolidLineIcon />,
  },
  {
    value: BorderStyle.Dashed,
    label: 'Dashed',
    icon: <DashedLineIcon />,
  },
  {
    value: BorderStyle.Dotted,
    label: 'Dotted',
    icon: <DottedLineIcon />,
  },
];

export const BasicShapeWidgetToolbarMenu = (): ReactElement => {
  const { widgetId } = useWidget<BasicShapeWidgetData>();
  return (
    <Flex gap='2' align='center' data-testid='basic-shape-widget-toolbar'>
      <Fill />
      <BorderColorOption />

      <ToolbarDivider />
      <MirrorOptions />
      <ToolbarDivider />

      <BorderWidthOption />
      <BorderStyleOption />

      <ToolbarDivider ml={-3} />

      <AltTextMenu widgetId={widgetId} />
    </Flex>
  );
};

const Fill = () => {
  const { fillColor, fillPercent, updateWidget } = useWidget<BasicShapeWidgetData>();

  const onUpdatePrimaryFillColor = (newFillColor: string): void => {
    const widgetFillColor = { fillColor: [newFillColor] };
    if (fillColor[1]) widgetFillColor.fillColor.push(fillColor[1]);

    updateWidget(widgetFillColor);
  };

  const onUpdateSecondaryFillColor = (newFillColor: string): void => {
    const widgetFillColor = { fillColor: [fillColor[0], newFillColor] };
    updateWidget(widgetFillColor);
  };

  const onUpdateFillPercent = (newFillPercent: number) => {
    const widgetData: { fillPercent: number; fillColor?: string[] } = { fillPercent: newFillPercent };
    if (fillPercent === 0 && fillColor.length === 1) {
      widgetData.fillColor = [...fillColor, DEFAULT_SECONDARY_FILL_COLOR];
    }

    updateWidget(widgetData);
  };

  const hasSecondaryColorFill = fillColor[1] && fillPercent && fillPercent > 0 && fillPercent <= 100;
  const fillColorLabel = hasSecondaryColorFill ? 'Fill Color One' : 'Fill Color';
  const secondaryFillLabel = 'Fill Color Two';

  return (
    <>
      <FillPercentOption value={fillPercent || 0} onChange={onUpdateFillPercent} />
      <ColorPicker color={fillColor[0]} onChange={onUpdatePrimaryFillColor} label={fillColorLabel} />
      {hasSecondaryColorFill && (
        <ColorPicker color={fillColor[1]} onChange={onUpdateSecondaryFillColor} label={secondaryFillLabel} />
      )}
    </>
  );
};

const MirrorOptions = () => {
  const { updateWidget, mirror = {} } = useWidget<BasicShapeWidgetData>();

  const onUpdateMirrorVertical = (): void => updateWidget({ mirror: { isVertical: !mirror.isVertical } });
  const onUpdateMirrorHorizontal = (): void => updateWidget({ mirror: { isHorizontal: !mirror.isHorizontal } });

  return (
    <>
      <Tooltip hasArrow placement='bottom' label='Flip Horizontal' bg='black'>
        <IconButton
          aria-label={'Flip Horizontal'}
          icon={<HorizontalMirrorIcon />}
          size='sm'
          onClick={onUpdateMirrorHorizontal}
          variant={'ghost'}
        />
      </Tooltip>

      <Tooltip hasArrow placement='bottom' label='Flip Vertical' bg='black'>
        <IconButton
          aria-label={'Flip Vertical'}
          icon={<VerticalMirrorIcon />}
          size='sm'
          onClick={onUpdateMirrorVertical}
          variant={'ghost'}
        />
      </Tooltip>
    </>
  );
};

const BorderColorOption = () => {
  const {
    border: { color, width },
    updateWidget,
  } = useWidget<BasicShapeWidgetData>();

  const onUpdateBorderColor = (borderColor: string): void => {
    const newBorder = {
      color: borderColor,
      ...(width === 0 && { width: DEFAULT_BORDER_WIDTH }),
    };
    updateWidget({ border: newBorder });
  };

  return <ColorPicker color={color} onChange={onUpdateBorderColor} label={'Border Color'} iconStyle={'border'} />;
};

const BorderStyleOption = () => {
  const {
    border: { style },
    updateWidget,
  } = useWidget<BasicShapeWidgetData>();

  const onUpdateBorderStyle = (style: BorderStyle) => updateWidget({ border: { style: style || BorderStyle.Solid } });
  const selectedIndex = BORDER_STYLE_OPTIONS.findIndex((option) => option.value === style);

  return (
    <DropdownPopover
      selectedIndex={selectedIndex}
      options={BORDER_STYLE_OPTIONS}
      toolbarIcon={<BorderStyleIcon />}
      label={'Border Style'}
      onSelect={onUpdateBorderStyle}
    />
  );
};

const BorderWidthOption = () => {
  const {
    border: { width },
    updateWidget,
  } = useWidget<BasicShapeWidgetData>();

  const onUpdateBorderWidth = (borderWidth: number) => updateWidget({ border: { width: borderWidth } });

  return (
    <SliderPopover
      value={width}
      icon={<LineWidthIcon />}
      label={'Border Width'}
      onChange={onUpdateBorderWidth}
      suffix={'px'}
      max={20}
      title={'Width'}
    />
  );
};

const FillPercentOption = ({ value, onChange }: { value: number; onChange: (f: number) => void }) => {
  return (
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
};