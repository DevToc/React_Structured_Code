import { ReactElement, Suspense, useMemo } from 'react';
import { Box, Flex, Spinner } from '@chakra-ui/react';
import { useIcon, IconApiResponse } from 'hooks/useIcon';
import {
  useWidget,
  WidgetToolbar,
  WidgetBase,
  ReadOnlyWidgetBase,
  WidgetBaseProp,
  TransparentImg,
  useEditor,
} from 'widgets/sdk';
import { IconWidgetData, IconWidgetType, FillDirection } from './IconWidget.types';
import { DEFAULT_NR_ICONS, DEFAULT_GRID_ITEM_SIZE_PX, DEFAULT_GRID_GAP_PX } from './IconWidget.config';
import { getIconGridArr, getIconGridId } from './IconWidget.helpers';
import { Icon } from './Icon';
import { useIconResize } from './useIconResize';
import { useDynamicImport } from 'hooks/useDynamicImport';
import { WidgetComponentsMap } from 'widgets/components.lazy';

export const IconWidget = (): ReactElement => {
  const { customOnResize, customOnResizeStart, customOnResizeEnd } = useIconResize();
  const { openReplaceWidgetMenu } = useEditor();

  const onDoubleClick = () => openReplaceWidgetMenu();

  const ResponsiveComponent = (name: string): ReactElement => {
    const Component = useDynamicImport(name, WidgetComponentsMap);
    return (
      <Suspense fallback={<Spinner />}>
        <Component />
      </Suspense>
    );
  };

  const IconWidgetToolbarMenu = (): ReactElement => ResponsiveComponent('iconWidgetToolbar');

  return (
    <WidgetBase
      onDoubleClick={onDoubleClick}
      onResize={customOnResize}
      onResizeStart={customOnResizeStart}
      onResizeEnd={customOnResizeEnd}
    >
      <WidgetToolbar>
        <IconWidgetToolbarMenu />
      </WidgetToolbar>
      <IconWidgetBase />
    </WidgetBase>
  );
};

export const ReadOnlyIconWidget = ({ includeAltTextImg }: WidgetBaseProp): ReactElement => {
  return (
    <ReadOnlyWidgetBase>
      <IconWidgetBase isReadOnly />
      {includeAltTextImg && <TransparentImg />}
    </ReadOnlyWidgetBase>
  );
};

const IconWidgetBase = ({ isReadOnly = false }: { isReadOnly?: boolean }) => {
  const { iconId, type = IconWidgetType.Single } = useWidget<IconWidgetData>();
  const { data: iconData, error } = useIcon(iconId);

  return (
    <>
      {iconData && type === IconWidgetType.Grid && <IconGrid isReadOnly={isReadOnly} iconData={iconData} />}
      {iconData && type === IconWidgetType.Single && <SingleIcon iconData={iconData} />}
      {error && <>{error.message}</>}
    </>
  );
};

const IconGrid = ({ iconData, isReadOnly }: { iconData: IconApiResponse; isReadOnly: boolean }) => {
  const {
    shapeColorOne,
    shapeColorTwo,
    shapeFill,
    gridGapPx = DEFAULT_GRID_GAP_PX,
    fillDirection = FillDirection.LeftRight,
    gridItemWidthPx = DEFAULT_GRID_ITEM_SIZE_PX,
    gridItemHeightPx = DEFAULT_GRID_ITEM_SIZE_PX,
    numberOfIcons = DEFAULT_NR_ICONS,
    widgetId,
  } = useWidget<IconWidgetData>();

  const iconGridArr = useMemo(
    () => getIconGridArr(numberOfIcons, shapeFill, shapeColorOne, shapeColorTwo),
    [numberOfIcons, shapeFill, shapeColorOne, shapeColorTwo],
  );

  const iconStyle = { width: gridItemWidthPx + 'px', height: gridItemHeightPx + 'px' };
  const flexStyle = { gap: gridGapPx + 'px' };
  const iconGridId = isReadOnly ? '' : getIconGridId(widgetId);

  return (
    <Flex id={iconGridId} wrap='wrap' style={flexStyle}>
      {iconGridArr.map((gridIcon, i) => {
        const key = `${widgetId}-grid-${i}`;
        const { shapeColorOne, shapeColorTwo, shapeFill } = gridIcon;
        const iconConfig = { shapeColorOne, shapeColorTwo, shapeFill, fillDirection };

        return (
          <Box key={key} style={iconStyle} position='relative'>
            <Icon iconData={iconData} iconConfig={iconConfig} />
          </Box>
        );
      })}
    </Flex>
  );
};

const SingleIcon = ({ iconData }: { iconData: IconApiResponse }): ReactElement => {
  const {
    shapeColorOne,
    shapeColorTwo,
    shapeFill,
    isMirrored,
    fillDirection = FillDirection.TopDown,
  } = useWidget<IconWidgetData>();

  return (
    <Icon iconConfig={{ shapeColorOne, shapeColorTwo, shapeFill, isMirrored, fillDirection }} iconData={iconData} />
  );
};
