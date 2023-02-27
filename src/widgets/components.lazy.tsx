import { lazy } from 'react';

const BasicShapeWidgetToolbarMobile = lazy(() =>
  import('widgets/BasicShapeWidget/BasicShapeWidgetToolbar.mobile').then(({ BasicShapeWidgetToolbarMenuMobile }) => ({
    default: BasicShapeWidgetToolbarMenuMobile,
  })),
);
const BasicShapeWidgetToolbar = lazy(() =>
  import('widgets/BasicShapeWidget/BasicShapeWidgetToolbar').then(({ BasicShapeWidgetToolbarMenu }) => ({
    default: BasicShapeWidgetToolbarMenu,
  })),
);

const TextWidgetToolbarMobile = lazy(() =>
  import('widgets/TextBasedWidgets/TextWidget/toolbar/TextWidgetToolbar.mobile').then(
    ({ TextWidgetToolbarMenuMobile }) => ({
      default: TextWidgetToolbarMenuMobile,
    }),
  ),
);
const TextWidgetToolbar = lazy(() =>
  import('widgets/TextBasedWidgets/TextWidget/toolbar/TextWidgetToolbar').then(({ TextWidgetToolbarMenu }) => ({
    default: TextWidgetToolbarMenu,
  })),
);

const ImageWidgetToolbarMobile = lazy(() =>
  import('widgets/ImageWidget/ImageWidgetToolbar.mobile').then(({ ImageWidgetToolbarMenuMobile }) => ({
    default: ImageWidgetToolbarMenuMobile,
  })),
);
const ImageWidgetToolbar = lazy(() =>
  import('widgets/ImageWidget/ImageWidgetToolbar').then(({ ImageWidgetToolbarMenu }) => ({
    default: ImageWidgetToolbarMenu,
  })),
);

const IconWidgetToolbarMobile = lazy(() =>
  import('widgets/IconWidget/IconWidgetToolbar.mobile').then(({ IconWidgetToolbarMenuMobile }) => ({
    default: IconWidgetToolbarMenuMobile,
  })),
);
const IconWidgetToolbar = lazy(() =>
  import('widgets/IconWidget/IconWidgetToolbar').then(({ IconWidgetToolbarMenu }) => ({
    default: IconWidgetToolbarMenu,
  })),
);

const ResponsiveTextToolbarMobile = lazy(() =>
  import('widgets/ResponsiveWidgets/ResponsiveTextWidget/ResponsiveTextWidgetToolbar.mobile').then(
    ({ ResponsiveTextToolbarMobile }) => ({
      default: ResponsiveTextToolbarMobile,
    }),
  ),
);

const ResponsiveTextToolbar = lazy(() =>
  import('widgets/ResponsiveWidgets/ResponsiveTextWidget/ResponsiveTextWidgetToolbar').then(
    ({ ResponsiveTextToolbar }) => ({
      default: ResponsiveTextToolbar,
    }),
  ),
);

const ChartWidgetToolbarMobile = lazy(() =>
  import('widgets/ChartWidgets/ChartWidgetToolbar.mobile').then(({ ChartWidgetToolbarMobile }) => ({
    default: ChartWidgetToolbarMobile,
  })),
);

const ChartWidgetToolbar = lazy(() =>
  import('widgets/ChartWidgets/ChartWidgetToolbar').then(({ ChartWidgetToolbar }) => ({
    default: ChartWidgetToolbar,
  })),
);

export const WidgetComponentsMap = {
  mobile: {
    basicShapeWidgetToolbar: BasicShapeWidgetToolbarMobile,
    textWidgetToolbar: TextWidgetToolbarMobile,
    imageWidgetToolbar: ImageWidgetToolbarMobile,
    iconWidgetToolbar: IconWidgetToolbarMobile,
    responsiveTextWidgetToolbar: ResponsiveTextToolbarMobile,
    chartWidgetToolbar: ChartWidgetToolbarMobile,
  },
  desktop: {
    basicShapeWidgetToolbar: BasicShapeWidgetToolbar,
    textWidgetToolbar: TextWidgetToolbar,
    imageWidgetToolbar: ImageWidgetToolbar,
    iconWidgetToolbar: IconWidgetToolbar,
    responsiveTextWidgetToolbar: ResponsiveTextToolbar,
    chartWidgetToolbar: ChartWidgetToolbar,
  },
};
