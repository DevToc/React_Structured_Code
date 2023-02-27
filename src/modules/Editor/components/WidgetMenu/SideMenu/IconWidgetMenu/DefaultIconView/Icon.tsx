import { memo } from 'react';
import { useIcon } from '../../../../../../../hooks/useIcon';
import SVG from 'react-inlinesvg';

interface IconProps {
  iconId: string;
}

export const Icon = memo(({ iconId }: IconProps) => {
  const { data } = useIcon(iconId);

  if (!data) {
    return null;
  }

  const { description, svg } = data;
  return (
    <SVG uniquifyIDs={true} description={description} role='img' style={{ width: '100%', height: '100%' }} src={svg} />
  );
});
