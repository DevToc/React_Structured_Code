import { InfographState, PageSize } from '../types/infographTypes';

const EXPORT_BACKEND_ENDPOINT = process.env.REACT_APP_EXPORT_BACKEND_ENDPOINT as string;
const EXPORT_FRONTEND_ENDPOINT = process.env.REACT_APP_EXPORT_FRONTEND_ENDPOINT ?? `${window.location.origin}/export`;

export enum ExportType {
  pdf = 'pdf',
  png = 'png',
}

export enum ExportScale {
  default = 1,
  PNGHD = 3.125,
}

export interface ExportOptions {
  id: string;

  // If we decide to couple export server with API server, following options can be remove later on
  baseUrl?: string;
  pages?: string[];
  type?: ExportType;
  scale?: number;
  size?: Partial<PageSize>;
  // require for accessbility pdf
  metadata?: {
    title: string;
    subtitle: string;
    language: string;
  };
}

export interface DownloadAPIResponse {
  url: string;
}

/**
 * Get default export options from giving infograph state
 *
 * @param infograph - An infograph state
 * @returns
 */
export const parseDefaultExportOptions = (infograph: InfographState): ExportOptions => {
  return {
    id: infograph.id,
    baseUrl: EXPORT_FRONTEND_ENDPOINT,
    pages: infograph.pageOrder,
    type: ExportType.pdf,
    size: infograph.size,
    scale: ExportScale.default,
    metadata: {
      title: infograph.title,
      subtitle: '',
      language: infograph.language?.iso639_1_Code,
    },
  };
};

/**
 * Note: We may need to add AbortController to allow user to cancel the API request
 *
 * @param infograph - An infograph state
 * @param options - Optional options to overwrite default options
 * @returns
 */
export const exportRequest = async (
  infograph: InfographState,
  options?: Partial<ExportOptions>,
): Promise<DownloadAPIResponse | undefined> => {
  try {
    if (!EXPORT_BACKEND_ENDPOINT) throw new Error('API endpoint is not defined');

    const requestData = Object.assign(parseDefaultExportOptions(infograph), options);
    const response = await fetch(EXPORT_BACKEND_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestData),
    });

    if (!response.ok) throw new Error(`Fail to download: ${response.status}`);

    return response.json() as Promise<DownloadAPIResponse>;
  } catch (error: unknown) {
    console.error(error);
  }
};

/**
 * Note: Old browser will not be supported
 *
 * @param url - A download link
 * @param fileName - Filename to save
 */
export const saveAs = (url: string, fileName: string, successCallback?: () => void, failureCallback?: () => void) => {
  try {
    const link = new URL(url);

    let a = document.createElement('a');
    a.download = fileName;
    a.href = link.toString();
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    if (successCallback) successCallback();
  } catch (error) {
    if (failureCallback) failureCallback();
  }
};
