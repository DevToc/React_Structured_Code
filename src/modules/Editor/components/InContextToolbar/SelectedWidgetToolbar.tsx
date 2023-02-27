import { ReactElement } from 'react';
import { Flex } from '@chakra-ui/react';

import { selectActiveWidgets } from 'modules/Editor/store/widgetSelector';
import { useAppSelector } from 'modules/Editor/store';
import { useFocus } from '../Focus';

export const SelectedWidgetToolbar = (): ReactElement => {
  const activeWidgets = useAppSelector(selectActiveWidgets);
  const { widgetToolbarPortalRef } = useFocus();
  const isSingleWidgetSelected = activeWidgets.length === 1;
  return <Flex>{isSingleWidgetSelected && <div ref={widgetToolbarPortalRef} />}</Flex>;
};
