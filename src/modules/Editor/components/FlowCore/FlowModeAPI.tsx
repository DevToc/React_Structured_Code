import { useContext, useMemo } from 'react';
import { PortContext } from './PortContext';
import { FlowCoreContext } from './FlowCoreContext';
import {
  FlowCoreContextGetterI,
  FlowCoreContextI,
  FlowCoreContextSetterI,
  PortContextGetterI,
  PortContextI,
  PortContextSetterI,
} from 'types/flowCore.types';

/**
 * Flow Core hooks APIs
 */

export const useFlowCore = (): FlowCoreContextI => {
  const flowCoreContext = useContext(FlowCoreContext);
  return flowCoreContext;
};

export const useFlowMode = (): [FlowCoreContextI['start'], FlowCoreContextI['stop']] => {
  const flowCoreContext = useContext(FlowCoreContext);
  return [flowCoreContext.start, flowCoreContext.stop];
};

export const useFlowCoreValue = <T extends keyof FlowCoreContextGetterI>(key: T) => {
  const flowCoreContext = useContext(FlowCoreContext);
  return flowCoreContext[key];
};

export const useSetFlowCoreState = <T extends keyof FlowCoreContextSetterI>(key: T) => {
  const flowCoreContext = useContext(FlowCoreContext);
  return flowCoreContext[key];
};

/**
 * Port Renderer hooks APIs
 */
export const usePortRender = (): [PortContextI['render'], PortContextI['clear']] => {
  const portContext = useContext(PortContext);
  return [portContext.render, portContext.clear];
};

export const usePortValue = <T extends keyof PortContextGetterI>(key: T) => {
  const portContext = useContext(PortContext);
  return portContext[key];
};

export const useSetPortState = <T extends keyof PortContextSetterI>(key: T) => {
  const portContext = useContext(PortContext);
  return portContext[key];
};

export const useSelectedPortState = () => {
  const portContext = useContext(PortContext);
  const value = useMemo<[PortContextI['selectedPort'], PortContextI['setSelectedPort']]>(() => {
    return [portContext.selectedPort, portContext.setSelectedPort];
  }, [portContext.selectedPort, portContext.setSelectedPort]);
  return value;
};

/**
 * Node Creator Modal Render API
 */
export const useNodeModalRender = (): [PortContextI['renderModal'], PortContextI['closeModal']] => {
  const portContext = useContext(PortContext);
  return [portContext.renderModal, portContext.closeModal];
};
