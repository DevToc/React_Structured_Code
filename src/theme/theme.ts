import { extendTheme } from '@chakra-ui/react';
import { colors } from './colors';
import { shadows } from './shadows';
import { Textarea, Checkbox, Link, Kbd, Button, CollapsibleBox, Tag, Tooltip } from './components';
import { zIndices } from './z-index';

export const theme = extendTheme({
  config: {
    cssVarPrefix: 'vg',
  },
  colors,
  zIndices,
  shadows,
  components: {
    Textarea,
    Checkbox,
    Link,
    Kbd,
    Button,
    CollapsibleBox,
    Tag,
    Tooltip,
  },
});
