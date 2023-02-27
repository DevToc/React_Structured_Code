/**
 * Generates ids of infographs, pages, widgets.
 *
 * All above ids are fixed at 28 chars long.
 */
import { customAlphabet } from 'nanoid';

import { WidgetType } from 'types/widget.types';
import { InfographId, WidgetId, PageId } from 'types/idTypes';

const alphabet = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
const nanoid = customAlphabet(alphabet, 28);

/**
 * Generate new infograph id.
 */
export function newInfographId(): InfographId {
  return nanoid();
}

/**
 * Generate new page id.
 */
export function newPageId(): PageId {
  return nanoid();
}

/**
 * Generate new infograph id.
 */
export function newWidgetId(t: WidgetType): WidgetId {
  return `${t}.${nanoid(24)}`;
}

/**
 * Generate new template id.
 */
export function newTemplateId(): string {
  return nanoid(28);
}

/**
 * Replace random id portion of exiting widget id, keeping the type portion of
 * the id same (first 4 chars).
 */
export function newWidgetIdFromExistingId(existingId: WidgetId): WidgetId {
  // make sure existing id is correct
  const wType = existingId.substring(0, 3);
  if (wType.length !== 3) {
    throw new Error('Not enough chars for widget type - must be 3 char length');
  }
  return newWidgetId(wType as WidgetType);
}
