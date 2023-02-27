/**
 * @deprecated This file will be removed - please use Client.ts
 */
import { APIBackend } from './APIBackend';

import { Patch } from 'immer';

export const backend = new APIBackend({});

export interface QueryResult {
  id: string;
  title: string;
  created_at: Date;
  modified_at: Date;
}

interface QueryResponse {
  queryResult: QueryResult[];
}

/**
 * List of all infographs
 *
 * TODO - !!! REMOVE ME FOR PRODUCTION IN FUTURE !!!
 */
export async function getAllInfographs() {
  const r = await backend.request<QueryResponse>('/query', {});
  return r['queryResult'];
}

// See `editor2-api/src/handler/templates/query/types.ts
// interface RequestBody {
//   templateId?: string;
// }

export interface TemlpateEntry {
  templateId: string;
  infographId: string;
  createdAt: string;
  modifiedAt: string;
}

export interface TemplateResponseBody {
  templates: Array<TemlpateEntry>;
}

/**
 * List of all templates
 * @deprecated Please use Documents.ts
 */
export async function getAllTemplates(templateId?: string) {
  const r = await backend.request<TemplateResponseBody>('/templates/query', { templateId });
  return r['templates'];
}

/**
 * Data returned by DB for pages table
 */
export interface PageRow {
  id: string;
  infograph_id: string;
  page: object;
  created_at: Date;
  modified_at: Date;
}

interface BatchGetResponse {
  paths: string[];
  docs: Array<PageRow[] | null>;
}

/**
 *
 * @param infographId
 * @deprecated Please use Documents.ts
 */
export async function getInfographPages(infographId: string) {
  const r = await backend.request<BatchGetResponse>('/batchGet', {
    paths: [`infographs/${infographId}`, `infographs/${infographId}/pages`],
  });
  const infoDoc = r['docs'][0];

  // @ts-ignore
  const firstPageId = infoDoc['infograph']['pageOrder'][0];
  const pages = r['docs'][1];

  // @ts-ignore
  const fPage = pages.find((p) => p.id === firstPageId);

  return fPage;
}

export interface NewInfographFromTemplateResponse {
  // New infograph id
  infographId: string;
}

/**
 *
 * @param templateId
 * @param patches
 * @deprecated Please use Documents.ts
 */
export async function newFromTemplate(
  templateId: string,
  patches: Patch[] = [],
): Promise<NewInfographFromTemplateResponse> {
  return await backend.request<NewInfographFromTemplateResponse>('/templates/newInfograph', {
    fromTemplateId: templateId,
    patches,
  });
}
