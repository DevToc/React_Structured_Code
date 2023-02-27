import { Flex, Center, Button, Image, Text, Link } from '@chakra-ui/react';
import bgImage from '../../../../../assets/background/check_a11y_bg.png';
import { NAVBAR_HEIGHT } from '../../Navbar';
import { TOOLBAR_HEIGHT } from '../../Toolbar';
import { TABLIST_HEADER_HEIGHT } from '../AccessibilityManager.config';
import { useAccessibilityChecker } from './checker.hooks';
import { refreshChecker, toggleShowChecker } from './checker.actions';
import { INITIAL_CHECKER_HELP_LINK } from '../../../../../constants/links';
import { Mixpanel } from '../../../../../libs/third-party/Mixpanel/mixpanel';
import { ACCESSIBILITY_CHECKER, HELP_OPENED } from '../../../../../constants/mixpanel';

const MIN_CONTENT_HEIGHT = 320;
const TEXT_CONTENT_WIDTH = 228;
const PADDING = 20;

interface InfoContainerProps {
  scanDocument: () => void;
}

const InfoContainer = ({ scanDocument }: InfoContainerProps) => {
  const { dispatch } = useAccessibilityChecker();

  const checkDocument = () => {
    dispatch(refreshChecker());

    scanDocument();
    dispatch(toggleShowChecker());
  };
  const offsetHeight = NAVBAR_HEIGHT + TOOLBAR_HEIGHT + TABLIST_HEADER_HEIGHT + PADDING;

  const handleClickHelpLink = () => {
    Mixpanel.track(HELP_OPENED, {
      from: ACCESSIBILITY_CHECKER,
      help_type: 'About Document Accessibility',
    });
  };

  return (
    <Flex h={`calc(100vh - ${offsetHeight}px)`} alignItems='center'>
      <Flex
        mt={`-${offsetHeight / 2}px`}
        h={`${MIN_CONTENT_HEIGHT}px`}
        direction='column'
        minWidth='max-content'
        alignItems='center'
        gap='4'
      >
        <Center m='auto'>
          <Image src={bgImage} alt='check accessibility background' />
        </Center>
        <Text w={`${TEXT_CONTENT_WIDTH}PX`} fontSize='md' lineHeight='var(--vg-lineHeights-shorter)' textAlign='center'>
          Let's make your design accessible!
        </Text>
        <Button colorScheme='green' size='sm' p='4' borderRadius='4' onClick={checkDocument}>
          Check my design
        </Button>
        <Link
          variant='external'
          href={INITIAL_CHECKER_HELP_LINK}
          isExternal
          fontSize='xs'
          textAlign='center'
          onClick={handleClickHelpLink}
        >
          Why is accessibility important?
        </Link>
      </Flex>
    </Flex>
  );
};

export { InfoContainer };
