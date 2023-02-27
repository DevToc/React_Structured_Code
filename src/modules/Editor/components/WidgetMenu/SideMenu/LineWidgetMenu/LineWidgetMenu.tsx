import React, { ReactElement } from 'react';
import clonedeep from 'lodash.clonedeep';
import { Flex, IconButton } from '@chakra-ui/react';

import { useAppSelector, useAppDispatch } from '../../../../store/hooks';
import { selectZoom } from '../../../../store/selectEditorSettings';
import { selectInfographWidthPx } from 'modules/Editor/store/infographSelector';
import { addNewWidget } from '../../../../store';
import {
  LINE_WIDGET_MENU_ITEMS,
  DEFAULT_ICON_SIZE,
  DEFAULT_BUTTON_SIZE,
  DEFAULT_ICON_STROKE_WIDTH,
} from './LineWidgetMenu.config';
import { LINE_TYPE_MAP } from '../../../../../../widgets/LineWidget/LineRenders';
import {
  generateDefaultData,
  getStartPos,
  getMidPosList,
  getEndPos,
} from '../../../../../../widgets/LineWidget/LineWidget.helpers';
import { StraightLineProps } from '../../../../../../widgets/LineWidget/LineWidget.types';
import { calculateInitialTopPx, INITIAL_LEFTPX_RATIO } from 'utils/calculateInitialWidgetPos';

interface LineWidgetMenuProps {
  onComplete?: () => void;
}
export const LineWidgetMenu = ({ onComplete }: LineWidgetMenuProps): ReactElement => {
  const dispatch = useAppDispatch();
  const zoom = useAppSelector(selectZoom);
  const infographWidthPx = useAppSelector(selectInfographWidthPx);

  /**
   * Add widget to canvas using widget data from config file
   * The new widget dimensions will be scaled up from the icon dimensions
   * specified in the config file
   *
   * @param index {number} array index in LINE_WIDGET_MENU_ITEMS
   * @returns void
   */
  const doAddWidget = (index: number): void => {
    if (!dispatch) return;

    const defaultData = LINE_WIDGET_MENU_ITEMS[index];
    const newData = {
      ...defaultData.options,
      startPos: getStartPos(defaultData.options.posList),
      midPosList: getMidPosList(defaultData.options.posList),
      endPos: getEndPos(defaultData.options.posList),
      isDecorative: defaultData.isDecorative,
    };

    const widgetData = generateDefaultData(defaultData.type, newData);
    const initialTopPx = calculateInitialTopPx(zoom);
    const initialLeftPx = INITIAL_LEFTPX_RATIO * infographWidthPx;
    widgetData.widgetData = { ...widgetData.widgetData, topPx: initialTopPx, leftPx: initialLeftPx };

    dispatch(addNewWidget(widgetData));

    if (typeof onComplete === 'function') onComplete();
  };

  /**
   * Return the a menu icon data using the actual line data for rendering the icon
   *
   * @param options StraightLineProps
   * @returns StraightLineProps
   */
  const getScaledData = (options: StraightLineProps): StraightLineProps => {
    // Update line size using the scale
    const scale = Math.min(
      DEFAULT_ICON_SIZE / Math.max(...options.posList.map((pos) => pos.xPx)),
      DEFAULT_ICON_SIZE / Math.max(...options.posList.map((pos) => pos.yPx)),
    );
    const lineOptions = clonedeep(options);
    lineOptions.strokeWidth = DEFAULT_ICON_STROKE_WIDTH;
    lineOptions.isReadonly = true;
    lineOptions.posList = lineOptions.posList.map((position) => ({
      xPx: position.xPx * scale,
      yPx: position.yPx * scale,
    }));

    return lineOptions;
  };

  /**
   * Render list of line widget based on config file
   * For each config item, render a fill-only option and a border-only option
   */
  return (
    <Flex gap='8px' direction='row' wrap={'wrap'}>
      {LINE_WIDGET_MENU_ITEMS.map(({ type, label, options }, index) => {
        const Line = LINE_TYPE_MAP[type];
        const lineOptions = getScaledData(options);

        if (Line === null || !lineOptions) return null;

        const widgetPx = Math.max(...lineOptions.posList.map((pos) => pos.xPx));
        const heightPx = Math.max(...lineOptions.posList.map((pos) => pos.yPx));
        return (
          <IconButton
            key={label}
            width={`${DEFAULT_BUTTON_SIZE}px`}
            height={`${DEFAULT_BUTTON_SIZE}px`}
            aria-label={`Add ${label}`}
            icon={
              <div style={{ width: widgetPx, height: heightPx }}>
                <Line {...lineOptions}></Line>
              </div>
            }
            onClick={() => doAddWidget(index)}
            variant={'icon-btn-side-menu'}
          />
        );
      })}
    </Flex>
  );
};
