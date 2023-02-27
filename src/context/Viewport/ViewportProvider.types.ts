export interface IViewPortContextProps {
  children: React.ReactNode;
}

export type TViewPortStates = {
  viewportHeight: string;
  tabContentHeight: string;
  isMobile: boolean;
  isLandscape: boolean;
};