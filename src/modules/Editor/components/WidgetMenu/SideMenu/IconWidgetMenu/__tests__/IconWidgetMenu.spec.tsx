import { screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { rest } from 'msw';
import { setupServer } from 'msw/node';

import { renderWithRedux } from 'utils/test-utils.test';
import { IconWidgetMenu } from '../IconWidgetMenu';

const mockIconId = 'fish-123';
const mockIcon = {
  svg: '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width="48px" height="48px" viewBox="0 0 48 48" xml:space="preserve">\n<g>\n\t<rect x="8" y="24.997" fill="#6D4C41" width="17" height="10"/>\n\t<ellipse fill="#6D4C41" cx="16.5" cy="34.5" rx="8.5" ry="5.5"/>\n\t<ellipse fill="#6D4C41" cx="16.5" cy="25.5" rx="8.5" ry="5.5"/>\n</g>\n<ellipse fill="#ECEFF1" cx="16.5" cy="25.5" rx="6.611" ry="3.5"/>\n<ellipse fill="#FF6E40" cx="16.438" cy="25.5" rx="3.563" ry="1.5"/>\n<g>\n\t<g>\n\t\t<path fill="#FFCC80" d="M21.695,21.149L40.515,9.857l-1.029-1.715L19.229,20.296C20.128,20.493,20.96,20.781,21.695,21.149z"/>\n\t\t<polygon fill="#FFCC80" points="8,27.034 4.485,29.143 5.515,30.857 8,29.366 \t\t"/>\n\t</g>\n\t<line fill="none" stroke="#FFCC80" stroke-width="2" x1="5" y1="37" x2="43" y2="20"/>\n\t\n\t\t<rect x="23" y="7.685" transform="matrix(0.4081 0.9129 -0.9129 0.4081 40.2232 -5.0419)" fill="#FFCC80" width="2" height="41.629"/>\n</g>\n<path fill="#3E2723" d="M25,29.147L8.581,36.493c0.343,0.57,0.834,1.093,1.435,1.551L25,31.34V29.147z"/>\n</svg>',
  description: 'missing',
  author: 'Icons8',
  orientation: 1,
  color: 1,
  premium: false,
};

const mockQuery = 'fish';
const mockEmptyQuery = 'empty';
const mockErrorQuery = 'error';

const algoliaInterceptHandler = (req, res, ctx) => {
  const body = JSON.parse(req.body);

  if (body.query === mockQuery) return res(ctx.json({ hits: [{ id: mockIconId }] }));
  if (body.query === mockEmptyQuery) return res(ctx.json({ hits: [] }));
  if (body.query === mockErrorQuery) return res(ctx.status(500), ctx.json({ error: 'Internal server error' }));
};

const iconInterceptHandler = (req, res, ctx) => res(ctx.json(mockIcon));

const server = setupServer(
  // catch all Algolia search requests - algolia appends different numbers to the post url occassionally
  rest.post('https://*.algolianet.com/1/indexes/Icons%20v16/query', algoliaInterceptHandler),
  rest.post('https://*-dsn.algolia.net/1/indexes/Icons%20v16/query', algoliaInterceptHandler),

  rest.get(`https://s3.amazonaws.com/media.venngage.com/icons/v1/${mockIconId}.json`, iconInterceptHandler),
  rest.get(`https://s3.amazonaws.com/media.venngage.com/icons/v1/*.json`, iconInterceptHandler),
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe('components/WidgetMenu/IconWidgetMenu', () => {
  const spinner = /icon-widgetmenu-spinner/;
  const iconList = /iconwidgetmenu-icon-list/;
  const iconPackTabMenu = /icon-pack-style-tab-menu/;
  const iconPackList = /iconwidgetmenu-icon-pack-list/;
  const iconTabMenu = /icon-style-tab-menu/;
  const searchButton = /search-icons-button/;
  const clearSearchButton = /clear-icon-search-button/;
  const inputPlaceHolder = /Search icons/;
  const iconMenuProps = { isIconWidgetMenuActive: true, onClickIconWidget: () => {} };

  it('Should display icon pack list initially', async () => {
    renderWithRedux(<IconWidgetMenu {...iconMenuProps} />);

    expect(screen.queryByTestId(spinner)).not.toBeInTheDocument();
    expect(screen.getByTestId(iconPackList)).toBeInTheDocument();
    expect(screen.getByTestId(iconPackTabMenu)).toBeInTheDocument();
  });

  it('Should search, display and clear icons', async () => {
    renderWithRedux(<IconWidgetMenu {...iconMenuProps} />);

    const input = screen.getByPlaceholderText(inputPlaceHolder);
    const search = screen.getByTestId(searchButton);
    const clearSearch = screen.getByTestId(clearSearchButton);

    await userEvent.type(input, mockQuery);
    expect(input).toHaveValue(mockQuery);

    fireEvent.click(search);

    expect(screen.getByTestId(spinner)).toBeInTheDocument();

    const styleTabMenu = await screen.findByTestId(iconTabMenu);
    expect(screen.getAllByTestId(iconList)[0]).toBeInTheDocument();
    expect(styleTabMenu).toBeInTheDocument();
    expect(screen.getByTestId(iconTabMenu)).toBeInTheDocument();
    expect(screen.queryByTestId(spinner)).not.toBeInTheDocument();

    fireEvent.click(clearSearch);

    // On clear, should show default icon pack view
    expect(styleTabMenu).not.toBeInTheDocument();
    expect(screen.getByTestId(iconPackList)).toBeInTheDocument();
    expect(screen.queryByTestId(spinner)).not.toBeInTheDocument();
  });

  it('should display empty results if no icon results found', async () => {
    renderWithRedux(<IconWidgetMenu {...iconMenuProps} />);

    const input = screen.getByPlaceholderText(inputPlaceHolder);
    const search = screen.getByTestId(searchButton);

    await userEvent.type(input, mockEmptyQuery);
    expect(input).toHaveValue(mockEmptyQuery);

    fireEvent.click(search);

    const noResultsMessage = await screen.findByText(`We didn't find any icons for ${mockEmptyQuery}`);
    expect(noResultsMessage).toBeInTheDocument();
    expect(screen.queryByTestId(iconList)).not.toBeInTheDocument();
    expect(screen.queryByTestId(spinner)).not.toBeInTheDocument();
    expect(screen.queryByTestId(iconTabMenu)).not.toBeInTheDocument();
  });

  it('should display empty results for error', async () => {
    renderWithRedux(<IconWidgetMenu {...iconMenuProps} />);

    const input = screen.getByPlaceholderText(inputPlaceHolder);
    const search = screen.getByTestId(searchButton);

    await userEvent.type(input, mockErrorQuery);
    expect(input).toHaveValue(mockErrorQuery);

    fireEvent.click(search);

    const noResultsMessage = await screen.findByText(`We didn't find any icons for ${mockErrorQuery}`, undefined, {
      timeout: 10000,
    });
    expect(noResultsMessage).toBeInTheDocument();

    expect(screen.queryByTestId(iconList)).not.toBeInTheDocument();
    expect(screen.queryByTestId(spinner)).not.toBeInTheDocument();
    expect(screen.queryByTestId(iconTabMenu)).not.toBeInTheDocument();
  });
});
