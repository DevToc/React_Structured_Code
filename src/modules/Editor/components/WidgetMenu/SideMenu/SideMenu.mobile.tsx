import { useMemo, useEffect, useRef } from 'react';
import { Box } from '@chakra-ui/react';

import { useViewport } from 'hooks/useViewport';
import { WIDGET_MENU_OPTIONS } from 'types/WidgetMenu.types';
import { SIDEBAR_HEIGHT_MOBILE, SIDEBAR_ITEMS } from '../WidgetMenu.config';
import { TextWidgetMenu } from './TextWidgetMenu';
import { ChartsWidgetMenu } from './ChartsWidgetMenu/ChartsWidgetMenu';
import { UploadMenu } from './UploadMenu';
import { SmartWidgetMenu } from './SmartWidgetMenu';
import { IconWidgetMenu } from './IconWidgetMenu';
import { ShapesMenu } from './ShapesMenu';

import { SidePanel } from 'modules/common/components/SidePanel';
import { SidePanelHeader } from 'modules/common/components/SidePanel';
import { ElementsMenu } from './ElementsMenu/ElementsMenu';
import { NewWidget } from 'widgets/Widget.types';
import { addNewWidget, useAppDispatch, useAppSelector } from 'modules/Editor/store';
import { selectActiveWidgetMenu } from 'modules/Editor/store/editorSettingsSelector';
import { setActiveWidgetMenu } from 'modules/Editor/store/editorSettingsSlice';
import { ReplaceMenu } from 'modules/Editor/components/WidgetMenu/SideMenu/ReplaceMenu/ReplaceMenu';

const TITLE_ID = 'sidemenu-title';
const DESCRIPTION_ID = 'sidemenu-description';
const REPLACE_TITLE = 'Replace Menu';

export const SideMenuMobile = () => {
  const activeWidgetMenu = useAppSelector(selectActiveWidgetMenu);
  const dispatch = useAppDispatch();
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const isOpen = useMemo(() => activeWidgetMenu !== WIDGET_MENU_OPTIONS.NONE, [activeWidgetMenu]);
  const activeItemTitle = useMemo(() => {
    if (activeWidgetMenu === WIDGET_MENU_OPTIONS.REPLACE) return REPLACE_TITLE;
    return SIDEBAR_ITEMS.find((item) => item.id === activeWidgetMenu)?.title || '';
  }, [activeWidgetMenu]);

  const { viewportHeight } = useViewport();

  const handleClose = () => dispatch(setActiveWidgetMenu(WIDGET_MENU_OPTIONS.NONE));

  useEffect(() => {
    if (activeWidgetMenu) closeButtonRef.current?.focus();
  }, [activeWidgetMenu]);

  const onClickIconWidget = (widget: NewWidget | NewWidget[]) => {
    dispatch(addNewWidget(widget));
    handleClose();
  };

  return (
    <SidePanel
      aria-labelledby={TITLE_ID}
      aria-describedby={DESCRIPTION_ID}
      zIndex='var(--vg-zIndices-sideMenu)'
      isOpen={isOpen}
      placement='right'
      w='100vw'
      position='absolute'
      right={0}
      bottom={`${SIDEBAR_HEIGHT_MOBILE}px`}
      height={viewportHeight}
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
      <Box flex='1' overflowY='auto' overflowX='hidden'>
        {activeWidgetMenu === WIDGET_MENU_OPTIONS.REPLACE && <ReplaceMenu />}
        {activeWidgetMenu === WIDGET_MENU_OPTIONS.TEXT && <TextWidgetMenu onComplete={handleClose} />}
        {activeWidgetMenu === WIDGET_MENU_OPTIONS.UPLOAD && <UploadMenu onComplete={handleClose} />}
        {activeWidgetMenu === WIDGET_MENU_OPTIONS.SMART && <SmartWidgetMenu />}
        {activeWidgetMenu === WIDGET_MENU_OPTIONS.SHAPES && <ShapesMenu onComplete={handleClose} />}
        {activeWidgetMenu === WIDGET_MENU_OPTIONS.CHARTS && (
          <ChartsWidgetMenu onComplete={handleClose} shouldOpenSideMenu={false} />
        )}
        {
          <IconWidgetMenu
            onClickIconWidget={onClickIconWidget}
            isIconWidgetMenuActive={activeWidgetMenu === WIDGET_MENU_OPTIONS.ICONS}
          />
        }
        {activeWidgetMenu === WIDGET_MENU_OPTIONS.ELEMENTS && <ElementsMenu onComplete={handleClose} />}
      </Box>
    </SidePanel>
  );
};
