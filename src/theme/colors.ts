import { theme } from '@chakra-ui/react';

export const colors = {
  ...theme.colors,

  red: {
    50: '#fbede9',
    100: '#f3c7bb',
    200: '#edac9a',
    300: '#e4866c',
    400: '#df6f4f',
    500: '#d74b23',
    600: '#c44420',
    700: '#993519',
    800: '#762913',
    900: '#5a200f',
  },
  gray: {
    50: '#f4f4f4',
    100: '#dbdbdb',
    200: '#cacaca',
    300: '#b2b2b2',
    400: '#a3a3a3',
    500: '#8c8c8c',
    600: '#7f7f7f',
    700: '#636363',
    800: '#4d4d4d',
    900: '#3b3b3b',
  },
  yellow: {
    50: '#fff9ea',
    100: '#ffedbd',
    200: '#ffe49d',
    300: '#ffd770',
    400: '#ffd055',
    500: '#ffc42a',
    600: '#e8b226',
    700: '#b58b1e',
    800: '#8c6c17',
    900: '#6b5212',
  },
  'dark-blue': {
    50: '#e8eaef',
    100: '#b7becd',
    200: '#949eb4',
    300: '#637292',
    400: '#45577d',
    500: '#162d5d',
    600: '#142955',
    700: '#102042',
    800: '#0c1933',
    900: '#091327',
  },
  orange: {
    50: '#fdf0e7',
    100: '#f8d0b6',
    200: '#f5ba92',
    300: '#f19a60',
    400: '#ee8641',
    500: '#ea6812',
    600: '#d55f10',
    700: '#a64a0d',
    800: '#81390a',
    900: '#622c08',
  },
  upgrade: {
    50: '#e6f1fd',
    100: '#b0d4f7',
    200: '#8abff4',
    300: '#54a1ee',
    400: '#338feb',
    500: '#0073e6',
    600: '#0069d1',
    700: '#0052a3',
    800: '#003f7f',
    900: '#003061',
    blue: {
      50: '#e6f1fd',
      100: '#b0d4f7',
      200: '#8abff4',
      300: '#54a1ee',
      400: '#338feb',
      500: '#0073e6',
      600: '#0069d1',
      700: '#0052a3',
      800: '#003f7f',
      900: '#003061',
    },
  },
  action: {
    50: '#e6f3f1',
    100: '#b0d9d5',
    200: '#8ac7c0',
    300: '#54ada4',
    400: '#339d92',
    500: '#008577',
    600: '#00796c',
    700: '#005e54',
    800: '#004941',
    900: '#003832',
  },
  font: {
    50: '#eaeaeb',
    100: '#bdbdc0',
    200: '#9d9da2',
    300: '#717178',
    400: '#55555d',
    500: '#2b2b35',
    600: '#272730',
    700: '#1f1f26',
    800: '#18181d',
    900: '#121216',
  },
  'white-alpha': {
    50: 'rgba(255,255,255,0.04)',
    100: 'rgba(255,255,255,0.06)',
    200: 'rgba(255,255,255,0.08)',
    300: 'rgba(255,255,255,0.16)',
    400: 'rgba(255,255,255,0.24)',
    500: 'rgba(255,255,255,0.36)',
    600: 'rgba(255,255,255,0.48)',
    700: 'rgba(255,255,255,0.64)',
    800: 'rgba(255,255,255,0.8)',
    900: 'rgba(255,255,255,0.92)',
  },
  'black-alpha': {
    50: 'rgba(0,0,0,0.04)',
    100: 'rgba(0,0,0,0.06)',
    200: 'rgba(0,0,0,0.08)',
    300: 'rgba(0,0,0,0.16)',
    400: 'rgba(0,0,0,0.24)',
    500: 'rgba(0,0,0,0.36)',
    600: 'rgba(0,0,0,0.48)',
    700: 'rgba(0,0,0,0.64)',
    800: 'rgba(0,0,0,0.8)',
    900: 'rgba(0,0,0,0.92)',
  },

  // re-factor below to use above (where possible)
  green: { ...theme.colors.green, 500: '#008577', 600: '#005E54' },
  brand: {
    100: '#dfe9ff',
    200: 'rgb(88 79 255 / 6%)',
    500: '#0082FF',
    600: '#0273dd',
    700: '#162d5d',
  },
  outline: {
    gray: '#8C8C8C',
  },

  'action-green': {
    50: '#E6F3F1',
    500: '#008577',
    700: '#005E54',
  },

  hover: {
    blue: 'rgba(0,105,209,0.08)',
    gray: 'rgba(0,0,0,0.08)',
  },
  divider: {
    gray: '#DBDBDB',
  },

  a11yMenu: {
    hover: '#EAEAEB',
    active: '#E6F1FD',
  },

  privateLinkView: {
    wrapperBg: '#35363A',
    footerBg: '#4D4D53',
    navbarBg: 'rgba(22, 22, 22, 0.9)',
  },
};
