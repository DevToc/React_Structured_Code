/**
 * @deprecated This file will be removed - please use Client.ts
 */

import clonedeep from 'lodash.clonedeep';

import { InfographState } from '../../types/infographTypes';
import { APIBackend } from './APIBackend';
import { getPageWidgetIds } from '../../widgets/Widget.helpers';
import { PHP_PROXY_API_DOMAIN } from '../../constants/infograph';

export const backend = new APIBackend({});

// NOTE - MUST MATCH BACKEND CODE - editor2-api repo
interface AddResult {
  id: string;
  created_at: Date;
}

interface SetResult {
  modified_at: Date;
}

interface CommitResponse {
  writeResults: Array<AddResult | SetResult | null>;
}

/**
 * @deprecated Please use Client.ts
 * @param infographSliceState
 * @param originalEditorId
 */
export async function saveFullInfograph(infographSliceState: InfographState, originalEditorId?: string) {
  // console.debug('save infograph', infographSliceState)

  // split to infograph, page, widget documents

  const { id: infographId, pages, widgets } = infographSliceState;

  // If these essential ones are not in object, do nothing
  if (!infographId) {
    // console.debug('saveFullInfograph cancelled due to uninitialized infograph id')
    return;
  }

  const commitCommands: Array<object> = [];

  // Save infograph, except pages and widgets
  const copyInfograph: Partial<InfographState> = clonedeep(infographSliceState);
  delete copyInfograph.pages;
  delete copyInfograph.widgets;

  commitCommands.push({
    set: {
      path: `infographs/${infographId}`,
      fields: copyInfograph,
    },
  });

  // Save pages
  for (const pageId of Object.keys(pages)) {
    commitCommands.push({
      set: {
        path: `infographs/${infographId}/pages/${pageId}`,
        fields: pages[pageId],
      },
    });

    const pageWidgetIds = getPageWidgetIds(pages[pageId], widgets);

    // Save widgets
    for (const widgetId of pageWidgetIds) {
      if (!widgets[widgetId]) continue;

      commitCommands.push({
        set: {
          path: `infographs/${infographId}/pages/${pageId}/widgets/${widgetId}`,
          fields: widgets[widgetId],
        },
      });
    }
  }

  await backend.request<CommitResponse>('/commit', {
    ...(PHP_PROXY_API_DOMAIN && { id: originalEditorId }),
    writes: commitCommands,
  });

  // TODO: handle error
}

interface DuplicateResponse {
  id: string;
  modified_at: string;
}

/**
 *
 * @deprecated Please use Client.ts
 * @param infographId
 */
export async function duplicateInfograph(infographId: string): Promise<DuplicateResponse> {
  const r = await backend.request<DuplicateResponse>('/duplicate', {
    sourcePath: `infographs/${infographId}`,
  });

  return r;
}

interface NewTemplateResponse {
  // New template id
  templateId: string;
  // ID of the infograph this template will copy data from when new infograph is created from the template
  infographId: string;
  // ISO 8601 timestamp
  createdAt: string;
}

/**
 * Create new template from infograph
 * @deprecated Please use Client.ts
 * @param infographId
 */
export async function newTemplate(infographId: string): Promise<NewTemplateResponse> {
  const r = await backend.request<NewTemplateResponse>('/templates/create', {
    sourceInfographId: infographId,
  });

  return r;
}
