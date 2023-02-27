import { theme } from '@chakra-ui/react';

export const Button = {
  variants: {
    action: {
      bg: 'action-green.500',
      color: 'white',
      fontSize: 'sm',
      px: 4,
      _hover: {
        bg: 'action-green.700',
      },
    },
    upgrade: {
      bg: 'upgrade.blue.500',
      color: 'white',
      fontSize: 'sm',
      px: 4,
      _hover: {
        bg: 'upgrade.blue.700',
      },
    },
    ghost: () => ({
      fontSize: 'sm',
      _hover: {
        bg: 'hover.gray',
      },
    }),
    'list-item': {
      w: '100%',
      justifyContent: 'flex-start',
      fontWeight: 400,
      _hover: {
        bg: 'hover.grey',
      },
      _focus: {
        bg: 'hover.grey',
      },
    },
    'toolbar-dropdown-option': {
      color: 'font.500',
      fontSize: 'sm',
      borderRadius: 'base',
      border: '1px solid',
      borderColor: 'outline.gray',
      bg: 'transparent',
      fontWeight: 'normal',
      p: 2,
      alignItems: 'center',
      justifyContent: 'space-between',
      _active: {
        borderColor: 'upgrade.blue.700',
      },
      _hover: {
        bg: 'var(--vg-colors-hover-gray)',
      },
    },
    'toolbar-dropdown-item': {
      color: 'font.500',
      width: '100%',
      fontSize: 'sm',
      ms: 0,
      fontWeight: 500,
      justifyContent: 'space-between',
      _active: {
        color: 'upgrade.blue.700',
        backgroundColor: 'hover.blue',
        svg: {
          path: {
            fill: 'upgrade.blue.700',
          },
          circle: {
            fill: 'upgrade.blue.700',
          },
        },
      },
      _hover: {
        color: 'upgrade.gray.700',
        backgroundColor: 'hover.gray',
      },
    },
    link: {
      ...theme.components?.Button?.variants?.unstyled,
      textAlign: 'left',
      p: 1.5,
      fontWeight: 500,
      w: 'fit-content',
      color: 'upgrade.blue.500',
    },
    'a11ymenu-outline': {
      border: '1px solid',
      borderColor: 'outline.gray',
      bg: 'transparent',
      fontWeight: 'normal',
      justifyContent: 'space-between',
      w: '5rem',
      borderRadius: '4',
      _active: {
        borderColor: 'upgrade.blue.700',
      },
      _hover: {
        bg: 'var(--vg-colors-hover-gray)',
      },
    },
    'transparent-outline': {
      ...theme.components.Button?.variants?.outline,
      border: '1px solid var(--vg-colors-outline-gray)',
      bg: 'transparent',
      _hover: {
        bg: 'blackAlpha.200',
      },
    },
    'pagemanager-bottom-button': {
      _hover: {
        color: 'upgrade.blue.700',
        backgroundColor: 'hover.blue',
        '& line': {
          stroke: 'upgrade.blue.700',
        },
      },
    },
    /* IconButton Variants */
    'icon-btn-toolbar-option': {
      bg: 'white',
      _hover: {
        bg: 'hover.gray',
      },
      _active: {
        bg: 'hover.blue',
        '& path': {
          stroke: 'upgrade.blue.700',
        },
      },
    },
    /* IconButton without option menu */
    'icon-btn-toolbar': {
      bg: 'white',
      _hover: {
        bg: 'hover.gray',
      },
      _active: {
        bg: 'hover.blue',
        path: {
          fill: 'upgrade.blue.700',
        },
      },
    },
    'icon-btn-side-menu': {
      bg: 'transparent',
      _hover: { bg: 'hover.gray' },
      transitionDuration: '200ms',
    },
    'icon-btn-page-navigation': {
      bg: 'transparent',
      '& polyline': {
        stroke: 'white',
      },
      _hover: { bg: 'var(--vg-colors-privateLinkView-footerBg)' },
    },
    /* NodeCreatorModal */
    'add-widget-button': {
      border: '1px solid',
      borderColor: 'gray.200',
      overflow: 'hidden',
      bg: 'hover.gray',
      _hover: {
        bg: 'gray.200',
      },
    },
  },
};
