import { useCallback, useState, ReactElement, cloneElement } from 'react';

import { updateWidget } from '../../store/infographSlice';
import { selectAltText, selectIsDecorative } from 'modules/Editor/store/infographSelector';
import { useAppDispatch, useAppSelector } from 'modules/Editor/store/hooks';

import { AltTextModal } from './AltTextModal';
import { Mixpanel } from '../../../../libs/third-party/Mixpanel/mixpanel';
import { ALT_TEXT_EDITED, ALT_TEXT_MODAL_OPENED } from '../../../../constants/mixpanel';
import { getWidgetTypeFromId } from '../../../../widgets/Widget.helpers';
import { generateToolbarName } from '../../../../libs/third-party/Mixpanel/mixpanel.helper';

interface AltTextModalTriggerProps {
  widgetId: string;
  trigger: ReactElement;
  onClose?: () => void;
  onSave?: (altText: string, isDecorative: boolean) => void;
  onOpen?: () => void;
  isA11yChecker?: boolean;
}

export const AltTextModalTrigger = ({
  widgetId,
  trigger,
  onClose = () => {},
  onOpen = () => {},
  onSave = () => {},
  isA11yChecker = false,
}: AltTextModalTriggerProps) => {
  const altText = useAppSelector(selectAltText(widgetId));
  const isDecorative = useAppSelector(selectIsDecorative(widgetId));
  const dispatch = useAppDispatch();

  const [isModalOpen, setModalOpen] = useState(false);

  const widgetType = getWidgetTypeFromId(widgetId);

  const handleOpenAltTextModal = useCallback(
    (e: React.MouseEvent<HTMLElement>) => {
      setModalOpen(true);
      onOpen?.();

      Mixpanel.track(ALT_TEXT_MODAL_OPENED, {
        from: isA11yChecker ? 'Accessibility Checker' : generateToolbarName(widgetType),
      });
    },
    [onOpen, widgetType, isA11yChecker],
  );

  const handleCloseAltTextModal = useCallback(() => {
    setModalOpen(false);
    onClose?.();
  }, [onClose]);

  const handleSaveAltText = useCallback(
    (altText: string, isDecorative: boolean) => {
      dispatch(
        updateWidget({
          widgetId,
          widgetData: {
            altText: isDecorative ? '' : altText,
            isDecorative,
          },
        }),
      );

      setModalOpen(false);
      onSave?.(altText, isDecorative);

      Mixpanel.track(ALT_TEXT_EDITED, {
        alt_text_value: isDecorative ? 'Marked as Decorative' : altText,
      });
    },
    [dispatch, widgetId, onSave],
  );

  return (
    <>
      {cloneElement(trigger, { onClick: handleOpenAltTextModal }, null)}
      <AltTextModal
        isOpen={isModalOpen}
        onSubmit={handleSaveAltText}
        onClose={handleCloseAltTextModal}
        altText={altText}
        isDecorative={isDecorative}
      />
    </>
  );
};
