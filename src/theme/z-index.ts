const zIndices = {
  /**
   *
   */
  boundingBox: 1000,
  pageManager: 1001,
  sideMenu: 1002,
  lineWidgetHandle: 1003,
  port: 1004,
  sideBar: 1005,
  toolbar: 1006,
  // should be higher than the toolbar as it's rendered above the toolbar
  accessibilityMenu: 1007,
  sideMenuSettings: 1007,
  navbar: 1008,
  fontMenu: 1008,
  // should be above all other content
  skipLinks: 1009,
  // Nothing can be on top of a temporary popover, including skipLinks.
  popOver: 2000,
};

export { zIndices };
