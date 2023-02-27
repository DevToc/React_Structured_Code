import { IconButton, Tooltip } from '@chakra-ui/react';

import { TEXT_CREATED } from 'constants/mixpanel';
import { Mixpanel } from 'libs/third-party/Mixpanel/mixpanel';
import { TextWidgetData } from 'widgets/TextBasedWidgets/TextWidget/TextWidget.types';
import { getWidgetTypeFromId } from 'widgets/Widget.helpers';
import { WidgetType } from 'types/widget.types';
import { ReactComponent as CopyIcon } from 'assets/icons/copy.svg';

import { selectActiveWidgets } from 'modules/Editor/store/widgetSelector';
import { selectActivePage } from 'modules/Editor/store/pageSelector';
import { selectWidgets } from 'modules/Editor/store/infographSelector';
import { addNewWidget, useAppDispatch, useAppSelector } from 'modules/Editor/store';
import { Keyboard } from 'modules/common/components/Keyboard';

import { createCopyWidgets, parseCopyWidgets } from '../../Clipboard';

export const DuplicateMenu = () => {
  const dispatch = useAppDispatch();

  const activePageId = useAppSelector(selectActivePage);
  const activeWidgets = useAppSelector(selectActiveWidgets);
  const widgets = useAppSelector(selectWidgets);

  const isDisabled = !activeWidgets.length;
  const label = 'Duplicate';

  const onDuplicate = () => {
    const copyWidgets = createCopyWidgets(activeWidgets, widgets, activePageId);
    const newWidgets = parseCopyWidgets(copyWidgets, activePageId);

    dispatch(addNewWidget(newWidgets));

    if (!activeWidgets[1] && activeWidgets[0]?.id) {
      const widgetType = getWidgetTypeFromId(activeWidgets[0]?.id);
      if (widgetType === WidgetType.Text) {
        const { textTag } = widgets[activeWidgets[0]?.id] as TextWidgetData;
        const textType = textTag || 'Other';

        Mixpanel.track(TEXT_CREATED, {
          from: 'Duplication',
          text_style: textType.replace(textType[0], textType[0].toUpperCase()),
        });
      }
    }
  };

  return (
    <Tooltip
      hasArrow
      placement='bottom'
      label={
        <>
          {label} <Keyboard shortcut={['ctrl', 'D']} macOs={['⌘', 'D']} />
        </>
      }
      bg='black'
    >
      <IconButton isDisabled={isDisabled} size='sm' aria-label={label} icon={<CopyIcon />} onClick={onDuplicate} />
    </Tooltip>
  );
};
