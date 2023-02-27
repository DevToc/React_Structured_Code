import { Divider } from '@chakra-ui/react';
import EditBackground from './EditBackground';
import EditPageSize from './EditPageSize';
import { PageMenuWrapper } from './styles';

export default function PageMenu() {
  return (
    <PageMenuWrapper data-testid='page-menu' gap={3}>
      <EditPageSize />
      <Divider orientation='vertical' />
      <EditBackground />
    </PageMenuWrapper>
  );
}
