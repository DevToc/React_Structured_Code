import { createContext, useContext, ReactNode } from 'react';

interface PageManagerContextI {
  disableTabbability: boolean;
}

interface PageManagerProviderProps {
  children: ReactNode;
  disableTabbability: boolean;
}

const PageManagerContext = createContext<PageManagerContextI>({ disableTabbability: false });

/**
 *  Hook for managing widget's behaviour in the page slide view, especially clickable elements like links
 */
export const usePageManager = (): PageManagerContextI => {
  const pageManagerContext = useContext(PageManagerContext);

  return pageManagerContext;
};

export const PageManagerWidgetProvider = ({ children, disableTabbability }: PageManagerProviderProps) => {
  return <PageManagerContext.Provider value={{ disableTabbability }}>{children}</PageManagerContext.Provider>;
};
