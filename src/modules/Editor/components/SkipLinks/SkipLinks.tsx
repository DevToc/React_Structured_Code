import { useTranslation } from 'react-i18next';

import { SkipNavLink } from '../../../common/components/SkipNavLink';
import { EDITOR_ACTIVE_PAGE_FOCUS_ID } from '../../Editor.config';
import { WIDGET_MENU_OPTIONS } from 'types/WidgetMenu.types';

export const SkipLinks = () => {
  const { t } = useTranslation('app');

  return (
    <>
      <SkipNavLink data-testid='skip-navigation' id={WIDGET_MENU_OPTIONS.TEXT}>
        {t('skip_links.navigation')}
      </SkipNavLink>
      <SkipNavLink data-testid='skip-main-content' id={EDITOR_ACTIVE_PAGE_FOCUS_ID}>
        {t('skip_links.main_content')}
      </SkipNavLink>
    </>
  );
};
