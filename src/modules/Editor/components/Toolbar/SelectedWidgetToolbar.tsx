import { ReactElement } from 'react';
import { Flex } from '@chakra-ui/react';

import { useFocus } from '../Focus';
import { selectActiveWidgets } from '../../store/widgetSelector';
import { useAppSelector } from '../../store';

export const SelectedWidgetToolbar = (): ReactElement => {
  const activeWidgets = useAppSelector(selectActiveWidgets);

  const { widgetToolbarPortalRef } = useFocus();
  const isSingleWidgetSelected = activeWidgets.length === 1;

  return <Flex>{isSingleWidgetSelected ? <div ref={widgetToolbarPortalRef} /> : null}</Flex>;
};
