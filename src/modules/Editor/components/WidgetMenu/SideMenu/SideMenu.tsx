import { useMemo, useEffect, useRef } from 'react';
import { Box } from '@chakra-ui/react';

import { Code } from 'constants/keyboard';
import { WIDGET_MENU_OPTIONS } from 'types/WidgetMenu.types';
import { SIDEBAR_ITEMS } from '../WidgetMenu.config';
import { TextWidgetMenu } from './TextWidgetMenu';
import { ChartsWidgetMenu } from './ChartsWidgetMenu/ChartsWidgetMenu';
import { UploadMenu } from './UploadMenu';
import { SmartWidgetMenu } from './SmartWidgetMenu';
import { IconWidgetMenu } from './IconWidgetMenu';
import { ShapesMenu } from './ShapesMenu';

import { SidePanel } from 'modules/common/components/SidePanel';
import { SidePanelHeader } from 'modules/common/components/SidePanel';
import { ElementsMenu } from './ElementsMenu/ElementsMenu';
import { addNewWidget, useAppDispatch, useAppSelector } from 'modules/Editor/store';
import { selectActiveWidgetMenu } from 'modules/Editor/store/editorSettingsSelector';
import { setActiveWidgetMenu } from 'modules/Editor/store/editorSettingsSlice';
import { ReplaceMenu } from './ReplaceMenu/ReplaceMenu';
import { NewWidget } from 'widgets/Widget.types';

const TITLE_ID = 'sidemenu-title';
const DESCRIPTION_ID = 'sidemenu-description';
const REPLACE_TITLE = 'Replace Menu';

export const SideMenu = () => {
  const activeWidgetMenu = useAppSelector(selectActiveWidgetMenu);
  const dispatch = useAppDispatch();
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const isOpen = useMemo(() => activeWidgetMenu !== WIDGET_MENU_OPTIONS.NONE, [activeWidgetMenu]);
  const activeItemTitle = useMemo(() => {
    if (activeWidgetMenu === WIDGET_MENU_OPTIONS.REPLACE) return REPLACE_TITLE;
    return SIDEBAR_ITEMS.find((item) => item.id === activeWidgetMenu)?.title || '';
  }, [activeWidgetMenu]);

  const handleClose = () => dispatch(setActiveWidgetMenu(WIDGET_MENU_OPTIONS.NONE));

  useEffect(() => {
    if (activeWidgetMenu) closeButtonRef.current?.focus();
  }, [activeWidgetMenu]);

  const onKeyDown = (e: React.KeyboardEvent) => {
    e.stopPropagation();
    if (e.code === Code.Escape) handleClose();
  };

  const onClickIconWidget = (widget: NewWidget | NewWidget[]) => dispatch(addNewWidget(widget));

  return (
    <SidePanel
      aria-labelledby={TITLE_ID}
      aria-describedby={DESCRIPTION_ID}
      zIndex='var(--vg-zIndices-sideMenu)'
      onKeyDown={onKeyDown}
      isOpen={isOpen}
      placement={'left'}
    >
      <SidePanelHeader
        title={activeItemTitle}
        titleId={TITLE_ID}
        description={`Add ${activeItemTitle} widgets`}
        descriptionId={DESCRIPTION_ID}
        onClose={handleClose}
        ref={closeButtonRef}
        closeButtonAriaLabel={'Close widget menu'}
      />
      <Box flex='1' overflow='hidden'>
        {activeWidgetMenu === WIDGET_MENU_OPTIONS.REPLACE && <ReplaceMenu />}
        {activeWidgetMenu === WIDGET_MENU_OPTIONS.TEXT && <TextWidgetMenu />}
        {activeWidgetMenu === WIDGET_MENU_OPTIONS.UPLOAD && <UploadMenu />}
        {activeWidgetMenu === WIDGET_MENU_OPTIONS.SMART && <SmartWidgetMenu />}
        {activeWidgetMenu === WIDGET_MENU_OPTIONS.SHAPES && <ShapesMenu />}
        {activeWidgetMenu === WIDGET_MENU_OPTIONS.CHARTS && <ChartsWidgetMenu />}
        {
          <IconWidgetMenu
            onClickIconWidget={onClickIconWidget}
            isIconWidgetMenuActive={activeWidgetMenu === WIDGET_MENU_OPTIONS.ICONS}
          />
        }
        {activeWidgetMenu === WIDGET_MENU_OPTIONS.ELEMENTS && <ElementsMenu />}
      </Box>
    </SidePanel>
  );
};
