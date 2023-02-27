import { ReactElement } from 'react';
import { Flex, IconButton, Spinner, Center, useBoolean } from '@chakra-ui/react';
import SVG from 'react-inlinesvg';

import { useIcon, IconApiResponse } from 'hooks/useIcon';
import { IconHit } from 'hooks/usePaginatedIconSearch';

type onClickIconWidget = (id: string, viewBox: string) => void;

interface IconListProps {
  icons: IconHit[];
  onClickIconWidget: onClickIconWidget;
  testId?: string;
}

export const IconList = ({
  icons,
  onClickIconWidget,
  testId = 'iconwidgetmenu-icon-list',
}: IconListProps): ReactElement => {
  const [isLoading, setIsLoading] = useBoolean(true);

  const onLoadIcon = () => {
    if (isLoading) {
      setIsLoading.off();
    }
  };
  return (
    <>
      <Flex wrap='wrap' gap='8px' data-testid={testId} p={1} pr={0}>
        {icons.map((icon: IconHit) => (
          <Icon id={icon.id} key={icon.id} onClickIconWidget={onClickIconWidget} onLoad={onLoadIcon} />
        ))}
      </Flex>

      {isLoading && (
        <Center>
          <Spinner data-testid='icon-widgetmenu-list-spinner' alignSelf='center' color='var(--vg-colors-brand-500)' />
        </Center>
      )}
    </>
  );
};

interface IconProps {
  id: string;
  onClickIconWidget: onClickIconWidget;
  onLoad: () => void;
}

const Icon = ({ id, onClickIconWidget, onLoad }: IconProps): ReactElement | null => {
  const { data } = useIcon(id);
  if (!data) return null;
  return <IconLayout iconData={data} id={id} onClickIconWidget={onClickIconWidget} onLoad={onLoad} />;
};

interface IconLayoutProps extends IconProps {
  iconData: IconApiResponse;
}

const iconStyle = { width: '100%', height: '100%' };

const IconLayout = ({ iconData, onClickIconWidget, id, onLoad }: IconLayoutProps): ReactElement | null => {
  const { svg, description, viewBox = '' } = iconData;
  const title = 'icon';
  const buttonAriaLabel = 'Add new icon';

  const onClickIcon = () => onClickIconWidget(id, viewBox);

  return (
    <IconButton
      width='72px'
      height='72px'
      p={2}
      aria-label={buttonAriaLabel}
      onClick={onClickIcon}
      variant={'icon-btn-side-menu'}
      icon={
        <SVG
          uniquifyIDs={true}
          title={title}
          description={description}
          onLoad={onLoad}
          role='img'
          style={iconStyle}
          src={svg}
        />
      }
    />
  );
};
