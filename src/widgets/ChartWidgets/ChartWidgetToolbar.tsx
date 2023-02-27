import React, { ReactElement } from 'react';
import { Flex } from '@chakra-ui/react';

import { ToolbarDivider } from 'modules/common/components/Toolbar/ToolbarDivider';
import { AltTextMenu } from 'modules/Editor/components/Toolbar/AltTextMenu/AltTextMenu';
import { SideMenuSettingsTrigger } from 'modules/Editor/components/SideMenuSettings/SideMenuSettingsTrigger';
import { useWidget } from 'widgets/sdk';
import ChartSwapper from 'widgets/ChartWidgets/DataTableChartCommon/ChartSwapper';

export const ChartWidgetToolbar = (): ReactElement => {
  const { widgetId } = useWidget();

  return (
    <Flex align='center' gap='2'>
      <ChartSwapper />
      <ToolbarDivider />
      <SideMenuSettingsTrigger>Edit Chart</SideMenuSettingsTrigger>
      <ToolbarDivider />
      <AltTextMenu widgetId={widgetId} />
    </Flex>
  );
};