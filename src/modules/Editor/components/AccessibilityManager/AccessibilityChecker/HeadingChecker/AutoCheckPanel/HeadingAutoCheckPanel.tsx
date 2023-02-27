import { ReactElement } from 'react';
import { useTranslation } from 'react-i18next';
import { Box, Flex, ListItem, Text, UnorderedList } from '@chakra-ui/react';

import { PageId, WidgetId } from '../../../../../../../types/idTypes';
import { CollapsibleBox } from '../../../../../../common/components/CollapsibleBox';
import { InvalidWidgetItem } from './InvalidWidgetItem';
import { ReactComponent as ErrorIcon } from '../../../../../../../assets/icons/a11ymenu_error.svg';
import { ReactComponent as OkIcon } from '../../../../../../../assets/icons/a11ymenu_status_ok.svg';
import { TextWidgetTag } from '../../../../../../../widgets/TextBasedWidgets/common/TextBasedWidgets.types';
import { CheckDescriptionText, ReScan } from '../../common';

type SelectionTarget = {
  widgetId: WidgetId;
  pageId: PageId;
};

interface HeadingAutoCheckPanelProps {
  invalidWidgets?: { pageId: PageId; widgetId: WidgetId }[];
  dispatchSelectWidget: ({ widgetId, pageId }: SelectionTarget) => void;
  dispatchUpdateWidgetTag: (tag: TextWidgetTag) => void;
  rescanDocument: () => void;
  removeInvalidWidgetFromList: (widgetId: WidgetId) => void;
}

export const HeadingAutoCheckPanel = ({
  invalidWidgets,
  dispatchSelectWidget,
  dispatchUpdateWidgetTag,
  rescanDocument,
  removeInvalidWidgetFromList,
}: HeadingAutoCheckPanelProps): ReactElement => {
  const { t } = useTranslation('editor_accessibility_menu', {
    keyPrefix: 'accessibilityMenu.headings',
    useSuspense: false,
  });

  return invalidWidgets && invalidWidgets.length > 0 ? (
    <CollapsibleBox
      p={0}
      titleIcon={<ErrorIcon />}
      isOpenOnMount={true}
      variant={'plain'}
      title={t('autoCheckLabelError', { count: invalidWidgets.length })}
      collapseAriaLabel={'expand/collapse heading order auto-check panel'}
    >
      <Box ml={6}>
        <CheckDescriptionText mt={2} mb={1}>
          {t('autoCheckDescription')}
        </CheckDescriptionText>
        <UnorderedList>
          {t('autoCheckText', { returnObjects: true }).map((text, i) => (
            <ListItem key={i}>
              <CheckDescriptionText>{text}</CheckDescriptionText>
            </ListItem>
          ))}
        </UnorderedList>
      </Box>
      <Box ml={6} mt={3}>
        {invalidWidgets.map(({ widgetId, pageId }) => {
          return (
            <InvalidWidgetItem
              key={widgetId}
              widgetId={widgetId}
              pageId={pageId}
              dispatchSelectWidget={dispatchSelectWidget}
              dispatchUpdateWidgetTag={dispatchUpdateWidgetTag}
              removeInvalidWidgetFromList={removeInvalidWidgetFromList}
            />
          );
        })}
      </Box>
      <ReScan onClick={rescanDocument} buttonAriaLabel={'refresh the heading checker'}>
        {t('rescanDoc')}
      </ReScan>
    </CollapsibleBox>
  ) : (
    <Flex alignItems={'center'} py={2}>
      <OkIcon width={'16px'} height={'16px'} fill={'var(--vg-colors-green-500)'} />
      <Text ml={2} fontSize={'xs'}>
        {t('autoCheckSuccess')}
      </Text>
    </Flex>
  );
};
