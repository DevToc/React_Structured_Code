import { IgnoreEventElement, IgnoreEventRole } from './Editor.config';

export const shouldIgnoreEventTarget = (target: HTMLElement): boolean => {
  if (!target) return false;
  if (!target.getAttribute) return false;
  if (target.getAttribute('data-allow-global-event')) return false;

  const tagName = target?.tagName as IgnoreEventElement;
  if (tagName && IgnoreEventElement[tagName]) return true;

  const role = target.getAttribute('role') as IgnoreEventRole;
  if (role && IgnoreEventRole[role]) return true;

  return false;
};
