import { Box, Grid } from '@chakra-ui/react';

const defaultColors = ['#0073E6', '#008577', '#D74B23', '#FFC42A'];

const ColorEllipse = ({ color }: { color: string }) => {
  return <Box bg={color} borderRadius='50%'></Box>;
};

const ColorVisualIcon = ({
  colors,
  filter,
  size = '1.25rem',
}: {
  colors?: string[];
  size?: string;
  filter?: string;
}) => {
  return (
    <Grid filter={filter} templateColumns='repeat(2, 1fr)' w={size} h={size} gap='.25rem'>
      {(colors || defaultColors).map((color, idx) => (
        <ColorEllipse key={idx} color={color} />
      ))}
    </Grid>
  );
};

export { ColorVisualIcon };
