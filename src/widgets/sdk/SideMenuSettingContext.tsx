import { useBoolean } from '@chakra-ui/react';
import React, { createContext, useContext, ReactNode } from 'react';

const DEFAULT_SIDE_MENU_SETTING_CONTEXT = {
  allowScrolling: true,
  setAllowScrolling: {
    on: () => {},
    off: () => {},
    toggle: () => {},
  },
};

type SideMenuSetting = typeof DEFAULT_SIDE_MENU_SETTING_CONTEXT;

const SideMenuSettingContext = createContext<SideMenuSetting>(DEFAULT_SIDE_MENU_SETTING_CONTEXT);

export const SideMenuSettingProvider = React.memo(({ children }: { children: ReactNode }) => {
  const [allowScrolling, setAllowScrolling] = useBoolean(true);

  const value = {
    allowScrolling,
    setAllowScrolling,
  };

  return <SideMenuSettingContext.Provider value={value}>{children}</SideMenuSettingContext.Provider>;
});

export const useSideMenuSetting = () => {
  const sideMenuSettingStore = useContext(SideMenuSettingContext);
  return sideMenuSettingStore;
};
