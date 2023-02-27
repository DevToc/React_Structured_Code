import { Kbd, KbdProps } from '@chakra-ui/react';
import { isMacOs } from 'utils/device';

interface KeyboardProps extends KbdProps {
  macOs: string[];
  shortcut: string[];
}

export const Keyboard = ({ macOs, shortcut, ...otherProps }: KeyboardProps): React.ReactElement => {
  if (isMacOs()) {
    return (
      <>
        {macOs.map((key: string, i: number) => (
          <Kbd {...otherProps} key={i}>
            {key}
          </Kbd>
        ))}
      </>
    );
  }

  return (
    <>
      {shortcut.map((key: string, i: number) => (
        <Kbd {...otherProps} key={i}>
          {key}
        </Kbd>
      ))}
    </>
  );
};
