// This function is to calculate the proper topPx value when adding widget from the widget menu
// The purpose is to add the widget to the current screen where users are viewing so that scroller doesn't need to reset
// The logic is to first get the scrollTop attribute of pageContainer element, the scrolling Px to the top, and add 30% of widget menu height
// Then use this value (roughly the middle of current screen) divided by the zoom level

// Note: For the horizontal position, as we don't have many templates with very large width, simply apply 0.15 of infograph width as left margin when first added
// except use 0.1 infograph page width for charts as it would also open the side menu, narrowing down the screen width

const calculateInitialTopPx = (zoom: number): number => {
  const pageContainerEl = document.getElementById('page-scroll-container');
  const pageScrollOffset = pageContainerEl?.scrollTop || 0;
  const widgetMenuEl = document.querySelector('[data-testid="widget-menu-sidebar"]') as HTMLElement | null;
  const widgetMenuHeight = widgetMenuEl?.offsetHeight || 0;
  return (pageScrollOffset + 0.3 * widgetMenuHeight) / zoom;
};

const INITIAL_LEFTPX_RATIO = 0.15;
const INITIAL_LEFTPX_RATIO_CHARTS = 0.1;

export { calculateInitialTopPx, INITIAL_LEFTPX_RATIO, INITIAL_LEFTPX_RATIO_CHARTS };
