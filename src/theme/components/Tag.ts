export const Tag = {
  variants: {
    'editor-tag': {
      container: {
        bg: 'upgrade.blue.500',
        border: '2px solid',
        borderColor: '#7FB9F2',
        color: 'white',
        p: 1,
      },
    },
    'nonText-tag': {
      container: {
        bg: 'upgrade.blue.500',
        border: '2px solid',
        borderColor: 'rgba(255, 255, 255, 0.5)',
        color: 'white',
        p: 1,
        _hover: {
          bg: 'upgrade.blue.700',
          cursor: 'pointer',
        },
      },
    },
    'missing-alt': {
      container: {
        bg: 'gray.700',
        border: '2px solid',
        borderColor: 'rgba(255, 255, 255, 0.5)',
        color: 'white',
        p: 1,
        _hover: {
          bg: 'gray.900',
          cursor: 'pointer',
        },
      },
    },
  },
};
