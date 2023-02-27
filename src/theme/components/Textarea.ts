export const Textarea = {
  variants: {
    disabled: {
      bg: 'gray.50',
      opacity: 1,
      color: '#717178',
      border: 'transparent',
    },
    outline: {
      border: '1px solid',
      borderColor: 'outline.gray',
      _hover: {
        bg: 'hover.gray',
        borderColor: 'outline.gray',
      },
      _focus: {
        bg: 'white',
      },
    },
  },
};
