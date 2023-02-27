export {};

interface EyeDropper {
  new ();
  open: () => void;
}

interface VenngageE2 {
  designOwner?: DesignOwner;
  privateLinkId?: string;
}

interface DesignOwner {
  firstName: string;
  lastName: string;
}

declare global {
  interface Window {
    EyeDropper: EyeDropper;
    __moveToPage: (pageId: string) => void;
  }
  var VenngageE2: VenngageE2;
}
