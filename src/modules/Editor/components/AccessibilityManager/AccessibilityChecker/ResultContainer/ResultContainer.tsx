import { ComponentProps } from 'react';
import {
  Accordion,
  Box,
  Collapse,
  Flex,
  Icon,
  IconProps,
  SystemStyleObject,
  Text,
  useDisclosure,
} from '@chakra-ui/react';
import { StatusBanner } from './StatusBanner';
import { useAccessibilityChecker } from '../checker.hooks';
import { TAGS_ENABLED_CHECKERS } from 'modules/Editor/components/AccessibilityManager/AccessibilityManager.helpers';
import { createCheckerComponent, getGroupCheckers } from './ResultContainer.helpers';
import { useAppDispatch } from 'modules/Editor/store';
import { setShowTagOverlay } from 'modules/Editor/store/pageControlSlice';

import { ResultContainerProps } from './ResultContainer.types';
import { AccessibilityCheckers } from 'modules/Editor/components/AccessibilityManager/AccessibilityManager.types';

const CustomAccordionIcon = ({ isOpen, ...props }: { isOpen: boolean } & IconProps) => {
  const iconStyles: SystemStyleObject = {
    transform: isOpen ? 'rotate(-180deg)' : undefined,
    transition: 'transform 0.2s',
    transformOrigin: 'center',
  };

  return (
    <Icon viewBox='0 0 24 24' aria-hidden __css={iconStyles} {...props}>
      <path fill='currentColor' d='M16.59 8.59L12 13.17 7.41 8.59 6 10l6 6 6-6z' />
    </Icon>
  );
};

/**
 * A collapsable container uses within accordion
 * Note: Chakra Accordion not supported nested accordion
 *
 * @param props - Collapse component props
 * @returns
 */
const GroupCollapseBox = ({ children, title, ...props }: ComponentProps<typeof Box>) => {
  const { isOpen, onToggle } = useDisclosure({ defaultIsOpen: true });

  return (
    <Box>
      <Box
        as='button'
        w='100%'
        mb='2'
        aria-label='expand/collapse to display checker content'
        onClick={onToggle}
        {...props}
      >
        <Flex direction='row' justify='space-between' alignItems='center' p='1'>
          <Text
            as='span'
            justifySelf='left'
            fontSize='sm'
            lineHeight='var(--vg-lineHeights-5)'
            fontWeight='normal'
            color='black'
          >
            {title}
          </Text>
          <CustomAccordionIcon isOpen={isOpen} width='5' height='5' />
        </Flex>
      </Box>
      <Collapse in={isOpen}>{children}</Collapse>
    </Box>
  );
};

const ResultContainer = ({ thumbnailsRefs, scanDocument }: ResultContainerProps) => {
  const dispatch = useAppDispatch();
  const {
    state: { checkers },
  } = useAccessibilityChecker();
  const { autoCheckerGroup, manualReviewGroup, documentSettingGroup } = getGroupCheckers(checkers, {
    thumbnailsRefs,
  });

  /**
   * When accordion item selected and expanded, update `showTagOverlay` state
   * to hide the overlay tag for closed panel.
   *
   * Note: currently there is only one tag for text, but it may require changes
   * when there will be more tags.
   *
   * @param idx - Expanded item index
   */
  const handleAccordionChange = (idx: number) => {
    const checkerList = [autoCheckerGroup, manualReviewGroup, documentSettingGroup].flat();
    const checker = checkerList[idx];

    if (checker?.type && !TAGS_ENABLED_CHECKERS.includes(checker.type as AccessibilityCheckers)) {
      dispatch(setShowTagOverlay(false));
    }
  };

  return (
    <Accordion allowToggle defaultIndex={0} onChange={handleAccordionChange} w='100%' p='3'>
      <Flex direction='column' w='100%' gap={2}>
        <StatusBanner scanDocument={scanDocument} />
        <GroupCollapseBox w='100%' title='Fix auto-detected issues'>
          <Flex direction='column' w='100%' gap={2}>
            {autoCheckerGroup?.map(({ type, props }) => createCheckerComponent(type, props))}
          </Flex>
        </GroupCollapseBox>

        <GroupCollapseBox w='100%' title='Perform manual reviews'>
          <Flex direction='column' w='100%' gap={2}>
            {manualReviewGroup?.map(({ type, props }) => createCheckerComponent(type, props))}
          </Flex>
        </GroupCollapseBox>

        <GroupCollapseBox w='100%' title='Confirm document settings'>
          <Flex direction='column' w='100%' gap={2}>
            {documentSettingGroup?.map(({ type, props }) => createCheckerComponent(type, props))}
          </Flex>
        </GroupCollapseBox>
      </Flex>
    </Accordion>
  );
};

export { ResultContainer };
