import React, { ReactElement } from 'react';
import { Flex, IconButton } from '@chakra-ui/react';

import { useAppSelector, useAppDispatch } from '../../../../store/hooks';
import { selectZoom } from '../../../../store/selectEditorSettings';
import { selectInfographWidthPx } from 'modules/Editor/store/infographSelector';
import { addNewWidget } from '../../../../store';

import { BorderStyle } from '../../../../../../widgets/BasicShapeWidget/BasicShapeWidget.types';
import { BASIC_SHAPE_WIDGET_MENU_ITEMS, ICON_TO_WIDGET_SCALE } from './BasicShapeWidgetMenu.config';
import { SHAPE_TYPE_MAP } from '../../../../../../widgets/BasicShapeWidget/Shapes';
import { generateDefaultData } from '../../../../../../widgets/BasicShapeWidget/BasicShapeWidget.helpers';
import { calculateInitialTopPx, INITIAL_LEFTPX_RATIO } from 'utils/calculateInitialWidgetPos';

const TRANSPARENT_BORDER = {
  color: 'transparent',
  width: 0,
  style: BorderStyle.Solid,
};

const DEFAULT_BORDER = {
  color: 'var(--vg-colors-font-500)',
  width: 2,
  style: BorderStyle.Solid,
};

interface BasicShapeWidgetMenuProps {
  onComplete?: () => void;
}

export const BasicShapeWidgetMenu = ({ onComplete }: BasicShapeWidgetMenuProps): ReactElement => {
  const dispatch = useAppDispatch();
  const zoom = useAppSelector(selectZoom);
  const infographWidthPx = useAppSelector(selectInfographWidthPx);
  /**
   * Add widget to canvas using widget data from config file
   * The new widget dimensions will be scaled up from the icon dimensions
   * specified in the config file
   *
   * @param index {number} array index in BASIC_SHaPE_WIDGET_MENU_IITEMSS
   * @param hasBorder {boolean} if TRUE, the new widget will be border-only
   * @returns void
   */
  const doAddWidget = (index: number, hasBorder: boolean): void => {
    if (!dispatch) return;

    const defaultData = BASIC_SHAPE_WIDGET_MENU_ITEMS[index];
    let { type, iconDimensions, options } = defaultData;
    const { widthPx: iconWidth, heightPx: iconHeight } = iconDimensions;
    const initialTopPx = calculateInitialTopPx(zoom);
    const initialLeftPx = INITIAL_LEFTPX_RATIO * infographWidthPx;
    options = { ...options, topPx: initialTopPx, leftPx: initialLeftPx };

    const widgetData = generateDefaultData(type, hasBorder, {
      widthPx: iconWidth * ICON_TO_WIDGET_SCALE,
      heightPx: iconHeight * ICON_TO_WIDGET_SCALE,
      ...options,
    });

    dispatch(addNewWidget(widgetData));

    if (typeof onComplete === 'function') onComplete();
  };

  /**
   * Render list of basic shapes based on config file
   * For each config item, render a fill-only option and a border-only option
   */
  return (
    <Flex gap='8px' direction='row' wrap={'wrap'}>
      {BASIC_SHAPE_WIDGET_MENU_ITEMS.map(({ type, label, iconDimensions, options }, index) => {
        const Shape = SHAPE_TYPE_MAP[type];
        const cornerRadiusProps = options?.cornerRadius
          ? { cornerRadius: options.cornerRadius / ICON_TO_WIDGET_SCALE }
          : {};

        return (
          <React.Fragment key={label}>
            <IconButton
              width='72px'
              height='72px'
              aria-label={`Add ${label}`}
              variant={'icon-btn-side-menu'}
              icon={
                <Shape
                  widgetId={label}
                  border={TRANSPARENT_BORDER}
                  fillColor={['var(--vg-colors-font-500)']}
                  {...cornerRadiusProps}
                  {...iconDimensions}
                />
              }
              onClick={() => doAddWidget(index, false)}
            />
            <IconButton
              width='72px'
              height='72px'
              variant={'icon-btn-side-menu'}
              aria-label={`Add ${label} border`}
              icon={
                <Shape
                  widgetId={label}
                  border={DEFAULT_BORDER}
                  fillColor={['none']}
                  {...cornerRadiusProps}
                  {...iconDimensions}
                />
              }
              onClick={() => doAddWidget(index, true)}
            />
          </React.Fragment>
        );
      })}
    </Flex>
  );
};
