import { ComponentProps, ReactElement } from 'react';
import { Box, Flex, Text } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import { ReactComponent as OkStatusIcon } from 'assets/icons/a11ymenu_status_ok.svg';
import { ReactComponent as NeedReviewStatusIcon } from 'assets/icons/a11ymenu_status_need_review.svg';
import { ReactComponent as FailStatusIcon } from 'assets/icons/status_fail.svg';
import { AccessibilityCheckerStatus } from '../../AccessibilityManager.types';

type StatusIconProps = { status: AccessibilityCheckerStatus } & ComponentProps<typeof Box>;

const StatusIconButton = ({ status, ...props }: StatusIconProps): ReactElement => {
  const { t } = useTranslation('editor_accessibility_menu', {
    keyPrefix: 'accessibilityMenu.statusIcon',
    useSuspense: false,
  });
  const iconDefaultSize = { width: '14px', height: '14px' };
  const gap = 1;
  const p = '0.25rem 0.5rem';
  const justifyContent = 'center';
  const alignItems = 'center';
  const borderRadius = 'base';

  const OkStatus = () => (
    <Flex
      direction='row'
      justifyContent={justifyContent}
      alignItems={alignItems}
      gap={gap}
      p={p}
      background='action-green.50'
      borderRadius={borderRadius}
    >
      <Text fontSize='xs' color='action-green.700'>
        {t('pass')}
      </Text>
      <OkStatusIcon {...iconDefaultSize} fill='action-green.700' />
    </Flex>
  );
  const FailStatus = () => (
    <Flex
      direction='row'
      justifyContent={justifyContent}
      alignItems={alignItems}
      gap={gap}
      p={p}
      background='red.50'
      borderRadius={borderRadius}
    >
      <Text fontSize='xs' color='red.700'>
        {t('fail')}
      </Text>
      <FailStatusIcon {...iconDefaultSize} fill='red.700' />
    </Flex>
  );
  const WarnStatus = () => (
    <Flex
      direction='row'
      justifyContent={justifyContent}
      alignItems={alignItems}
      gap={gap}
      p={p}
      background='gray.50'
      borderRadius={borderRadius}
    >
      <Text fontSize='xs' color='font.500'>
        {t('warn')}
      </Text>
      <NeedReviewStatusIcon {...iconDefaultSize} fill='font.500' />
    </Flex>
  );
  const ReviewedStatus = () => (
    <Flex
      direction='row'
      justifyContent={justifyContent}
      alignItems={alignItems}
      gap={gap}
      p={p}
      background='action-green.50'
      borderRadius={borderRadius}
    >
      <Text fontSize='xs' color='action-green.700'>
        {t('reviewed')}
      </Text>
      <OkStatusIcon {...iconDefaultSize} fill='action-green.700' />
    </Flex>
  );

  return (
    <Box {...props}>
      {status === AccessibilityCheckerStatus.ok && <OkStatus />}
      {status === AccessibilityCheckerStatus.fail && <FailStatus />}
      {status === AccessibilityCheckerStatus.warn && <WarnStatus />}
      {status === AccessibilityCheckerStatus.reviewed && <ReviewedStatus />}
    </Box>
  );
};

export { StatusIconButton };
