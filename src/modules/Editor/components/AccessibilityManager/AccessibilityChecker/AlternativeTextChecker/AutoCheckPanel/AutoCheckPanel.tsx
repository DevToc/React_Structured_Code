import { ReactElement } from 'react';
import { useTranslation } from 'react-i18next';
import { Box, Flex, Text } from '@chakra-ui/react';

import { PageId, WidgetId } from '../../../../../../../types/idTypes';
import { CollapsibleBox } from '../../../../../../common/components/CollapsibleBox';
import { InvalidWidgetItem } from './InvalidWidgetItem';
import { ReactComponent as ErrorIcon } from '../../../../../../../assets/icons/a11ymenu_error.svg';
import { ReactComponent as OkIcon } from '../../../../../../../assets/icons/a11ymenu_status_ok.svg';

type SelectionTarget = {
  widgetId: WidgetId;
  pageId: PageId;
};

interface AltTextAutoCheckPanelProps {
  invalidWidgets?: { pageId: PageId; widgetId: WidgetId }[];
  removeInvalidWidgetFromList: (widgetId: WidgetId) => void;
  dispatchSelectWidget: ({ widgetId, pageId }: SelectionTarget) => void;
}

export const AltTextAutoCheckPanel = ({
  invalidWidgets,
  removeInvalidWidgetFromList,
  dispatchSelectWidget,
}: AltTextAutoCheckPanelProps): ReactElement => {
  const { t } = useTranslation('editor_accessibility_menu', {
    keyPrefix: 'accessibilityMenu.alternativeText',
    useSuspense: false,
  });

  const hasInvalidWidgets = invalidWidgets && invalidWidgets.length > 0;

  if (!hasInvalidWidgets) {
    return (
      <Flex alignItems={'center'} py={2}>
        <OkIcon width={'16px'} height={'16px'} fill={'var(--vg-colors-green-500)'} />
        <Text ml={2} fontSize={'xs'}>
          {t('autoCheckResolved')}
        </Text>
      </Flex>
    );
  }

  return (
    <CollapsibleBox
      p={0}
      titleIcon={<ErrorIcon />}
      isOpenOnMount={true}
      variant={'plain'}
      title={`${t('autoCheckIssues')} (${invalidWidgets.length})`}
      collapseAriaLabel={'expand/collapse alt text auto-check panel'}
    >
      <Box ml={6} mt={2}>
        {invalidWidgets.map(({ widgetId, pageId }) => (
          <InvalidWidgetItem
            key={widgetId}
            widgetId={widgetId}
            pageId={pageId}
            removeInvalidWidgetFromList={removeInvalidWidgetFromList}
            dispatchSelectWidget={dispatchSelectWidget}
          />
        ))}
      </Box>
    </CollapsibleBox>
  );
};
