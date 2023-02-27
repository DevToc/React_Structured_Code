import { parseIcons } from '../usePaginatedIconSearch.helpers';

describe('UsePaginatedIconSearch/UsePaginatedIconSearch.helpers.ts', () => {
  describe('parseIcons', () => {
    test('should parse icons from data', () => {
      const iconResponse = {
        hits: [{ id: 'icons8-3029' }, { id: 'icons8-1234' }],
      };

      const icons = parseIcons([iconResponse, iconResponse, iconResponse, undefined]);
      expect(icons.length).toEqual(6);

      const noIcons = parseIcons(undefined);
      expect(noIcons.length).toEqual(0);
    });
    test('should exclude old icons', () => {
      const iconResponse = {
        hits: [
          { id: 'icons8-3029' },
          { id: 'rjs2-icon-circle-wrench' },
          { id: 'fa3-icon-fish' },
          { id: 'vg-icon-oval' },
        ],
      };

      const icons = parseIcons([iconResponse]);
      expect(icons.length).toEqual(1);
    });
  });
});
