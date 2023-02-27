import { Flex, Box, Text, Button } from '@chakra-ui/react';
import { ReactComponent as CopyLinkIcon } from '../../../../../assets/icons/share_link.svg';
import { PHP_PROXY_API_DOMAIN } from '../../../../../constants/infograph';
import { useParams } from 'react-router-dom';
import { useToast } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import {
  ClickEventTracker,
  EventPropsBool,
  ShareMethod,
} from '../../../../common/components/ClickEventHandler/ClickEventWrapper';
import { EDITOR_VERSION, SHARE } from '../../../../../constants/mixpanel';

const SharePanel = () => {
  const { id } = useParams();
  const { t } = useTranslation('common_navbar');

  const sharePanelTestId = 'share-panel';

  const toast = useToast({
    position: 'bottom-left',
    containerStyle: {
      marginLeft: 150,
    },
  });

  const showCopySuccessToast = () => {
    toast({
      title: 'Link Copied!',
      status: 'success',
      duration: 3000,
      isClosable: false,
    });
  };

  const showCopyFailedToast = (description?: string) => {
    const descriptionObj = description ? { description } : null;
    toast({
      title: 'Failed to Copy Link',
      status: 'error',
      duration: 3000,
      isClosable: false,
      ...descriptionObj,
    });
  };

  const handleClick = () => {
    const shareLinkId = !!PHP_PROXY_API_DOMAIN && VenngageE2.privateLinkId ? VenngageE2.privateLinkId : id;
    if (!!shareLinkId) {
      const plPageUrl = `${window.location.host}/pl/${shareLinkId}`;
      navigator.clipboard.writeText(plPageUrl).then(
        () => {
          showCopySuccessToast();
        },
        () => {
          showCopyFailedToast();
        },
      );
    } else {
      showCopyFailedToast('share link is not available');
    }
  };

  return (
    <Flex flexDir={'column'} mt='4' mb='30' data-testid={sharePanelTestId}>
      <Text fontSize='sm' fontWeight='semibold' pb='2'>
        {t('modals.share-panel.link-share')}
      </Text>
      <Flex flexDir='row' justifyContent='space-between' alignItems='center'>
        <Box>
          <Text fontSize='xs'>{t('modals.share-panel.accessibility-text')}</Text>
          <Text fontSize='xs'>{t('modals.share-panel.view-only-text')}</Text>
        </Box>
        <ClickEventTracker
          eventProps={{
            name: SHARE,
            editor_version: EDITOR_VERSION,
            design_id: id,
            share_method: ShareMethod.PrivateLink,
            is_design_owner: EventPropsBool.true,
          }}
        >
          <Button
            onClick={handleClick}
            variant='action'
            h='8'
            px='3'
            py='1.5'
            mb='3'
            leftIcon={<CopyLinkIcon style={{ marginRight: 1 }} />}
          >
            {t('modals.share-panel.copy-link')}
          </Button>
        </ClickEventTracker>
      </Flex>
    </Flex>
  );
};

export default SharePanel;
