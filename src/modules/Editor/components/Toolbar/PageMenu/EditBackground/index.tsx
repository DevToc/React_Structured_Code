import { Button } from '@chakra-ui/react';
import { DefaultTriggerProps } from 'modules/common/components/ColorPicker/ColorPicker.types';
import { ColorPicker } from 'modules/Editor/components/ColorPicker';
import { useAppDispatch, useAppSelector } from 'modules/Editor/store';
import { selectPageBackground } from 'modules/Editor/store/infographSelector';
import { updatePageBackground } from 'modules/Editor/store/infographSlice';
import { selectActivePage } from 'modules/Editor/store/pageSelector';
import { useTranslation } from 'react-i18next';

export default function EditBackground() {
  const currentPageId = useAppSelector(selectActivePage);
  const currentPageBackground = useAppSelector(selectPageBackground(currentPageId));

  const dispatch = useAppDispatch();
  const { t } = useTranslation('editor_toolbar_page_menu', { useSuspense: false });

  const onChangePageBackground = (color: string) => {
    if (!color) return;

    dispatch(updatePageBackground({ color, pageId: currentPageId }));
  };

  return (
    <ColorPicker
      color={currentPageBackground}
      onChange={onChangePageBackground}
      placement='bottom'
      hasArrow
      showNoColorChecker
      customTrigger={(props: DefaultTriggerProps) => (
        <Button {...props} size='sm' fontWeight='semibold' variant='ghost'>
          {t('editBackground.button')}
        </Button>
      )}
    />
  );
}
