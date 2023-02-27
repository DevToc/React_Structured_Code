import { ComponentProps, ReactElement } from 'react';
import { Box, Divider, Flex, Grid, Text } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import { useAppDispatch, useAppSelector } from 'modules/Editor/store';
import { setColorVisionMode } from 'modules/Editor/store/editorSettingsSlice';
import { selectColorVisionMode } from 'modules/Editor/store/editorSettingsSelector';
import { ColorVisionMode } from 'modules/Editor/store/editorSettingsSlice.types';
import { ColorVisualIcon } from 'modules/common/components/ColorVisualIcon';

type ImpairmentContainerProps = {
  type: ColorVisionMode;
  title: string;
  description: string;
  colors: string[];
  colorFilter?: string;
};

const ImpairmentContainer = ({ type, title, description, colors, colorFilter }: ImpairmentContainerProps) => {
  const dispatch = useAppDispatch();
  const colorVisionMode = useAppSelector(selectColorVisionMode);
  const isActive = colorVisionMode === type && colorVisionMode !== ColorVisionMode.none;
  const style = {
    _hover: {
      backgroundColor: 'hover.gray',
      borderInlineStartColor: isActive ? 'upgrade.blue.700' : 'gray.50',
      cursor: 'pointer',
    },
    border: '1px',
    borderRadius: 'base',
    boxShadow: '0px 0px 4px rgba(0, 0, 0, 0.24)',
    borderColor: isActive ? 'upgrade.blue.700' : 'gray.50',
    background: isActive ? '#EBF3FC' : 'none',
  };
  const toggleColorVisionMode = () => {
    const colorVision = isActive ? ColorVisionMode.none : type;
    dispatch(setColorVisionMode(colorVision));
  };
  return (
    <Flex
      as='button'
      aria-label={`${type} simulator`}
      direction='column'
      gap='3'
      padding='4'
      {...style}
      onClick={toggleColorVisionMode}
    >
      <ColorVisualIcon size='1.75rem' colors={colors} filter={colorFilter} />
      <Box textAlign='left'>
        <Text fontWeight='bold' fontSize='md'>
          {title}
        </Text>
        <Text fontSize='sm'>{description}</Text>
      </Box>
    </Flex>
  );
};

const SimulatorTab = (props: ComponentProps<typeof Box>): ReactElement => {
  const { t } = useTranslation('editor_accessibility_menu', {
    keyPrefix: 'accessibilityMenu.simulator',
    useSuspense: false,
  });
  const impairmentList = [
    {
      type: ColorVisionMode.achromatopsia,
      title: t('achromatopsia.title') as string,
      description: t('achromatopsia.description') as string,
      colors: ['#636363', '#656565', '#C5C5C5', '#686868'],
    },
    {
      type: ColorVisionMode.deuteranopia,
      title: t('deuteranopia.title') as string,
      description: t('deuteranopia.description') as string,
      colors: ['#0078CD', '#7E727D', '#FFC24C', '#9A731A'],
    },
    {
      type: ColorVisionMode.protanopia,
      title: t('protanopia.title') as string,
      description: t('protanopia.description') as string,
      colors: ['#2871E4', '#79756E', '#E6CC30', '#887933'],
    },
    {
      type: ColorVisionMode.tritanopia,
      title: t('tritanopia.title') as string,
      description: t('tritanopia.description') as string,
      colors: ['#008289', '#25818B', '#FFBAC4', '#D7484C'],
    },
    {
      type: ColorVisionMode.cataracts,
      title: t('cataracts.title') as string,
      description: t('cataracts.description') as string,
      colors: ['#6CA6DF', '#6CAFA8', '#ECCE81', '#D8927E'],
    },
    {
      type: ColorVisionMode.lowvision,
      title: t('lowvision.title') as string,
      description: t('lowvision.description') as string,
      colors: ['#008289', '#25818B', '#FFBAC4', '#D7484C'],
      colorFilter: 'blur(1px)',
    },
  ];

  return (
    <Flex direction='column' padding='4' gap='4' {...props}>
      <Flex direction='row' alignItems='center' justifyContent='space-between'>
        <Box>
          <Text fontWeight='bold' fontSize='md'>
            Regular Vision
          </Text>
          <Text fontSize='sm'>All primary colors can be distinguished</Text>
        </Box>
        <Box>
          <ColorVisualIcon size='1.5rem' />
        </Box>
      </Flex>
      <Divider orientation='horizontal' w='100%' h='1px' color='gray.100' />
      <Grid templateColumns='repeat(2, 1fr)' gap='1.25rem'>
        {impairmentList.map((impairment) => (
          <ImpairmentContainer key={impairment.type} {...impairment} />
        ))}
      </Grid>
    </Flex>
  );
};

export default SimulatorTab;
