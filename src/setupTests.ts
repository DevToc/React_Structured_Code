// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom';
import { rest, RestRequest, ResponseFunction, RestContext } from 'msw';
import { setupServer } from 'msw/node';

// Set default jest timeout to 10 seconds
jest.setTimeout(10000);

// Polyfill ResizeObserver for node
global.ResizeObserver = require('resize-observer-polyfill');

// intercept and mock API requests for all tests
// can be overridden in individual tests
// will warn if a request is made that is not intercepted and mocked
// see https://mswjs.io
const server = setupServer(
  rest.get(`https://s3.amazonaws.com/media.venngage.com/icons/v1/*.json`, iconInterceptHandler),
  rest.get(/\/api\/user/, userInterceptHandler),
  rest.get(`https://fonts.googleapis.com/css2*`, mockGoogleFontFaceResponse),
  rest.post(/\/commit/, commitInterceptHandler),
  rest.post(`https://api-js.mixpanel.com/track`, mixpanelInterceptHandler),
  rest.post(`https://translation.googleapis.com/language/translate/v2/detect`, mockGoogleTranslateResponse),
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

function mixpanelInterceptHandler(req, res, ctx) {
  return res(ctx.json({ status: 'ok' }));
}

const mockIconResponse = {
  svg: '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width="48px" height="48px" viewBox="0 0 48 48" xml:space="preserve">\n<g>\n\t<rect x="8" y="24.997" fill="#6D4C41" width="17" height="10"/>\n\t<ellipse fill="#6D4C41" cx="16.5" cy="34.5" rx="8.5" ry="5.5"/>\n\t<ellipse fill="#6D4C41" cx="16.5" cy="25.5" rx="8.5" ry="5.5"/>\n</g>\n<ellipse fill="#ECEFF1" cx="16.5" cy="25.5" rx="6.611" ry="3.5"/>\n<ellipse fill="#FF6E40" cx="16.438" cy="25.5" rx="3.563" ry="1.5"/>\n<g>\n\t<g>\n\t\t<path fill="#FFCC80" d="M21.695,21.149L40.515,9.857l-1.029-1.715L19.229,20.296C20.128,20.493,20.96,20.781,21.695,21.149z"/>\n\t\t<polygon fill="#FFCC80" points="8,27.034 4.485,29.143 5.515,30.857 8,29.366 \t\t"/>\n\t</g>\n\t<line fill="none" stroke="#FFCC80" stroke-width="2" x1="5" y1="37" x2="43" y2="20"/>\n\t\n\t\t<rect x="23" y="7.685" transform="matrix(0.4081 0.9129 -0.9129 0.4081 40.2232 -5.0419)" fill="#FFCC80" width="2" height="41.629"/>\n</g>\n<path fill="#3E2723" d="M25,29.147L8.581,36.493c0.343,0.57,0.834,1.093,1.435,1.551L25,31.34V29.147z"/>\n</svg>',
  description: 'missing',
  author: 'Icons8',
  orientation: 1,
  color: 1,
  premium: false,
};

function iconInterceptHandler(req, res, ctx) {
  return res(ctx.json(mockIconResponse));
}

const mockCommitResponse = {
  writeResults: [{ modified_at: '2022-09-21T07:48:13.384Z' }],
};

function commitInterceptHandler() {
  return res(ctx.json(mockCommitResponse));
}

// TODO: add user response mock here
function userInterceptHandler(req, res, ctx) {
  return res(null);
}

/**
 * Mock google language detection v2 response
 */
const mockLanguageDetectResponse = {
  data: {
    detections: [
      [
        {
          confidence: 1,
          isReliable: false,
          language: 'en',
        },
      ],
    ],
  },
};

function mockGoogleTranslateResponse(
  _: RestRequest,
  res: ResponseFunction<typeof mockLanguageDetectResponse>,
  ctx: RestContext,
) {
  return res(ctx.json(mockLanguageDetectResponse));
}

function mockGoogleFontFaceResponse(_: RestRequest, res: ResponseFunction<string>, ctx: RestContext) {
  return res(ctx.text(''));
}
