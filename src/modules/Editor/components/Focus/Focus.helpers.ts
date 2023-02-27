import { EDITOR_TOOLBAR_ID } from '../../Editor.config';

export const isElementInToolbarFocused = (path: HTMLElement[]): boolean =>
  path.some((el: HTMLElement) => el?.id === EDITOR_TOOLBAR_ID);
