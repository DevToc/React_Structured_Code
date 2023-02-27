import { lazy } from 'react';

const NavbarDesktop = lazy(() => import('./components/Navbar').then(({ Navbar }) => ({ default: Navbar })));
const NavbarMobile = lazy(() => import('./components/Navbar').then(({ NavbarMobile }) => ({ default: NavbarMobile })));
const PageAreaDesktop = lazy(() => import('./components/PageArea').then(({ PageArea }) => ({ default: PageArea })));
const PageAreaMobile = lazy(() =>
  import('./components/PageArea').then(({ PageAreaMobile }) => ({ default: PageAreaMobile })),
);
const WidgetMenuDesktop = lazy(() =>
  import('./components/WidgetMenu').then(({ WidgetMenu }) => ({ default: WidgetMenu })),
);
const WidgetMenuMobile = lazy(() =>
  import('./components/WidgetMenu').then(({ WidgetMenuMobile }) => ({ default: WidgetMenuMobile })),
);

export const ResponsiveComponentsMap = {
  mobile: {
    navbar: NavbarMobile,
    widget: WidgetMenuMobile,
    pageArea: PageAreaMobile,
  },
  desktop: {
    navbar: NavbarDesktop,
    widget: WidgetMenuDesktop,
    pageArea: PageAreaDesktop,
  },
};
