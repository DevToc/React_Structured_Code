/**
 * Types used or returned by e2-api.
 *
 * For now, these types are re-declared here, but once we start using npm workspaces correctly,
 * these types should be imported directly from e2-api package directly.
 */
import { Replaceable } from '../smart-template/types';

export interface AddResult {
  id: string;
  created_at: Date;
}

export interface SetResult {
  modified_at: Date;
}

/**
 * Response body type for /commit endpoint.
 */
export interface CommitResponse {
  writeResults: Array<AddResult | SetResult | null>;
}

export interface InfographRow {
  id: string;
  infograph: object;
  created_at: Date;
  modified_at: Date;
}

export interface PageRow {
  id: string;
  infograph_id: string;
  page: object;
  created_at: Date;
  modified_at: Date;
}

export interface WidgetRow {
  id: string;
  infograph_id: string;
  page_id: string;
  widget: object;
  created_at: Date;
  modified_at: Date;
}

/**
 * Response body type for /batchGet endpoint.
 */
export interface BatchGetResponse {
  paths: string[];
  docs: Array<InfographRow | PageRow | WidgetRow | InfographRow[] | PageRow[] | WidgetRow[] | null>;
}

/**
 * Response body for /duplicate endpoint.
 */
export interface DuplicateResponse {
  id: string;
  modified_at: string;
}

export interface QueryResult {
  id: string;
  title: string;
  created_at: Date;
  modified_at: Date;
}

/**
 * Response body for /query endpoint.
 */
export interface QueryResponse {
  queryResult: QueryResult[];
}

/**
 * Response body for /templates/newInfograph endpoint.
 */
export interface NewInfographFromTemplateResponse {
  // New infograph id
  infographId: string;
}

/**
 * Response body for /templates/create endpoint.
 */
export interface NewTemplateResponse {
  // New template id
  templateId: string;
  // ID of the infograph this template will copy data from when new infograph is created from the template
  infographId: string;
  // ISO 8601 timestamp
  createdAt: string;
}

export interface TemplateResponseBody {
  templates: Array<{
    templateId: string;
    infographId: string;
    createdAt: string;
    modifiedAt: string;
    replaceables?: Replaceable[];
  }>;
}
