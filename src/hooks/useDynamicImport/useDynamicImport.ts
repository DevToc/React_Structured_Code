import { TComponentMap } from './useDynamicImport.types';
import { useViewport } from 'hooks/useViewport';

export const useDynamicImport = (componentName: string, componentsMap: TComponentMap) => {
  const { isMobile } = useViewport();

  return isMobile
    ? componentsMap.mobile[componentName as keyof typeof componentsMap]
    : componentsMap.desktop[componentName as keyof typeof componentsMap];
};
