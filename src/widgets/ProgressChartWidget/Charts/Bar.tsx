interface BarChartProps {
  dataColor: string;
  nonDataColor: string;
  widthPx: number;
  heightPx: number;

  // 0-100
  value: number;

  // Percentage as decimal value (0-1)
  cornerRadius: number;
}

export const BarChart = ({ value, dataColor, nonDataColor, widthPx, heightPx, cornerRadius }: BarChartProps) => {
  const corner = Math.round((cornerRadius * Math.min(widthPx, heightPx)) / 2);

  return (
    <svg width={widthPx} height={heightPx}>
      <g>
        <rect fill={nonDataColor} x={0} y={0} width={widthPx} height={heightPx} rx={corner} ry={corner} />
        <rect x={0} y={0} width={(widthPx * value) / 100} height={heightPx} fill={dataColor} rx={corner} ry={corner} />
      </g>
    </svg>
  );
};
