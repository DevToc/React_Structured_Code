import { PlacementWithLogical } from '@chakra-ui/react';

type Color = string;
type Name = string;

export type Series = { color: Color; name: Name };

export interface SeriesColorPickerProps {
  label: string;
  series: Series[];
  onChange: (color: string, index: number) => void;

  placement?: PlacementWithLogical;
}
