import { ReactElement, Suspense, useMemo } from 'react';

import {
  Button,
  Drawer,
  DrawerOverlay,
  DrawerContent,
  DrawerHeader,
  DrawerBody,
  Flex,
  IconButton,
  Box,
  Text,
  useDisclosure,
} from '@chakra-ui/react';

import { useWindowSize } from 'hooks/useWindowSize';

import { AltTextMenu } from 'modules/Editor/components/Toolbar/AltTextMenu/AltTextMenu';
import { BasicShapeWidgetData, BorderStyle } from './BasicShapeWidget.types';
import { DEFAULT_BORDER_WIDTH, DEFAULT_SECONDARY_FILL_COLOR } from './BasicShapeWidget.config';
import { ToolbarDivider } from 'modules/common/components/Toolbar/ToolbarDivider';
import { SliderNumberInput } from 'modules/common/components/Input/SliderNumberInput';
import { ColorPickerInContext } from 'modules/Editor/components/ColorPicker';
import { useWidget } from 'widgets/sdk';

import { ReactComponent as BorderStyleIcon } from 'assets/icons/border_style.svg';
import { ReactComponent as LineWidthIcon } from 'assets/icons/line_width.svg';
import { ReactComponent as HorizontalMirrorIcon } from 'assets/icons/mirror_horizontal.svg';
import { ReactComponent as VerticalMirrorIcon } from 'assets/icons/mirror_vertical.svg';
import { ReactComponent as SolidLineIcon } from 'assets/icons/solid_line.svg';
import { ReactComponent as DashedLineIcon } from 'assets/icons/dashed_line.svg';
import { ReactComponent as DottedLineIcon } from 'assets/icons/dotted_line.svg';
import { ReactComponent as FillIcon } from 'assets/icons/drop.svg';
import { ReactComponent as CloseIcon } from 'assets/icons/close_circle.svg';

const COLOR_ICON_SIZE = 5;
const TRIGGER_BUTTON_SIZE = 8;

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

interface DefaultTriggerProps {
  onClick: () => void;
}
type IconStyle = 'fill' | 'border' | 'text';

interface Props extends DefaultTriggerProps {
  iconStyle: IconStyle;
  color: string;
}

export const BasicShapeWidgetToolbarMenuMobile = (): ReactElement => {
  const { deviceWidth } = useWindowSize();

  return (
    <>
      <Flex w={deviceWidth - 15} p='10px' gap='8px' align='center' data-testid='basic-shape-widget-toolbar'>
        <Fill />
        <BorderColorOption />

        <ToolbarDivider height={10} />
        <MirrorOptions />
        <ToolbarDivider height={10} />

        <BorderWidthOption />
        <BorderStyleOption />

        <ToolbarDivider height={10} />
        <AltTextMenuWrapper />
      </Flex>
    </>
  );
};

const AltTextMenuWrapper = () => {
  const { widgetId } = useWidget<BasicShapeWidgetData>();

  return (
    <Box //
      mr='5px'
      p='10px 10px'
      as='div'
      style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}
    >
      <Box w='75px' as='div'>
        <AltTextMenu widgetId={widgetId} />
      </Box>
    </Box>
  );
};

const Fill = () => {
  const { fillColor, fillPercent, updateWidget } = useWidget<BasicShapeWidgetData>();
  const { isOpen: isColorFillOpen, onToggle: toggleColorFill } = useDisclosure();
  const { isOpen: isFillColorOpen, onToggle: toggleFillColor } = useDisclosure();
  const { isOpen: isFillColorTwoOpen, onToggle: toggleFillColorTwo } = useDisclosure();

  const colorFillTriggerProps: DefaultTriggerProps = useMemo(
    () => ({
      onClick: toggleFillColor,
    }),
    [toggleFillColor],
  );

  const colorFillTwoTriggerProps: DefaultTriggerProps = useMemo(
    () => ({
      onClick: toggleFillColorTwo,
    }),
    [toggleFillColorTwo],
  );

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

  return (
    <>
      <Box
        onClick={() => toggleColorFill()}
        mr='5px'
        p='10px 10px'
        as='div'
        style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}
      >
        <IconButton mb='10px' size='sm' aria-label='Font Icon' icon={<FillIcon />} />
        <Box w='75px' as='div'>
          <Text fontSize={10} style={{ fontWeight: 700 }} align='center'>
            Color Fill %
          </Text>
        </Box>
      </Box>

      <Box
        onClick={() => toggleFillColor()}
        mr='5px'
        p='10px 10px'
        as='div'
        style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}
      >
        <DefaultTrigger iconStyle='fill' color={fillColor[0]} {...colorFillTriggerProps} />

        <Box w='75px' as='div'>
          <Text fontSize={10} style={{ fontWeight: 700 }} align='center'>
            Fill Color
          </Text>
        </Box>
      </Box>

      {hasSecondaryColorFill && (
        <Box
          onClick={() => toggleFillColorTwo()}
          mr='5px'
          p='10px 10px'
          as='div'
          style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}
        >
          <DefaultTrigger iconStyle='fill' color={fillColor[1]} {...colorFillTwoTriggerProps} />

          <Box w='75px' as='div'>
            <Text fontSize={10} style={{ fontWeight: 700 }} align='center'>
              Fill Color Two
            </Text>
          </Box>
        </Box>
      )}

      <Drawer placement='bottom' onClose={toggleColorFill} isOpen={isColorFillOpen}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerHeader borderBottomWidth='1px'>
            <Flex align='center' justify='space-between'>
              <p>Adjust Percentage</p>
              <CloseIcon onClick={toggleColorFill} />
            </Flex>
          </DrawerHeader>
          <DrawerBody>
            <Suspense fallback={<Box />}>
              <FillPercentOption value={fillPercent || 0} onChange={onUpdateFillPercent} />
            </Suspense>
          </DrawerBody>
        </DrawerContent>
      </Drawer>

      <Drawer placement='bottom' onClose={toggleFillColor} isOpen={isFillColorOpen}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerHeader borderBottomWidth='1px'>
            <Flex align='center' justify='space-between'>
              <p>Fill Color</p>
              <CloseIcon onClick={toggleFillColor} />
            </Flex>
          </DrawerHeader>
          <DrawerBody>
            <Suspense fallback={<Box />}>
              <ColorPickerInContext
                iconStyle='text'
                color={fillColor[0] ?? ''}
                label={'Fill Color'}
                onChange={onUpdatePrimaryFillColor}
                showNoColorOption={false}
              />
            </Suspense>
          </DrawerBody>
        </DrawerContent>
      </Drawer>

      <Drawer placement='bottom' onClose={toggleFillColorTwo} isOpen={isFillColorTwoOpen}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerHeader borderBottomWidth='1px'>
            <Flex align='center' justify='space-between'>
              <p>Fill Color Two</p>
              <CloseIcon onClick={toggleFillColorTwo} />
            </Flex>
          </DrawerHeader>
          <DrawerBody>
            <Suspense fallback={<Box />}>
              <ColorPickerInContext
                iconStyle='text'
                color={fillColor[1] ?? ''}
                label={'Fill Color Two'}
                onChange={onUpdateSecondaryFillColor}
                showNoColorOption={false}
              />
            </Suspense>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
};

const MirrorOptions = () => {
  const { updateWidget, mirror = {} } = useWidget<BasicShapeWidgetData>();

  const onUpdateMirrorVertical = (): void => updateWidget({ mirror: { isVertical: !mirror.isVertical } });
  const onUpdateMirrorHorizontal = (): void => updateWidget({ mirror: { isHorizontal: !mirror.isHorizontal } });

  return (
    <>
      <Box mr='5px' p='10px 10px' as='div' style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <IconButton
          mb='10px'
          onClick={onUpdateMirrorHorizontal}
          variant={'ghost'}
          isActive={mirror.isHorizontal}
          size='sm'
          aria-label={'Flip Horizontal'}
          icon={<HorizontalMirrorIcon />}
        />
        <Box w='75px' as='div'>
          <Text fontSize={10} style={{ fontWeight: 700 }} align='center'>
            Flip Horizontal
          </Text>
        </Box>
      </Box>

      <Box mr='5px' p='10px 10px' as='div' style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <IconButton
          mb='10px'
          onClick={onUpdateMirrorVertical}
          variant={'ghost'}
          isActive={mirror.isVertical}
          size='sm'
          aria-label={'Flip Vertical'}
          icon={<VerticalMirrorIcon />}
        />
        <Box w='75px' as='div'>
          <Text fontSize={10} style={{ fontWeight: 700 }} align='center'>
            Flip Vertical
          </Text>
        </Box>
      </Box>
    </>
  );
};

const BorderColorOption = () => {
  const {
    border: { color, width },
    updateWidget,
  } = useWidget<BasicShapeWidgetData>();
  const { isOpen: isBorderColorOpen, onToggle: toggleBorderColor } = useDisclosure();

  const borderColorTriggerProps: DefaultTriggerProps = useMemo(
    () => ({
      onClick: toggleBorderColor,
    }),
    [toggleBorderColor],
  );

  const onUpdateBorderColor = (borderColor: string): void => {
    const newBorder = {
      color: borderColor,
      ...(width === 0 && { width: DEFAULT_BORDER_WIDTH }),
    };
    updateWidget({ border: newBorder });
  };

  return (
    <>
      <Box
        onClick={() => toggleBorderColor()}
        mr='5px'
        p='10px 10px'
        as='div'
        style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}
      >
        <DefaultTrigger iconStyle='border' color={color} {...borderColorTriggerProps} />

        <Box w='75px' as='div'>
          <Text fontSize={10} style={{ fontWeight: 700 }} align='center'>
            Border Color
          </Text>
        </Box>
      </Box>

      <Drawer placement='bottom' onClose={toggleBorderColor} isOpen={isBorderColorOpen}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerHeader borderBottomWidth='1px'>
            <Flex align='center' justify='space-between'>
              <p>Border Color</p>
              <CloseIcon onClick={toggleBorderColor} />
            </Flex>
          </DrawerHeader>
          <DrawerBody>
            <Suspense fallback={<Box />}>
              <ColorPickerInContext
                iconStyle='text'
                color={color ?? ''}
                label={'Border Color'}
                onChange={onUpdateBorderColor}
                showNoColorOption={false}
              />
            </Suspense>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
  // return <ColorPicker color={color} onChange={onUpdateBorderColor} label={'Border Color'} iconStyle={'border'} />;
};

const BorderStyleOption = () => {
  const {
    border: { style },
    updateWidget,
  } = useWidget<BasicShapeWidgetData>();
  const { isOpen: isBorderStyleOpen, onToggle: toggleBorderStyle } = useDisclosure();

  const onUpdateBorderStyle = (style: any) => updateWidget({ border: { style: style || BorderStyle.Solid } });

  const selectedIndex = BORDER_STYLE_OPTIONS.findIndex((option) => option.value === style);

  const handleSelect = (e: React.SyntheticEvent<HTMLButtonElement>): void => {
    onUpdateBorderStyle(e.currentTarget.dataset.value);
  };

  return (
    <>
      <Box
        onClick={() => toggleBorderStyle()}
        mr='5px'
        p='10px 10px'
        as='div'
        style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}
      >
        <IconButton mb='10px' size='sm' aria-label='Border Style' icon={<BorderStyleIcon />} />
        <Box w='75px' as='div'>
          <Text fontSize={10} style={{ fontWeight: 700 }} align='center'>
            Border Style
          </Text>
        </Box>
      </Box>

      <Drawer placement='bottom' onClose={toggleBorderStyle} isOpen={isBorderStyleOpen}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerHeader borderBottomWidth='1px'>
            <Flex align='center' justify='space-between'>
              <p>Select Border Style</p>
              <CloseIcon onClick={toggleBorderStyle} />
            </Flex>
          </DrawerHeader>
          <DrawerBody>
            <Suspense fallback={<Box />}>
              <Box p={2}>
                {BORDER_STYLE_OPTIONS.map((opt, i) => (
                  <Button
                    leftIcon={opt.icon}
                    onClick={handleSelect}
                    data-value={opt.value}
                    size={'xs'}
                    key={opt.value}
                    isActive={i === selectedIndex}
                    variant={'toolbar-dropdown-item'}
                  >
                    {opt.label}
                  </Button>
                ))}
              </Box>
            </Suspense>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
};

const BorderWidthOption = () => {
  const {
    border: { width },
    updateWidget,
  } = useWidget<BasicShapeWidgetData>();
  const { isOpen: isBorderWidthOpen, onToggle: toggleBorderWidth } = useDisclosure();

  const onUpdateBorderWidth = (borderWidth: number) => updateWidget({ border: { width: borderWidth } });

  return (
    <>
      <Box
        onClick={() => toggleBorderWidth()}
        mr='5px'
        p='10px 10px'
        as='div'
        style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}
      >
        <IconButton mb='10px' size='sm' aria-label='Border Width' icon={<LineWidthIcon />} />
        <Box w='75px' as='div'>
          <Text fontSize={10} style={{ fontWeight: 700 }} align='center'>
            Border Width
          </Text>
        </Box>
      </Box>

      <Drawer placement='bottom' onClose={toggleBorderWidth} isOpen={isBorderWidthOpen}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerHeader borderBottomWidth='1px'>
            <Flex align='center' justify='space-between'>
              <p>Adjust Border Width</p>
              <CloseIcon onClick={toggleBorderWidth} />
            </Flex>
          </DrawerHeader>
          <DrawerBody>
            <Suspense fallback={<Box />}>
              <SliderNumberInput
                title={'Border Width'}
                value={width}
                onChange={onUpdateBorderWidth}
                suffix={'%'}
                sliderWidth={20}
                containerProps={{ p: 2, pt: 3 }}
              />
            </Suspense>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );

  /*
    <SliderPopover
      value={width}
      icon={<LineWidthIcon />}
      label={'Border Width'}
      onChange={onUpdateBorderWidth}
      suffix={'px'}
      max={20}
      title={'Width'}
    />
  */
};

const FillPercentOption = ({ value, onChange }: { value: number; onChange: (f: number) => void }) => {
  return (
    <SliderNumberInput
      title={'Color Fill'}
      value={value}
      onChange={onChange}
      suffix={'%'}
      sliderWidth={120}
      containerProps={{ p: 2, pt: 3 }}
    />
  );
};

const DefaultTrigger = ({ iconStyle, color, ...defaultTriggerProps }: Props) => {
  const isBorder = iconStyle === 'border';
  return (
    <Flex
      w={TRIGGER_BUTTON_SIZE}
      h={TRIGGER_BUTTON_SIZE}
      mb='10px'
      borderRadius='5px'
      as='button'
      transition='opacity 0.2s'
      _focus={{
        boxShadow: 'var(--vg-shadows-outline)',
        outline: 'none',
      }}
      _hover={{ bg: 'hover.gray' }}
      justifyContent='center'
      alignItems='center'
      background='#dbdbdb'
      {...defaultTriggerProps}
    >
      <Flex
        w={COLOR_ICON_SIZE}
        h={COLOR_ICON_SIZE}
        borderRadius='sm'
        background={color}
        border='1px solid var(--vg-colors-black-alpha-500)'
        justifyContent='center'
        alignItems='center'
      >
        {isBorder && <Box w={2} h={2} bg='white' boxShadow='0px 0px 0px 1px var(--vg-colors-black-alpha-500) inset' />}
      </Flex>
    </Flex>
  );
};
