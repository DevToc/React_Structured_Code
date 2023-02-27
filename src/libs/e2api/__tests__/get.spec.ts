import { getFullInfograph } from '../get';
import { enableFetchMocks } from 'jest-fetch-mock';

enableFetchMocks();

describe('libs/infograph/get', () => {
  beforeEach(() => {
    fetch.resetMocks();
  });

  it('get full infograph', async () => {
    fetch.mockResponseOnce(
      JSON.stringify({
        paths: [],
        docs: [
          // infograph
          {
            id: 'info1',
            infograph: {
              title: 'hihi',
            },
          },
          // Pages
          [
            {
              id: 'page1',
              infograph_id: 'info1',
              page: {
                prop1: 123,
              },
            },
          ],
          // Widgets
          [
            {
              id: 'widget1',
              infograph_id: 'info1',
              page_id: 'page1',
              widget: {
                prop2: 234,
              },
            },
            {
              id: 'widget2',
              infograph_id: 'info1',
              page_id: 'page1',
              widget: {
                prop3: 678,
              },
            },
          ],
        ],
      }),
    );

    const infog = await getFullInfograph('123');

    expect(infog).toBeDefined();
    expect(infog['id']).toBe('info1');
    expect(infog['title']).toBe('hihi');
    expect(infog['pages']['page1']['prop1']).toBe(123);
    expect(infog['widgets']['widget1']['prop2']).toBe(234);
    expect(infog['widgets']['widget2']['prop3']).toBe(678);
  });
});
