import { saveFullInfograph } from '../commit';
import { enableFetchMocks } from 'jest-fetch-mock';
import { InfographState } from '../../../types/infographTypes';
import { PaperType } from '../../../types/paper.types';

enableFetchMocks();

describe('libs/infograph/commit', () => {
  beforeEach(() => {
    fetch.resetMocks();
  });

  it('save full infograph', async () => {
    fetch.mockResponseOnce(
      JSON.stringify({
        writeResults: [
          {
            modified_at: '123123',
          },
        ],
      }),
    );

    const infoData: InfographState = {
      id: 'info1',
      pageOrder: [],
      pages: {
        'page-1': {
          background: '#fff',
          widgetLayerOrder: ['widget1'],
          widgetStructureTree: ['div', {}, 'widget1'],
        },
      },
      size: {
        widthPx: 800,
        heightPx: 800,
        paperType: PaperType.LETTER,
      },
      title: '',
      widgets: {
        widget1: {
          topPx: 0,
          leftPx: 1,
          widthPx: 2,
          heightPx: 3,
          rotateDeg: 4,
        },
      },
    };

    await saveFullInfograph(infoData);

    expect(fetch.mock.calls).toBeDefined();

    const bodyObj = JSON.parse(fetch.mock.calls[0][1]['body']);

    expect(bodyObj['writes']).toBeDefined();
    expect(bodyObj['writes'][0]['set']).toBeDefined();
    expect(bodyObj['writes'][0]['set']['path']).toBe('infographs/info1');
    // Widgets and pages should not exist
    expect(bodyObj['writes'][0]['set']['fields']).toStrictEqual({
      id: 'info1',
      pageOrder: [],
      size: {
        widthPx: 800,
        heightPx: 800,
        paperType: PaperType.LETTER,
      },
      title: '',
    });

    // make sure page write exists
    expect(bodyObj['writes'][1]['set']['path']).toBe('infographs/info1/pages/page-1');
    expect(bodyObj['writes'][1]['set']['fields']).toStrictEqual({
      background: '#fff',
      widgetLayerOrder: ['widget1'],
      widgetStructureTree: ['div', {}, 'widget1'],
    });

    // Make sure widget write exists
    expect(bodyObj['writes'][2]['set']['path']).toBe('infographs/info1/pages/page-1/widgets/widget1');
    expect(bodyObj['writes'][2]['set']['fields']).toStrictEqual({
      topPx: 0,
      leftPx: 1,
      widthPx: 2,
      heightPx: 3,
      rotateDeg: 4,
    });
  });
});
