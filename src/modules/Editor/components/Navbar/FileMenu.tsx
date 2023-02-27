import { useDisclosure, Portal } from '@chakra-ui/react';

import { SetLanguageModal } from './components/SetLanguageModal';
import { useAppDispatch } from '../../store';
import { setAccessibilityViewIndex } from '../../store/editorSettingsSlice';
import { useFocus } from '../Focus';

import type { MenuType } from 'modules/common/components/Menu';
import { ToolbarMenu } from 'modules/common/components/Menu/ToolbarMenu';

import { ReactComponent as AccessibilityIcon } from '../../../../assets/icons/toolbar/file/Acessible.svg';
import { ReactComponent as AccessibilityCheckIcon } from '../../../../assets/icons/toolbar/file/AccessibilityCheck.svg';
import { ReactComponent as LanguageIcon } from '../../../../assets/icons/toolbar/file/Language.svg';
import { ReactComponent as OrderIcon } from '../../../../assets/icons/toolbar/file/Order.svg';
import { AccessibilityViewIndex } from '../../../../types/accessibilityViewIndex';
import { Mixpanel } from '../../../../libs/third-party/Mixpanel/mixpanel';
import {
  ACCESSIBILITY_CHECKER_OPENED,
  DOCUMENT_LANGUAGE_MODAL_OPENED,
  FILE_MENU,
  READING_ORDER_TAB_OPENED,
  VISUAL_SIMULATOR_TAB_OPENED,
} from 'constants/mixpanel';
import { ColorVisualIcon } from 'modules/common/components/ColorVisualIcon';

/**
 * File menu.
 */
export const FileMenu = () => {
  const { fileMenuRef } = useFocus();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const dispatch = useAppDispatch();

  const menu: MenuType = {
    // Hide below for now
    // showSmartGuides: {
    //   label: 'Show smart guides',
    //   checked: isSmartGuidesOpen,
    //   onClick: setIsSmartGuidesOpen.toggle,
    // },
    // showMargins: {
    //   label: 'Show margins',
    //   checked: isShowMarginsOpen,
    //   onClick: setisShowMarginsOpen.toggle,
    // },
    // showPageNumebrs: {
    //   label: 'Show page numbers',
    //   checked: isShowPageNumbersOpen,
    //   onClick: setIsShowPageNumbersOpen.toggle,
    // },
    // showPrintBleed: {
    //   label: 'Show print bleed',
    //   checked: isShowPrintBleedOpen,
    //   onClick: setIsShowPrintBleedOpen.toggle,
    // },
    // divider01: {},
    // makeACopy: {
    //   label: 'Make a copy',
    // },
    // saveAsTemplate: {
    //   label: 'Save as temnplate',
    // },
    // divider02: {},
    accessibility: {
      label: 'Accessibility',
      Icon: AccessibilityIcon,
      data: {
        // takeATour: {
        //   label: 'Take a tour',
        // },
        // divider01: {},
        checkAccessibility: {
          Icon: AccessibilityCheckIcon,
          label: 'Check accessibility',
          onClick: () => {
            dispatch(setAccessibilityViewIndex(AccessibilityViewIndex.CHECK));

            Mixpanel.track(ACCESSIBILITY_CHECKER_OPENED, {
              from: FILE_MENU,
            });
          },
        },
        editReadingOrder: {
          Icon: OrderIcon,
          label: 'Edit reading order',
          onClick: () => {
            dispatch(setAccessibilityViewIndex(AccessibilityViewIndex.EDIT));

            Mixpanel.track(READING_ORDER_TAB_OPENED, {
              from: FILE_MENU,
            });
          },
        },
        setDocumentLanguage: {
          Icon: LanguageIcon,
          label: 'Set document language',
          onClick: () => {
            onOpen?.();

            Mixpanel.track(DOCUMENT_LANGUAGE_MODAL_OPENED, {
              from: FILE_MENU,
            });
          },
        },
        visualSimulator: {
          Icon: ColorVisualIcon,
          label: 'Visual Simulator',
          onClick: () => {
            dispatch(setAccessibilityViewIndex(AccessibilityViewIndex.SIMULATOR));

            Mixpanel.track(VISUAL_SIMULATOR_TAB_OPENED, {
              from: FILE_MENU,
            });
          },
        },
      },
    },
  };

  return (
    <>
      <ToolbarMenu zIndex='navbar' name='File' menu={menu} ref={fileMenuRef}>
        File
      </ToolbarMenu>
      <Portal>
        <SetLanguageModal isOpen={isOpen} onClose={onClose} />
      </Portal>
    </>
  );
};
