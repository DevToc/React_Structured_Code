import { isElementInToolbarFocused } from '../Focus.helpers';
import { EDITOR_TOOLBAR_ID } from '../../../Editor.config';

describe('Focus/Focus.helpers.ts', () => {
  describe('isElementInToolbarFocused', () => {
    test('should check if element in toolbar is focused', () => {
      const noEl = isElementInToolbarFocused([]);
      expect(noEl).toBe(false);

      const mockEl = document.createElement('div');
      mockEl.id = EDITOR_TOOLBAR_ID;
      const mockElTwo = document.createElement('div');

      const hasEl = isElementInToolbarFocused([mockEl, mockElTwo]);
      expect(hasEl).toBe(true);
    });
  });
});
