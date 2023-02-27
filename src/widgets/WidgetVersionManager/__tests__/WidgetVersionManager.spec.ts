import WidgetVersionManager from '../WidgetVersionManager';
import { WidgetType } from '../../../types/widget.types';
import { WidgetVersionConfig } from '../WidgetVersionManager.types';

const widgetVersionManager = WidgetVersionManager.getInstance();

beforeEach(() => {
  widgetVersionManager.cleanup();
});

const createMockVersionConfig = (): WidgetVersionConfig =>
  Object.values(WidgetType).reduce((acc, widgetType: WidgetType) => {
    acc[widgetType] = {
      controllers: [],
      latestVersion: 1,
    };
    return acc;
  }, {} as WidgetVersionConfig);

describe('WidgetVersionManager', () => {
  it('should upgrade widget version', () => {
    class MockUpgradeImageV2 {
      version = 2;
      upgrade(widget: any) {
        widget.opacity = 1;
        widget.url = 'url';
        widget.removeThis = 'removeThis';
      }
    }

    class MockUpgradeImageV3 {
      version = 3;
      upgrade(widget: any) {
        widget.opacity = 0.5;
        widget.filter = 'grayScale';
        delete widget.removeThis;
      }
    }
    const mockWidgetVersionConfig = createMockVersionConfig();
    mockWidgetVersionConfig[WidgetType.Image] = {
      latestVersion: 3,
      controllers: [new MockUpgradeImageV2(), new MockUpgradeImageV3()],
    };
    widgetVersionManager.init(mockWidgetVersionConfig as WidgetVersionConfig);

    const mockOutdatedWidget = { version: 1 };
    const mockUpToDateWidget = { version: 3, opacity: 1, filter: 'sepia' };
    const mockWidgetMap = widgetVersionManager.update({ '007-123': mockOutdatedWidget, '007-124': mockUpToDateWidget });
    const updatedOutdatedWidget = mockWidgetMap['007-123'];
    const updatedUpToDateWidget = mockWidgetMap['007-124'];

    // check if the outdated widget is updated to the latest version
    // with the correct properties
    expect(updatedOutdatedWidget.version).toBe(3);
    expect(updatedOutdatedWidget.opacity).toBe(0.5);
    expect(updatedOutdatedWidget.filter).toBe('grayScale');
    expect(updatedOutdatedWidget.url).toBe('url');
    expect(updatedOutdatedWidget.newProperty2).toBe();

    // check if the up to date widget is not changed
    expect(updatedUpToDateWidget.version).toBe(3);
    expect(updatedUpToDateWidget.opacity).toBe(1);
    expect(updatedUpToDateWidget.filter).toBe('sepia');
  });

  it('should throw error if widget type is missing a controller', () => {
    const mockWidgetVersionConfig = createMockVersionConfig();
    delete mockWidgetVersionConfig[WidgetType.Image];
    // the image widget doesn't have a controller now
    expect(() => widgetVersionManager.init(mockWidgetVersionConfig)).toThrow();
  });

  it('should throw error if widget type is missing a controller for the latest version', () => {
    const mockWidgetVersionConfig = createMockVersionConfig();
    class MockUpgradeImageV2 {
      version = 2;
      upgrade(widget: any) {
        widget.opacity = 1;
      }
    }
    mockWidgetVersionConfig[WidgetType.Image] = {
      latestVersion: 3,
      controllers: [new MockUpgradeImageV2()],
    };

    // the image widget doesn't have a controller for version 3
    expect(() => widgetVersionManager.init(mockWidgetVersionConfig)).toThrow();
  });

  it('should add new widgets in result', () => {
    const NEW_WIDGET_ID = '002-def';
    const NEW_WIDGET_DATA = { x: 1, y: 2 };
    const LATEST_VERSION = 2;

    class MockUpgradeParentWidgetV2 {
      version = 2;
      upgrade(widget: any) {
        const newWidgetId = NEW_WIDGET_ID;
        const newWidgetData = NEW_WIDGET_DATA;

        widget.componentWidgetIdMap['member2'] = newWidgetId;
        widget.memberWidgetIds.push(newWidgetId);

        return { [newWidgetId]: newWidgetData };
      }
    }

    const mockWidgetVersionConfig = createMockVersionConfig();
    mockWidgetVersionConfig[WidgetType.StatChart] = {
      latestVersion: 2,
      controllers: [new MockUpgradeParentWidgetV2(), new MockUpgradeParentWidgetV2()],
    };
    widgetVersionManager.init(mockWidgetVersionConfig);

    const mockOutdatedWidget = {
      version: 1,
      componentWidgetIdMap: { member1: '002-abc' },
      memberWidgetIds: ['002-abc'],
    };
    const mockUpToDateWidget = {
      version: LATEST_VERSION,
      componentWidgetIdMap: { member1: '002-ghi', member2: '002-jkl' },
      memberWidgetIds: ['002-ghi', '002-jkl'],
    };
    const mockWidgetMap = widgetVersionManager.update({ '016-123': mockOutdatedWidget, '016-456': mockUpToDateWidget });
    const updatedOutdatedWidget = mockWidgetMap['016-123'];
    const updatedUpToDateWidget = mockWidgetMap['016-456'];

    // check if the outdated widget is updated to the latest version
    // with the correct properties
    expect(updatedOutdatedWidget.version).toBe(LATEST_VERSION);
    expect(updatedOutdatedWidget.componentWidgetIdMap).toHaveProperty('member2');
    expect(updatedOutdatedWidget.componentWidgetIdMap.member2).toBe(NEW_WIDGET_ID);
    expect(updatedOutdatedWidget.memberWidgetIds).toHaveLength(2);
    expect(updatedOutdatedWidget.memberWidgetIds).toEqual(['002-abc', NEW_WIDGET_ID]);

    // check that the mockWidgetMap has the added widgets
    expect(mockWidgetMap).toHaveProperty(NEW_WIDGET_ID);
    expect(mockWidgetMap[NEW_WIDGET_ID]).toEqual(NEW_WIDGET_DATA);

    // check if the up to date widget is not changed
    expect(updatedUpToDateWidget.version).toBe(LATEST_VERSION);
    expect(updatedUpToDateWidget.componentWidgetIdMap).toEqual({ member1: '002-ghi', member2: '002-jkl' });
    expect(updatedUpToDateWidget.memberWidgetIds).toEqual(['002-ghi', '002-jkl']);
  });
});
