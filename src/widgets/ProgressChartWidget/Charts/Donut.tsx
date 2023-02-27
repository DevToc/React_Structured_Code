import { useMemo, useCallback } from 'react';
import { Pie } from '@nivo/pie';
import { arc as d3Arc } from 'd3-shape';
import { PIE_DATA_IDS } from './Donut.config';

export interface DonutChartProps {
  type: 'full' | 'half';
  value: number;
  dataColor: string;
  nonDataColor: string;
  widthPx: number;
  heightPx: number;

  // Percentage as decimal value (0-1)
  donutSize: number;

  // Percentage as decimal value (0-1)
  cornerRadius: number;
}

export const DonutChart = ({
  type,
  widthPx,
  heightPx,
  donutSize,
  value,
  cornerRadius,
  dataColor,
  nonDataColor,
}: DonutChartProps) => {
  const chartData = useMemo(
    () => [
      {
        id: PIE_DATA_IDS.metricArc,
        value,
        color: dataColor,
      },
      {
        id: PIE_DATA_IDS.backgroundArc,
        value: 100 - value,
        // always display this arc as transparent when generating the donut
        color: 'transparent',
        // color to use to draw the background arc
        backgroundColor: nonDataColor,
      },
    ],
    [value, dataColor, nonDataColor],
  );

  // Convert cornerRadius from percent (decimal value between 0-1) to px value
  const cornerRadiusPx = useMemo(() => {
    const outerRadiusLength = Math.max(widthPx, heightPx);
    const innerRadiusLength = outerRadiusLength * donutSize;
    const donutWidth = outerRadiusLength - innerRadiusLength;
    const maxCornerRadius = donutWidth / 4;

    return Math.round(cornerRadius * maxCornerRadius);
  }, [cornerRadius, donutSize, widthPx, heightPx]);

  // Generate non-data arc using d3
  const backgroundDonut = useCallback(
    ({ centerX, centerY, dataWithArc }: { centerX: number; centerY: number; dataWithArc: any }) => {
      const { arc, data } = dataWithArc.find(({ id }: any) => id === PIE_DATA_IDS.backgroundArc) || {};

      const arcPath = d3Arc().cornerRadius(cornerRadiusPx);

      const d = arcPath({
        startAngle: type === 'half' ? -Math.PI / 2 : 0,
        endAngle: type === 'half' ? Math.PI / 2 : 2 * Math.PI,
        innerRadius: arc?.innerRadius as number,
        outerRadius: arc?.outerRadius as number,
      }) as string;

      return (
        <g transform={`translate(${centerX},${centerY})`}>
          <path d={d} fill={data?.backgroundColor} />
        </g>
      );
    },
    [cornerRadiusPx, type],
  );

  return (
    <Pie
      data={chartData}
      width={widthPx}
      height={heightPx}
      startAngle={type === 'full' ? 0 : -90}
      endAngle={type === 'full' ? 360 : 90}
      enableArcLabels={false}
      enableArcLinkLabels={false}
      isInteractive={false}
      animate={false}
      innerRadius={donutSize}
      activeOuterRadiusOffset={8}
      cornerRadius={cornerRadiusPx}
      colors={{ datum: 'data.color' }}
      layers={[backgroundDonut, 'arcs']}
    />
  );
};
