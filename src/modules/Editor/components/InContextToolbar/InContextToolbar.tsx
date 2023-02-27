import { ReactElement, useRef } from 'react';
import { Flex } from '@chakra-ui/react';

import { useAppSelector } from 'modules/Editor/store';
import { selectActiveWidgets } from 'modules/Editor/store/widgetSelector';

import { SelectedWidgetToolbar } from './SelectedWidgetToolbar';

export const InContextToolbar = (): ReactElement => {
  const widgetMenuRef = useRef<HTMLDivElement | null>(null);
  const activeWidgets = useAppSelector(selectActiveWidgets);
  const hasActiveWidget = activeWidgets.length === 1;

  return <Flex ref={widgetMenuRef}>{hasActiveWidget && <SelectedWidgetToolbar />}</Flex>;
};
