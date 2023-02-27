import { InfographState } from '../types/infographTypes';
import { generateDefaultData } from '../widgets/TextBasedWidgets/TextWidget/TextWidget.helpers';
import { PaperType } from '../types/paper.types';

export const SAMPLE_INFOGRAPH: InfographState = {
  id: 'infoid-1',
  title: 'Hello world first infograph',
  pageOrder: ['page-1', 'page-2'],
  size: {
    widthPx: 816,
    heightPx: 1056,
    paperType: PaperType.LETTER,
  },
  language: {
    iso639_1_Code: 'en',
    displayName: 'English',
  },
  colorSwatch: ['rgba(255,255,255,1)', 'rgba(255,231,67,1)'],
  pages: {
    'page-1': {
      background: '#fff',
      widgetLayerOrder: ['003.widget-2', '002.widget-1', '007.widget-1'],
      widgetStructureTree: [
        'div',
        {},
        [
          ['div', {}, '003.widget-2'],
          ['div', {}, '002.widget-1'],
          ['div', {}, '007.widget-1'],
        ],
      ],
    },
    'page-2': {
      background: 'rgb(246, 186, 42)',
      widgetLayerOrder: ['003.widget-4'],
      widgetStructureTree: ['h1', {}, '003.widget-4'],
    },
  },
  widgets: {
    '003.widget-2': generateDefaultData().widgetData,
    '003.widget-4': generateDefaultData().widgetData,
    '002.widget-1': generateDefaultData().widgetData,
    '007.widget-1': generateDefaultData().widgetData,
  },
};

export const EMPTY_INFOGRAPH: InfographState = {
  id: 'infoid-1',
  title: 'Hello world first infograph',
  pageOrder: ['page-1'],
  language: {
    iso639_1_Code: 'en',
    displayName: 'English',
  },
  colorSwatch: ['#fff', '#000'],
  size: {
    widthPx: 816,
    heightPx: 1056,
    paperType: PaperType.LETTER,
  },
  pages: {
    'page-1': {
      background: '#fff',
      widgetLayerOrder: [],
      widgetStructureTree: ['div', {}, []],
    },
  },
  widgets: {},
};
