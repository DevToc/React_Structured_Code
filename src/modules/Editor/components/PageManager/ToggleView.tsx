import { Tooltip, IconButton } from '@chakra-ui/react';

import { useAppSelector, useAppDispatch } from '../../store/hooks';
import { toggleSlideView } from '../../store/editorSettingsSlice';
import { selectIsSlideView } from '../../store/selectEditorSettings';

import { ReactComponent as ChevronIcon } from '../../../../assets/icons/chevron.svg';

interface ToggleViewProps {
  left: string;
  buttonRef: React.RefObject<HTMLButtonElement>;
}
export const ToggleView = ({ left, buttonRef }: ToggleViewProps) => {
  const isSlideView = useAppSelector(selectIsSlideView);
  const dispatch = useAppDispatch();

  const onToggleClick = () => dispatch(toggleSlideView());
  const label = isSlideView ? 'Hide All Pages' : 'Show All Pages';

  return (
    <Tooltip hasArrow placement='left' gutter={10} label={label} bg='black'>
      <IconButton
        ref={buttonRef}
        size='sm'
        py='12px'
        px='4px'
        position='absolute'
        top='40%'
        bg='white'
        left={left}
        onClick={onToggleClick}
        as='button'
        aria-label={label}
        borderTop='1px solid var(--vg-colors-gray-200)'
        borderLeft='1px solid var(--vg-colors-gray-200)'
        borderBottom='1px solid var(--vg-colors-gray-200)'
        icon={<ChevronIcon style={{ transform: isSlideView ? 'rotate(-90deg)' : 'rotate(90deg)' }} />}
      />
    </Tooltip>
  );
};
