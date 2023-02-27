import { ReactNode } from 'react';
import { FlowCoreProvider } from './FlowCoreContext';
import { PortProvider } from './PortContext';

interface FlowModeProviderProps {
  children: ReactNode;
}

export const FlowModeProvider = ({ children }: FlowModeProviderProps) => (
  <FlowCoreProvider>
    <PortProvider>{children}</PortProvider>
  </FlowCoreProvider>
);
