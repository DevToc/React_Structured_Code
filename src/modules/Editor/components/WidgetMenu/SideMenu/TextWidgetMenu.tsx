import { ReactElement, useState } from 'react';
import { Text, Flex, Button, Collapse, Link } from '@chakra-ui/react';
import styled from '@emotion/styled';

import { useAppSelector, useAppDispatch } from '../../../store/hooks';
import { selectZoom } from '../../../store/selectEditorSettings';
import { selectInfographWidthPx } from 'modules/Editor/store/infographSelector';
import { addNewWidget } from '../../../store';
import {
  TextTagStyleConfig,
  DefaultTextType,
} from '../../../../../widgets/TextBasedWidgets/TextWidget/TextWidget.types';
import { generateDefaultData } from '../../../../../widgets/TextBasedWidgets/TextWidget/TextWidget.helpers';
import { TEXT_TAG_TO_STYLES_MAP } from '../../../../../widgets/TextBasedWidgets/common/TextBasedWidgets.config';
import { Toggletip } from '../../../../common/components/Toggletip';
import { ReactComponent as OutlineInfoIcon } from '../../../../../assets/icons/outline_info.svg';
import { ReactComponent as ChevronUpIcon } from '../../../../../assets/icons/chevron_up.svg';
import { ReactComponent as ChevronDownIcon } from '../../../../../assets/icons/chevron_down.svg';
import { HEADINGS_HELP_LINK } from '../../../../../constants/links';
import { Mixpanel } from '../../../../../libs/third-party/Mixpanel/mixpanel';
import { TEXT_CREATED } from '../../../../../constants/mixpanel';
import { calculateInitialTopPx, INITIAL_LEFTPX_RATIO } from 'utils/calculateInitialWidgetPos';

interface TextButtonProps {
  type: DefaultTextType;
  style: TextTagStyleConfig;
  onComplete?: () => void;
}

const StyledOutlineInfoIcon = styled(OutlineInfoIcon)`
  & path {
    stroke: var(--vg-colors-upgrade-blue-500) !important;
  }
`;

const HeadingsTooltipContent = () => (
  <>
    <Text size={'sm'} mb={2} textAlign={'left'}>
      Use different heading levels to structure your document and make it accessible to screen readers.
    </Text>
    <Link variant={'inline-dark'} w={'fit-content'} href={HEADINGS_HELP_LINK} isExternal>
      Learn more.
    </Link>
  </>
);

const TextButton = ({ type, style, onComplete }: TextButtonProps): ReactElement => {
  const { fontFamily, isBold, isItalic, fontSize, color } = style;
  const dispatch = useAppDispatch();
  const zoom = useAppSelector(selectZoom);
  const infographWidthPx = useAppSelector(selectInfographWidthPx);

  const doAddTextWidget = () => {
    const initialTopPx = calculateInitialTopPx(zoom);
    const initialLeftPx = INITIAL_LEFTPX_RATIO * infographWidthPx;
    const textWidget = generateDefaultData(type, undefined, undefined, { topPx: initialTopPx, leftPx: initialLeftPx });

    dispatch(addNewWidget(textWidget));

    Mixpanel.track(TEXT_CREATED, {
      from: 'Left Panel',
      text_style: type.replace(type[0], type[0].toUpperCase()),
    });

    if (typeof onComplete === 'function') onComplete();
  };

  return (
    <Button
      variant='ghost'
      onClick={doAddTextWidget}
      _hover={{ bg: 'hover.gray' }}
      justifyContent='flex-start'
      px={2}
      py={7}
      border='1px solid var(--vg-colors-divider-gray)'
      data-tag-type={type}
    >
      <Text
        as='span'
        p={3}
        fontFamily={fontFamily}
        fontWeight={isBold ? 'bold' : 'normal'}
        fontStyle={isItalic ? 'italic' : 'normal'}
        color={color}
        fontSize={`${fontSize}px`}
        textTransform={'capitalize'}
      >
        {type}
      </Text>
    </Button>
  );
};

interface TextWidgetMenuProps {
  onComplete?: () => void;
}

export const TextWidgetMenu = ({ onComplete }: TextWidgetMenuProps): ReactElement => {
  const [isCollapsed, setIsCollapsed] = useState<boolean>(true);

  const toggleCollapse = () => setIsCollapsed(!isCollapsed);

  return (
    <Flex gap='8px' direction='column' p={4}>
      {/* HEADING */}
      <Flex fontSize='sm' fontWeight='md' pb='2'>
        <Text mr={2}>Headings and Paragraph</Text>
        <Toggletip
          hasArrow={true}
          placement={'right'}
          icon={<StyledOutlineInfoIcon />}
          buttonAriaLabel={'Headings and Paragraph Tooltip'}
        >
          <HeadingsTooltipContent />
        </Toggletip>
      </Flex>

      {/* WIDGET STYLES */}
      <TextButton type={'title'} style={TEXT_TAG_TO_STYLES_MAP['title']} onComplete={onComplete} />
      <TextButton type={'subtitle'} style={TEXT_TAG_TO_STYLES_MAP['subtitle']} onComplete={onComplete} />
      <TextButton type={'heading 1'} style={TEXT_TAG_TO_STYLES_MAP['heading 1']} onComplete={onComplete} />
      <TextButton type={'heading 2'} style={TEXT_TAG_TO_STYLES_MAP['heading 2']} onComplete={onComplete} />
      <TextButton type={'heading 3'} style={TEXT_TAG_TO_STYLES_MAP['heading 3']} onComplete={onComplete} />

      {/* COLLAPSED STYLES */}
      <Collapse in={!isCollapsed} animateOpacity>
        <Flex gap='8px' direction='column'>
          <TextButton type={'heading 4'} style={TEXT_TAG_TO_STYLES_MAP['heading 4']} onComplete={onComplete} />
          <TextButton type={'heading 5'} style={TEXT_TAG_TO_STYLES_MAP['heading 5']} onComplete={onComplete} />
          <TextButton type={'heading 6'} style={TEXT_TAG_TO_STYLES_MAP['heading 6']} onComplete={onComplete} />
        </Flex>
      </Collapse>

      <TextButton type={'paragraph'} style={TEXT_TAG_TO_STYLES_MAP['paragraph']} onComplete={onComplete} />
      <Button
        onClick={toggleCollapse}
        rightIcon={isCollapsed ? <ChevronDownIcon /> : <ChevronUpIcon />}
        variant={'link'}
        size={'xs'}
        sx={{
          '& path': {
            stroke: 'var(--vg-colors-upgrade-blue-500)',
          },
        }}
      >
        {isCollapsed ? 'Show more' : 'Show less'}
      </Button>
    </Flex>
  );
};
