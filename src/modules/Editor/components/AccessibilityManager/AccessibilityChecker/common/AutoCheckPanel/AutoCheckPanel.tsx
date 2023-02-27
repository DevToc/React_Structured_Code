import { ReactElement } from 'react';
import { Box, Flex, Text } from '@chakra-ui/react';

import { PageId, WidgetId } from '../../../../../../../types/idTypes';
import { CollapsibleBox } from '../../../../../../common/components/CollapsibleBox';
import { InvalidWidgetItem } from './InvalidWidgetItem';
import { AllWidgetData } from '../../../../../../../widgets/Widget.types';

type SelectionTarget = {
  widgetId: WidgetId;
  pageId: PageId;
};

interface AutoCheckPanelProps {
  invalidWidgets?: { pageId: PageId; widgetId: WidgetId }[];
  removeInvalidWidgetFromList: (widgetId: WidgetId) => void;
  dispatchSelectWidget: ({ widgetId, pageId }: SelectionTarget) => void;
  label: string;
  IssueIcon?: any;
  ResolvedIcon?: any;
  translate: (key: string) => string;
  check: (widgetId: WidgetId, widgetData: AllWidgetData) => void;
}

export const AutoCheckPanel = ({
  invalidWidgets,
  removeInvalidWidgetFromList,
  dispatchSelectWidget,
  label,
  IssueIcon,
  ResolvedIcon,
  translate,
  check,
}: AutoCheckPanelProps): ReactElement => {
  const hasInvalidWidgets = invalidWidgets && invalidWidgets.length > 0;

  if (!!ResolvedIcon && !hasInvalidWidgets) {
    return (
      <Flex alignItems={'center'} mt={1}>
        <ResolvedIcon width={'16px'} height={'16px'} fill={'var(--vg-colors-green-500)'} />
        <Text ml={2} fontSize={'xs'}>
          {translate('autoCheckResolved')}
        </Text>
      </Flex>
    );
  }

  if (!IssueIcon) return <></>;

  return (
    <CollapsibleBox
      p={0}
      titleIcon={<IssueIcon />}
      isOpenOnMount={true}
      variant={'plain'}
      title={`${translate('autoCheckIssues')} (${invalidWidgets?.length})`}
      collapseAriaLabel={label}
    >
      <Box ml={6} mt={2}>
        {invalidWidgets?.map(({ widgetId, pageId }) => (
          <InvalidWidgetItem
            key={widgetId}
            widgetId={widgetId}
            pageId={pageId}
            removeInvalidWidgetFromList={removeInvalidWidgetFromList}
            dispatchSelectWidget={dispatchSelectWidget}
            check={check}
          />
        ))}
      </Box>
    </CollapsibleBox>
  );
};
