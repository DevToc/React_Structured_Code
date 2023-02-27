import { Patch } from 'immer';
import clonedeep from 'lodash.clonedeep';

import { PHP_PROXY_API_DOMAIN } from 'constants/infograph';
import { InfographState, PagesMap, WidgetsMap } from 'types/infographTypes';
import { InfographId, PageId, WidgetId } from 'types/idTypes';
import { AllWidgetData } from 'widgets/Widget.types';
import { Page } from 'types/pageTypes';
import { initialState } from 'modules/Editor/store/infographSlice';
import { getPageWidgetIds } from '../../widgets/Widget.helpers';
import * as types from './types';
import { APIBackend } from './APIBackend';
import { RichDocument } from '../smart-template/types';

/**
 * e2-api client to access the api.
 */
export class Client {
  readonly api: APIBackend;

  constructor(backend: APIBackend) {
    this.api = backend;
  }

  /**
   * Save entire InfographState to backend.
   *
   * Ues /commit endpoint, breaks down each infograph, each page, each widget, into
   * write command for /commit endpoint.
   *
   * @param infographSliceState
   * @param originalEditorId
   */
  async saveFullInfograph(infographSliceState: InfographState, originalEditorId?: string) {
    // split to infograph, page, widget documents
    const { id: infographId, pages, widgets } = infographSliceState;

    // If these essential ones are not in object, do nothing
    if (!infographId) {
      // console.debug('saveFullInfograph cancelled due to uninitialized infograph id')
      // TODO: This should be an error.
      return;
    }

    const commitCommands: Array<object> = [];

    // Save infograph, except pages and widgets
    // Clone the infograph since we do not want to modify or change source state
    // Can be optimized / cleaned up by just picking what we need, instead of full clone + delete.
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

    // TODO: Should not use special body format for proxy - remove special case of request being
    //       proxied via PHP when JWT is done.
    await this.api.request<types.CommitResponse>('/commit', {
      ...(PHP_PROXY_API_DOMAIN && { id: originalEditorId }),
      writes: commitCommands,
    });

    // TODO: handle error
  }

  /**
   * Fetch all infograph/page/widget document that belongs to an infograph.
   *
   * TODO: PHP_PROXY_API_DOMAIN should not be used.
   *
   * @param infographId
   * @param publicFetch Fetch from different /publicFetch API endpoint when PHP proxy is defined (This option should be gone)
   */
  async getFullInfograph(infographId: InfographId, publicFetch = false): Promise<InfographState> {
    // Paths for all infograph/page/widget documents
    const docPaths = [
      `infographs/${infographId}`,
      `infographs/${infographId}/pages`,
      `infographs/${infographId}/widgets`,
    ];

    // for pl page, publicFetch reaches api/design/publicFetch endpoint
    // TODO - This special case should be gone
    const path = PHP_PROXY_API_DOMAIN ? (publicFetch ? '/publicFetch' : '') : '/batchGet';

    // TODO - This special case should be gone
    const responseObj = await this.api.request<types.BatchGetResponse>(path, {
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
      fullInfograph = parseInfograph(docs[0] as types.InfographRow);
    } else {
      throw new Error('Infograph not found');
    }

    // Parse list of pages
    if (docs[1] && Array.isArray(docs[1])) {
      fullInfograph.pages = parsePages(docs[1] as types.PageRow[]);
    } else {
      // No pages found
      fullInfograph.pages = {};
    }

    // Parse all widget rows to correct type for redux state
    if (docs[2] && Array.isArray(docs[2])) {
      fullInfograph.widgets = parseWidgets(docs[2] as types.WidgetRow[]);
    } else {
      // No widgets found
      fullInfograph.widgets = {};
    }

    return fullInfograph;
  }

  /**
   * Get list of recently modified infographs. The /query endpoint returns last 100 infographs.
   *
   * TODO: This endpoint will fail if proper permission is not contained in JWT token (in future)
   */
  async getAllInfographs() {
    // TODO: Handle error
    const r = await this.api.request<types.QueryResponse>('/query', {});
    return r['queryResult'];
  }

  /**
   * Create a new infograph from a template.
   *
   * Will create new infograph by copying source infograph pointed by the template.
   *
   * You can choose to patch the source infograph with any data. The patch will be applied to
   * a clone of source infograph, so the paths in the patch must be valid for source infograph
   * of the template.
   *
   * @param templateId Target template ID
   * @param patches Immer patch to be applied before cloned
   */
  async newInfographFromTemplate(
    templateId: string,
    patches: Patch[] = [],
  ): Promise<types.NewInfographFromTemplateResponse> {
    // TODO: Handle error
    return await this.api.request<types.NewInfographFromTemplateResponse>('/templates/newInfograph', {
      fromTemplateId: templateId,
      patches,
    });
  }

  /**
   * Duplicate any infograph.
   *
   * Given an infograph id, create an identical infograph with new ids for infograph, all pages,
   * and all widgets that belong to the infograph.
   *
   * @param infographId
   */
  async duplicateInfograph(infographId: string): Promise<types.DuplicateResponse> {
    const r = await this.api.request<types.DuplicateResponse>('/duplicate', {
      sourcePath: `infographs/${infographId}`,
    });

    // TODO: Handle error
    return r;
  }

  /**
   * Create new template from infograph.
   *
   * Creating a new template will result in duplicating the source infograph. Duplicated source
   * infograph will be tagged as a template infograph, which will limit what can be done
   * to the infograph. (ex. not implemented yet, but will prevent it from being deleted)
   *
   * Create new entry in templates table.
   *
   * @param infographId
   */
  async newTemplate(infographId: string): Promise<types.NewTemplateResponse> {
    const r = await this.api.request<types.NewTemplateResponse>('/templates/create', {
      sourceInfographId: infographId,
    });

    // TODO: Handle error
    return r;
  }

  async getTemplate(templateId: string): Promise<types.TemplateResponseBody> {
    const r = await this.api.request<types.TemplateResponseBody>('/templates/query', {
      templateId: templateId,
    });

    // TODO: Handle error
    return r;
  }

  async inferRichDocument(doc: RichDocument): Promise<{ document: RichDocument }> {
    const r = await this.api.request<{ document: RichDocument }>('/templates/infer', { document: doc });

    // TODO: Handle error
    return r;
  }

  async getReplaceableTemplates(): Promise<types.TemplateResponseBody> {
    const r = await this.api.request<types.TemplateResponseBody>('/templates/query?replaceablesOnly=true', {});

    // TODO: Handle error
    return r;
  }
}

/**
 * Returns a valid InfographState from /batchGet response, filling in all required data (supplied
 * by `initialState`).
 *
 * @param infographRow
 */
function parseInfograph(infographRow: types.InfographRow): InfographState {
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

/**
 * Creates valid PageMap from rows of Page documents returned by `/batchGet` endpoint.
 *
 * @param pageRows
 */
function parsePages(pageRows: types.PageRow[]): PagesMap {
  return pageRows.reduce<PagesMap>((prev, curr: types.PageRow) => {
    if (curr['id'] && curr['page']) {
      prev[(curr['id'] as PageId).trim()] = curr['page'] as Page;
    } else {
      throw new Error('Could not find proper page id and data from response');
    }
    return prev;
  }, {});
}

/**
 * Creates valid WidgetsMap from rows of Widget documents returned by `/batchGet` endpoint.
 *
 * @param widgetRows
 */
function parseWidgets(widgetRows: types.WidgetRow[]): WidgetsMap {
  return widgetRows.reduce<WidgetsMap>((prev, curr: types.WidgetRow) => {
    if (curr['id'] && curr['widget']) {
      prev[(curr['id'] as WidgetId).trim()] = curr['widget'] as AllWidgetData;
    } else {
      throw new Error('Could not find proper widget id and data from response');
    }
    return prev;
  }, {});
}
