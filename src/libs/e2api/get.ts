/**
 * @deprecated This file will be removed - please use Client.ts
 */
import { APIBackend } from './APIBackend';

import { InfographId, PageId, WidgetId } from '../../types/idTypes';
import { Page } from '../../types/pageTypes';
import { AllWidgetData } from '../../widgets/Widget.types';
import type { InfographState, WidgetsMap, PagesMap } from '../../types/infographTypes';
import { initialState } from '../../modules/Editor/store/infographSlice';
import { PHP_PROXY_API_DOMAIN } from '../../constants/infograph';

export const backend = new APIBackend({});

/**
 * Data returned by DB for infographs table
 */
interface InfographRow {
  id: string;
  infograph: object;
  created_at: Date;
  modified_at: Date;
}

/**
 * Data returned by DB for pages table
 */
interface PageRow {
  id: string;
  infograph_id: string;
  page: object;
  created_at: Date;
  modified_at: Date;
}

/**
 * Data returned by DB for widgets table
 */
interface WidgetRow {
  id: string;
  infograph_id: string;
  page_id: string;
  widget: object;
  created_at: Date;
  modified_at: Date;
}

interface BatchGetResponse {
  paths: string[];
  docs: Array<InfographRow | PageRow | WidgetRow | InfographRow[] | PageRow[] | WidgetRow[] | null>;
}

function parseInfograph(infographRow: InfographRow): InfographState {
  if (infographRow['id'] && infographRow['infograph']) {
    // Use initial state + override any data got back from server
    return {
      ...initialState,
      ...infographRow['infograph'],
      id: infographRow['id'].trim() as InfographId,
    };
  } else {
    throw new Error('Could not find proper infograph id and data from response');
  }
}

function parsePages(pageRows: PageRow[]): PagesMap {
  return pageRows.reduce<PagesMap>((prev, curr: PageRow) => {
    if (curr['id'] && curr['page']) {
      prev[(curr['id'] as PageId).trim()] = curr['page'] as Page;
    } else {
      throw new Error('Could not find proper page id and data from response');
    }
    return prev;
  }, {});
}

function parseWidgets(widgetRows: WidgetRow[]): WidgetsMap {
  return widgetRows.reduce<WidgetsMap>((prev, curr: WidgetRow) => {
    if (curr['id'] && curr['widget']) {
      prev[(curr['id'] as WidgetId).trim()] = curr['widget'] as AllWidgetData;
    } else {
      throw new Error('Could not find proper widget id and data from response');
    }
    return prev;
  }, {});
}

/**
 * Fetch all infograph/page/widget document that belongs to an infograph.
 *
 * @param infographId
 *
 * @deprecated Please use Documents class in Documents.ts
 */
export async function getFullInfograph(infographId: InfographId, publicFetch = false): Promise<InfographState> {
  // Paths for all infograph/page/widget documents
  const docPaths = [
    `infographs/${infographId}`,
    `infographs/${infographId}/pages`,
    `infographs/${infographId}/widgets`,
  ];

  // for pl page, publicFetch reaches api/design/publicFetch endpoint
  const path = PHP_PROXY_API_DOMAIN ? (publicFetch ? '/publicFetch' : '') : '/batchGet';

  const responseObj = await backend.request<BatchGetResponse>(path, {
    // Requests to php backend api/design
    ...(PHP_PROXY_API_DOMAIN && { id: infographId }),
    // Requests to editor2 api
    ...(!PHP_PROXY_API_DOMAIN && { paths: docPaths }),
  });

  const docs = responseObj.docs;

  if (!docs) {
    throw new Error('Expected docs property from response but not found');
  }

  // Parse infograph data
  let fullInfograph: InfographState;

  if (docs[0] && !Array.isArray(docs[0])) {
    fullInfograph = parseInfograph(docs[0] as InfographRow);
  } else {
    throw new Error('Infograph not found');
  }

  // Parse list of pages
  if (docs[1] && Array.isArray(docs[1])) {
    fullInfograph.pages = parsePages(docs[1] as PageRow[]);
  } else {
    // No pages found
    fullInfograph.pages = {};
  }

  // Parse all widget rows to correct type for redux state
  if (docs[2] && Array.isArray(docs[2])) {
    fullInfograph.widgets = parseWidgets(docs[2] as WidgetRow[]);
  } else {
    // No widgets found
    fullInfograph.widgets = {};
  }

  return fullInfograph;
}
