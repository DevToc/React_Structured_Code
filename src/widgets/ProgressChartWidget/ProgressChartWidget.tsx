import { useState, useCallback, useEffect } from 'react';
import { flushSync } from 'react-dom';
import { Box } from '@chakra-ui/react';

import { CustomOnResize } from 'modules/Editor/components/BoundingBox/BoundingBox.types';
import { CHART_TYPE_MAP } from './Charts';
import { DonutChartProps } from './Charts/Donut';
import { ProgressChartWidgetData } from './ProgressChartWidget.types';
import { ProgressChartWidgetToolbar } from './ProgressChartWidgetToolbar';
import { useWidget, ReadOnlyWidgetBase, WidgetBase, WidgetToolbar, useEditor } from 'widgets/sdk';
import { isSideHandle } from 'utils/boundingBox';

type Dimension = {
  widthPx: number;
  heightPx: number;
};

export const ProgressChartWidget = () => {
  const { widthPx, heightPx, donutSize } = useWidget<ProgressChartWidgetData>();
  const { boundingBox } = useEditor();
  const [dimension, setDimension] = useState<Dimension>({ widthPx, heightPx });

  useEffect(() => {
    boundingBox.updateRect();
  }, [donutSize, boundingBox]);

  /**
   * Listen for external changes to width + height
   * (i.e.) from undo/redo
   */
  useEffect(() => {
    setDimension({ widthPx, heightPx });
  }, [widthPx, heightPx]);

  /**
   * Custom onResize handler to update the chart dimensions
   * to allow for live rendering
   */
  const customOnResize = useCallback(
    ({ event, onResize, isGroup }: CustomOnResize) => {
      onResize(event);

      // Resize from side should keep same height
      const newHeight = isGroup && isSideHandle(event.direction) ? heightPx : event.target.clientHeight ?? event.height;
      event.target.style.height = `${newHeight}px`;

      // Use flushSync to avoid glitchy resizing due to React 18 batch updates
      flushSync(() =>
        setDimension({
          widthPx: event.target.clientWidth ?? event.width,
          heightPx: newHeight,
        }),
      );
    },
    [heightPx],
  );

  return (
    <WidgetBase onResize={customOnResize}>
      <WidgetToolbar>
        <ProgressChartWidgetToolbar />
      </WidgetToolbar>
      <ProgressChart dimension={dimension} />
    </WidgetBase>
  );
};

export const ReadOnlyProgressChartWidget = () => {
  const { widthPx, heightPx } = useWidget();

  return (
    <ReadOnlyWidgetBase disableSingleSelect>
      <ProgressChart dimension={{ widthPx, heightPx }} />
    </ReadOnlyWidgetBase>
  );
};

interface ProgressChartProps {
  dimension: Dimension;
}

const ProgressChart = ({ dimension }: ProgressChartProps) => {
  const { type, donutSize, value, cornerRadius, dataColor, nonDataColor } = useWidget<ProgressChartWidgetData>();
  const { widthPx, heightPx } = dimension;
  const { component: Chart, props: chartProps } = CHART_TYPE_MAP[type];

  return (
    <Box sx={{ '& svg': { position: 'absolute' } }}>
      <Chart
        type={'full'}
        donutSize={donutSize}
        value={value}
        cornerRadius={cornerRadius}
        dataColor={dataColor}
        nonDataColor={nonDataColor}
        widthPx={widthPx}
        heightPx={heightPx}
        {...(chartProps as Partial<DonutChartProps>)}
      />
    </Box>
  );
};
