import { zIndices } from '../z-index';

describe('theme', () => {
  describe('z-index', () => {
    test('zIndices should be in the correct order', () => {
      // popover should be the highest index
      expect(!!zIndices.popOver).toEqual(true);
      expect(Object.values(zIndices).sort((a, b) => b - a)[0]).toEqual(zIndices.popOver);

      // skip-links should be the second highest index
      expect(!!zIndices.skipLinks).toEqual(true);
      expect(Object.values(zIndices).sort((a, b) => b - a)[1]).toEqual(zIndices.skipLinks);

      // navbar should be  above the toolbar
      expect(!!zIndices.navbar).toEqual(true);
      expect(!!zIndices.toolbar).toEqual(true);
      expect(zIndices.navbar).toBeGreaterThan(zIndices.toolbar);

      // navbar should be above the side menu settings
      expect(!!zIndices.sideMenuSettings).toEqual(true);
      expect(zIndices.navbar).toBeGreaterThan(zIndices.sideMenuSettings);

      // navbar should be above the accessibility menu
      expect(!!zIndices.accessibilityMenu).toEqual(true);
      expect(zIndices.navbar).toBeGreaterThan(zIndices.accessibilityMenu);

      // accessibility menu should be above the toolbar
      expect(zIndices.accessibilityMenu).toBeGreaterThan(zIndices.toolbar);

      // page manager should be above the boundingBox
      expect(!!zIndices.boundingBox).toEqual(true);
      expect(!!zIndices.pageManager).toEqual(true);
      expect(zIndices.pageManager).toBeGreaterThan(zIndices.boundingBox);
    });
  });
});
