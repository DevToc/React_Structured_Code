export const CollapsibleBox = {
  baseStyle: {
    borderLeft: '4px solid var(--vg-colors-upgrade-blue-500)',
    borderRadius: 4,
    p: 1.5,
  },
  variants: {
    plain: {
      bg: 'white',
      border: 'none',
      borderRadius: 0,
    },
    info: {
      bg: 'hover.blue',
      borderLeftColor: 'upgrade.blue.500',
      p: 4,
      pl: 4,
    },
  },
  defaultProps: {
    variant: 'info',
  },
};
