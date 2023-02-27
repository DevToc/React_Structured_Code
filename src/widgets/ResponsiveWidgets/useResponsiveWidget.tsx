import { createContext, useContext, ReactNode } from 'react';
import { WidgetId } from '../../types/idTypes';

interface ResponsiveWidgetContextI {
  responsiveWidgetId: WidgetId;

  fitWidthWidgets?: WidgetId[];
  fitHeightWidgets?: WidgetId[];
}

interface ResponsiveWidgetProviderProps {
  children: ReactNode;
  responsiveWidgetId: WidgetId;

  // Specify which widgets should take up 100% width/height of its container
  // and ignore width provided in the widgetData
  fitWidthWidgets?: WidgetId[];
  fitHeightWidgets?: WidgetId[];
}

const ResponsiveWidgetGroupContext = createContext<ResponsiveWidgetContextI>({ responsiveWidgetId: '' });

/**
 * Pass props from WidgetBase to internal widget components
 */
export const useResponsiveWidget = (): ResponsiveWidgetContextI => {
  const responsiveWidgetGroupContext = useContext(ResponsiveWidgetGroupContext);

  return responsiveWidgetGroupContext;
};

export const ResponsiveWidgetProvider = ({
  children,
  responsiveWidgetId,
  fitWidthWidgets,
  fitHeightWidgets,
}: ResponsiveWidgetProviderProps) => {
  return (
    <ResponsiveWidgetGroupContext.Provider value={{ responsiveWidgetId, fitWidthWidgets, fitHeightWidgets }}>
      {children}
    </ResponsiveWidgetGroupContext.Provider>
  );
};
