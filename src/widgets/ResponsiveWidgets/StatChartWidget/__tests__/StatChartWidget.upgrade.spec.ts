import cloneDeep from 'lodash.clonedeep';
import { UpgradeV2 } from '../StatChartWidget.upgrade';

describe('StatChartWidget.upgrade.ts', () => {
  describe('UpgradeV2', () => {
    const progressChartId = '015.progress-chart';
    const metricTextId = '020.label-text';
    const iconId = '002.icon';

    const mockWidgetBase = {
      memberWidgetIds: [progressChartId, metricTextId, iconId],
      componentWidgetIdMap: { chart: progressChartId, iconGrid: iconId, metricText: metricTextId },
    };
    const mockMemberWidgets = { [progressChartId]: {}, [metricTextId]: {}, [iconId]: {} };

    it('should upgrade icon type properties for version 2', () => {
      const upgradeV2 = new UpgradeV2();

      // for icon should hide chart
      const mockIconTypeWidget = cloneDeep({ ...mockWidgetBase, type: 'Icon', metricTextEnabled: true });
      const mockIconTypeMemberWidgets = cloneDeep(mockMemberWidgets);
      upgradeV2.upgrade(mockIconTypeWidget, mockIconTypeMemberWidgets);
      expect(mockIconTypeMemberWidgets[progressChartId]).toEqual({ isHidden: true });
      expect(mockIconTypeMemberWidgets[iconId]).toEqual({});
      expect(mockIconTypeMemberWidgets[metricTextId]).toEqual({});

      // if isMetricTextEnabled is false, should hide label widget
      const mockIconTypeWidget2 = cloneDeep({ ...mockWidgetBase, type: 'Icon', metricTextEnabled: false });
      const mockIconTypeMemberWidgets2 = cloneDeep(mockMemberWidgets);
      upgradeV2.upgrade(mockIconTypeWidget2, mockIconTypeMemberWidgets2);
      expect(mockIconTypeMemberWidgets2[progressChartId]).toEqual({ isHidden: true });
      expect(mockIconTypeMemberWidgets2[iconId]).toEqual({});
      expect(mockIconTypeMemberWidgets2[metricTextId]).toEqual({ isHidden: true });
    });

    it('should upgrade other statchart type properties for version 2', () => {
      const upgradeV2 = new UpgradeV2();

      const mockDonutTypeWidget = cloneDeep({ ...mockWidgetBase, type: 'Donut' });
      const mockDonutTypeMemberWidgets = cloneDeep(mockMemberWidgets);
      upgradeV2.upgrade(mockDonutTypeWidget, mockDonutTypeMemberWidgets);

      expect(mockDonutTypeMemberWidgets[progressChartId]).toEqual({});
      expect(mockDonutTypeMemberWidgets[iconId]).toEqual({ isHidden: true });
      expect(mockDonutTypeMemberWidgets[metricTextId]).toEqual({});
    });
  });
});
