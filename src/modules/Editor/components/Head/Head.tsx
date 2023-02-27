import { useAppSelector } from '../../store/hooks';
import { Head as BaseHead } from '../../../common/components/Head';
import { selectInfographTitle } from '../../store/infographSelector';

export const Head = () => {
  const infographTitle = useAppSelector(selectInfographTitle);
  const title = infographTitle ? `${infographTitle} | Venngage` : 'Venngage';

  return <BaseHead title={title} />;
};
