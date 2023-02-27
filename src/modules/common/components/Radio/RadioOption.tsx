import { Radio, Text, TextProps, RadioProps } from '@chakra-ui/react';

const defaultProps = {
  fontSize: 'sm',
  fontWeight: 'medium',
};

export const RadioOption = ({
  children,
  value,
  isDisabled,
  skipTextWrap,
  textProps = {},
  ...props
}: RadioProps & { skipTextWrap?: boolean; textProps?: TextProps }) => {
  return (
    <Radio value={value} isDisabled={isDisabled} {...props}>
      {skipTextWrap ? (
        children
      ) : (
        <Text {...defaultProps} {...textProps}>
          {children}
        </Text>
      )}
    </Radio>
  );
};
