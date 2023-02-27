export type TComponentMap = {
  mobile: TComponent;
  desktop: TComponent;
};

type TComponent = {
  [key: string]: React.ElementType;
};
