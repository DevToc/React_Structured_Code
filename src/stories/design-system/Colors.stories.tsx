import { Alert, Box, Divider, Heading, HStack, SimpleGrid, Text, VStack } from '@chakra-ui/react';
import { ComponentMeta, ComponentStory } from '@storybook/react';
import { colors as colorsTheme } from '../../theme/colors';
import { theme } from '@chakra-ui/react';

interface ColorExampleProps {
  colorKey: string;
  colorValue: string;
}

const ColorBox = ({ colorKey, colorValue }: ColorExampleProps) => (
  <HStack key={colorKey}>
    <Box bgColor={colorValue} w={24} h={12} rounded={4}></Box>
    <Box>
      <Text fontWeight={'bold'} fontSize={'lg'}>
        {colorKey}
      </Text>
      <Text color={'gray'}>{colorValue}</Text>
    </Box>
  </HStack>
);

export default {
  /* 👇 The title prop is optional.
   * See https://storybook.js.org/docs/react/configure/overview#configure-story-loading
   * to learn how to generate automatic titles
   */
  title: 'Design System/Color',
  component: ColorBox,
} as ComponentMeta<typeof ColorBox>;

type ShadesType = {
  50: string;
  100: string;
  200: string;
  300: string;
  400: string;
  500: string;
  600: string;
  700: string;
  800: string;
  900: string;
};

//👇 We create a “template” of how args map to rendering
const Template: ComponentStory<typeof ColorBox> = (args) => {
  const customNames: Array<keyof typeof colorsTheme> = [
    'red',
    'gray',
    'yellow',
    'dark-blue',
    'orange',
    'upgrade',
    'action',
    'font',
    'white-alpha',
    'black-alpha',
  ];
  const shadeLevels: Array<keyof ShadesType> = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900];
  // const shadeLevels: Array<string> = ['50'];
  const chakraColors: Array<keyof typeof theme.colors> = Object.keys(theme.colors) as Array<keyof typeof theme.colors>;

  return (
    <Box>
      <Heading>Custom Venngage Colors</Heading>
      <Alert>Last Update : June 23, 2022</Alert>
      <SimpleGrid spacing={4} columns={4} mt={8}>
        {customNames.map((n) => (
          <Box
            key={n}
            borderWidth={1}
            p={4}
            rounded={4}
            color={n === 'white-alpha' ? 'white' : '#636363'}
            bgColor={n === 'white-alpha' ? '#636363' : 'white'}
          >
            <Heading fontSize={'2xl'}>{n}</Heading>
            <VStack mt={8} alignItems={'flex-start'}>
              {shadeLevels.map((s) => {
                //@ts-ignore
                return <ColorBox colorKey={`${n}.${s}`} colorValue={colorsTheme[n][s]} />;
              })}
            </VStack>
          </Box>
        ))}
        {/*custom, none shades */}
        <Box borderWidth={1} p={4} rounded={4}>
          <Heading fontSize={'2xl'}>hover</Heading>
          <VStack mt={8} alignItems={'flex-start'}>
            {['gray', 'blue'].map((s) => {
              //@ts-ignore
              return <ColorBox colorKey={`hover.${s}`} colorValue={colorsTheme['hover'][s]} />;
            })}
          </VStack>
        </Box>
      </SimpleGrid>
      <Divider my={8} />
      <Heading>All Other Chakra Colors</Heading>
      <Alert>Note : If there is a same name defined in Custom Venngage Color, the Venngage Color is used.</Alert>
      <SimpleGrid spacing={4} columns={4} mt={8}>
        {chakraColors.map((n) => {
          const c = theme.colors[n];
          if (typeof c === 'string') {
            return <ColorBox colorKey={`${n}`} colorValue={c} />;
          } else {
            return (
              <Box
                key={n}
                borderWidth={1}
                p={4}
                rounded={4}
                color={n === 'white' ? 'white' : 'black'}
                bgColor={n === 'white' ? 'black' : 'white'}
              >
                <Heading fontSize={'2xl'}>{n}</Heading>
                <VStack mt={8} alignItems={'flex-start'}>
                  {shadeLevels.map((s) => {
                    const c = theme.colors[n][s];
                    if (typeof c === 'string') {
                      return <ColorBox colorKey={`${n}.${s}`} colorValue={c} />;
                    } else {
                      return null;
                    }
                  })}
                </VStack>
              </Box>
            );
          }
        })}
      </SimpleGrid>
    </Box>
  );
};

export const Pallet = Template.bind({});
Pallet.args = {};
