import { Tooltip, IconButton, useBoolean } from '@chakra-ui/react';
import styled from '@emotion/styled';
import { ReactComponent as EyeDropperIcon } from '../../../../assets/icons/eye_dropper.svg';

type EyeDropperResult = {
  sRGBHex: string;
};

const DropperIconSelected = styled(EyeDropperIcon)`
  path {
    stroke: var(--vg-colors-upgrade-blue-700);
  }
  path: last-of-type {
    fill: var(--vg-colors-upgrade-blue-700);
  }
`;

const EYE_DROPPER_BUTTON_SIZE = 'var(--vg-space-9)';

export const EyeDropper = ({ onChange }: any) => {
  const [isSelected, setIsSelected] = useBoolean(false);

  const browserHasEyeDropper = window?.EyeDropper;
  if (!browserHasEyeDropper) return null;

  const label = 'Pick a Color';
  const openEyeDropper = () => {
    setIsSelected.on();

    const eyeDropperObj = new window.EyeDropper();
    eyeDropperObj
      .open()
      .then((result: EyeDropperResult) => {
        onChange(result.sRGBHex);
      })
      .catch((e: Error) => {
        console.log(e);
      })
      .finally(setIsSelected.off);
  };

  return (
    <Tooltip hasArrow placement='bottom' label={label}>
      <IconButton
        w={EYE_DROPPER_BUTTON_SIZE}
        h={EYE_DROPPER_BUTTON_SIZE}
        minW={EYE_DROPPER_BUTTON_SIZE}
        bg={isSelected ? 'var(--vg-colors-hover-blue)' : 'transparent'}
        onClick={openEyeDropper}
        position='absolute'
        right='2px'
        top='112px'
        aria-label={label}
        icon={isSelected ? <DropperIconSelected /> : <EyeDropperIcon />}
      />
    </Tooltip>
  );
};
