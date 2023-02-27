import { screen } from '@testing-library/react';
import { renderWidget } from 'utils/test-utils.test';
import { ImageWidget } from '../ImageWidget';
import { generateDefaultData } from '../ImageWidget.helpers';

const DEFAULT_ALT_TEXT = 'I am alt text.';

describe('widgets/ImageWidget', () => {
  it('should render skeleton correctly', () => {
    const widgetId = '007.widget-1';
    const mockSize = { width: 100, height: 100 };
    const mockUrl = 'cat.png';
    const widget = { widgetId, ...generateDefaultData(mockUrl, mockSize, mockSize) };

    const { asFragment } = renderWidget(<ImageWidget />, { widget });

    expect(asFragment()).toMatchSnapshot();
  });

  it('should render image correctly', async () => {
    const widgetId = '007.widget-1';
    const mockSize = { width: 100, height: 100 };
    const widget = { widgetId, ...generateDefaultData('', mockSize, mockSize) };

    const { asFragment } = renderWidget(<ImageWidget />, { widget });

    await screen.findByTestId('image-rect');
    expect(asFragment()).toMatchSnapshot();
  });

  it('should render alt text', () => {
    const widgetId = '007.widget-1';
    const mockSize = { width: 100, height: 100 };
    const defaultData = generateDefaultData('', mockSize, mockSize);

    const widget = {
      widgetId,
      ...defaultData,
      widgetData: {
        ...defaultData.widgetData,
        altText: DEFAULT_ALT_TEXT,
        isDecorative: false,
      },
    };

    renderWidget(<ImageWidget />, { widget });
    expect(screen.getByAltText(DEFAULT_ALT_TEXT)).toBeInTheDocument();
  });

  it('should render as decorative', () => {
    const widgetId = '007.widget-1';
    const mockSize = { width: 100, height: 100 };
    const defaultData = generateDefaultData('', mockSize, mockSize);

    const widget = {
      widgetId,
      ...defaultData,
      widgetData: {
        ...defaultData.widgetData,
        altText: null,
        isDecorative: true,
      },
    };

    renderWidget(<ImageWidget />, { widget });

    expect(screen.getByAltText('')).toBeInTheDocument();
  });

  it('should render the opacity as expected', async () => {
    const widgetId = '007.widget-1';
    const mockSize = { width: 100, height: 100 };
    const defaultData = generateDefaultData('', mockSize, mockSize);

    const widget = {
      widgetId,
      ...defaultData,
      widgetData: {
        ...defaultData.widgetData,
        altText: null,
        opacity: 1,
      },
    };

    renderWidget(<ImageWidget />, { widget });
    const imageRect = await screen.findByTestId('image-rect');

    expect(imageRect.style).toHaveProperty('opacity', '1');
  });
});
