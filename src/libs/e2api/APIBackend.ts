import { API_DOMAIN, PHP_PROXY_API_DOMAIN } from '../../constants/infograph';

export interface APIBackendOptions {
  authToken?: string;
}

export enum ErrorCodes {
  PreRequest,
  ParseResponse,
}

export class ErrorResponse {
  code: ErrorCodes;
  message: string;

  constructor(code: ErrorCodes, message: string) {
    this.code = code;
    this.message = message;
  }
}

export class APIBackend {
  readonly domain: string = API_DOMAIN || PHP_PROXY_API_DOMAIN || '';
  readonly versionPrefix: string = '';
  readonly requestHeaders = new Map<string, string>([['content-type', 'application/json']]);
  // TODO: Should setup these headers to make requests more secure.
  // mode: 'cors', // no-cors, *cors, same-origin
  // cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
  // credentials: 'same-origin', // include, *same-origin, omit
  // redirect: 'follow', // manual, *follow, error
  // referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url

  constructor(options: APIBackendOptions) {
    if (options.authToken) {
      this.requestHeaders.set('authorization', `token ${options.authToken}`);
    }
  }

  setAuthToken(token: string) {
    this.requestHeaders.set('authorization', `Bearer ${token}`);
  }

  get baseUrl(): string {
    return `${this.domain}${this.versionPrefix}`;
  }

  // Callee knows what
  async request<T>(path: string, body: { [key: string]: any }): Promise<T> {
    let baseUrl = this.baseUrl;

    // Only for calls that's supported now (saving/loading)
    if (PHP_PROXY_API_DOMAIN && body.id) {
      baseUrl = PHP_PROXY_API_DOMAIN;
    }

    const response = await fetch([baseUrl, path].join(''), {
      method: 'POST',
      headers: Object.fromEntries(this.requestHeaders),
      body: JSON.stringify(body),
    }).catch((e) => {
      throw new ErrorResponse(ErrorCodes.PreRequest, `fetch failed with : ${e}`);
    });

    if (!response) {
      throw new ErrorResponse(ErrorCodes.ParseResponse, 'Empty response from fetch');
    }

    const responseBody = await response.json().catch((e) => {
      throw new ErrorResponse(ErrorCodes.ParseResponse, 'Error while parsing response as json');
    });

    if (!responseBody) {
      throw new ErrorResponse(ErrorCodes.ParseResponse, 'Empty response json body');
    }

    // TODO: make sure the fetch follows redirects, and doesn't return >= 300 ?
    if (response.status >= 200 || response.status <= 299) {
      return responseBody;
    } else {
      // Treat all other status code as error, server should return {code, message} json
      if (responseBody.code && responseBody.message) {
        throw new ErrorResponse(responseBody.code, responseBody.message);
      } else {
        throw new ErrorResponse(
          ErrorCodes.ParseResponse,
          'Server returned error response which did not contain proper error code and message',
        );
      }
    }
  }
}
