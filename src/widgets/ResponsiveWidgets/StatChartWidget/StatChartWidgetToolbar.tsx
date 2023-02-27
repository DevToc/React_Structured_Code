import { Flex, Select, Text, Popover, PopoverTrigger, Button, PopoverContent, Switch } from '@chakra-ui/react';

import { ToolbarDivider } from 'modules/common/components/Toolbar/ToolbarDivider';
import { ToolbarNumberInput } from 'modules/common/components/Toolbar/ToolbarNumberInput';
import { DropdownPopover, SliderPopover } from 'modules/common/components/ToolbarPopover';
import { AltTextMenu } from 'modules/Editor/components/Toolbar/AltTextMenu/AltTextMenu';
import { RootState, setActiveWidget, store, useAppDispatch, useAppSelector } from 'modules/Editor/store';
import { updateWidget } from 'modules/Editor/store/infographSlice';
import { useEditor, useWidget } from 'widgets/sdk';
import { LabelTextWidgetData } from 'widgets/TextBasedWidgets/LabelTextWidget/LabelTextWidget.types';
import { IconWidgetData } from 'widgets/IconWidget/IconWidget.types';
import { getHeightOfGrid } from 'widgets/IconWidget/IconWidget.helpers';
import { NR_OF_ICONS, DEFAULT_NR_ICONS } from 'widgets/IconWidget/IconWidget.config';
import { ComponentWidgetIdKeys, StatChartType, StatChartWidgetData } from './StatChartWidget.types';

import { ReactComponent as VerticalSpacingIcon } from 'assets/icons/vertical_spacing.svg';
import { ReactComponent as DonutStatIcon } from 'assets/icons/a11ymenu_statdonut.svg';
import { ReactComponent as HalfDonutStatIcon } from 'assets/icons/a11ymenu_stathalfdonut.svg';
import { ReactComponent as ProgressBarStatIcon } from 'assets/icons/a11ymenu_statbar.svg';
import { ReactComponent as IconStatIcon } from 'assets/icons/a11ymenu_staticon.svg';
import { ProgressChartWidgetData } from 'widgets/ProgressChartWidget/ProgressChartWidget.types';
import { swapChartType } from './StatChartWidget.helpers';
import { useTranslation } from 'react-i18next';

export const StatChartWidgetToolbar = () => {
  const { widgetId, type } = useWidget<StatChartWidgetData>();

  return (
    <Flex gap='2' align='center' data-testid='statchart-widget-toolbar'>
      <ChartSwapOption />
      <ChartValueInput />
      <ToolbarDivider />
      {/* TODO remove the type check when layout options are added */}
      {type === StatChartType.ProgressBar && (
        <>
          <VerticalSpacingOption />
          <ToolbarDivider />
        </>
      )}
      {type === StatChartType.Icon && (
        <>
          <TotalItems />
          <ToolbarDivider />
          <ToggleMenu />
          <ToolbarDivider />
        </>
      )}
      <AltTextMenu widgetId={widgetId} />
    </Flex>
  );
};

const CHART_SWAP_OPTIONS = [
  {
    value: StatChartType.Donut,
    label: 'Donut chart',
    icon: <DonutStatIcon width='15' />,
  },
  {
    value: StatChartType.HalfDonut,
    label: 'Half-donut chart',
    icon: <HalfDonutStatIcon width='15' />,
  },
  {
    value: StatChartType.ProgressBar,
    label: 'Progress bar chart',
    icon: <ProgressBarStatIcon width='15' />,
  },
  {
    value: StatChartType.Icon,
    label: 'Icon chart',
    icon: <IconStatIcon width='15' />,
  },
];

const ChartSwapOption = () => {
  const { type, widgetId, componentWidgetIdMap } = useWidget<StatChartWidgetData>();
  const { t } = useTranslation('editor_widget_toolbar', { keyPrefix: 'statChartToolbar', useSuspense: false });
  const label = t('chartSwap.label');

  const metricTextWidgetId = componentWidgetIdMap[ComponentWidgetIdKeys.MetricText];
  const chartWidgetId = componentWidgetIdMap[ComponentWidgetIdKeys.Chart];
  const iconGridWidgetId = componentWidgetIdMap[ComponentWidgetIdKeys.IconGrid];

  const dispatch = useAppDispatch();

  const selectedIndex = CHART_SWAP_OPTIONS.findIndex((opt) => opt.value === type) || 0;

  // There's a couple of older templates where the stat chart is missing the icon grid widget - hide the swap option for them
  const filteredSwapOptions = iconGridWidgetId
    ? CHART_SWAP_OPTIONS
    : CHART_SWAP_OPTIONS.filter((opt) => opt.value !== StatChartType.Icon);

  const onUpdateType = (newType: StatChartType) => {
    // No update if trying to swap to the same type
    if (newType === type) return;

    // access the widget data when the function is called
    // to avoid subscribing to all the stat chart widget data in the component itself
    const chartWidgetData = (store.getState() as RootState).infograph.widgets[chartWidgetId];
    const iconWidgetData = (store.getState() as RootState).infograph.widgets[iconGridWidgetId];

    const { newChartWidgetData, newMetricTextWidgetData, newIconWidgetData, newWidgetData } = swapChartType(
      type,
      newType,
      chartWidgetData as ProgressChartWidgetData,
      iconWidgetData as IconWidgetData,
    );

    dispatch(
      updateWidget([
        { widgetId, widgetData: newWidgetData },
        { widgetId: chartWidgetId, widgetData: newChartWidgetData },
        { widgetId: metricTextWidgetId, widgetData: newMetricTextWidgetData },
        { widgetId: iconGridWidgetId, widgetData: newIconWidgetData },
      ]),
    );
  };

  return (
    <DropdownPopover
      options={filteredSwapOptions}
      selectedIndex={selectedIndex}
      label={label}
      w={'180px'}
      buttonVariant={'toolbar-dropdown-option'}
      optionsButtonVariant={'toolbar-dropdown-item'}
      onSelect={onUpdateType}
      buttonOptionProps={{
        justifyContent: 'flex-start',
      }}
      returnFocusOnClose={false}
    />
  );
};

const ChartValueInput = () => {
  const { componentWidgetIdMap } = useWidget<StatChartWidgetData>();
  const dispatch = useAppDispatch();
  const { boundingBox } = useEditor();
  const { t } = useTranslation('editor_widget_toolbar', {
    keyPrefix: 'statChartToolbar.chartValue',
    useSuspense: false,
  });

  const label = t('label');

  const labelTextWidgetId = componentWidgetIdMap[ComponentWidgetIdKeys.MetricText];
  const labelTextWidgetValue = useAppSelector(
    (state) => (state.infograph.widgets[labelTextWidgetId] as LabelTextWidgetData).value,
  );
  const chartValue = parseFloat(labelTextWidgetValue);

  const updateChartValue = (newValue: number) => {
    const newValueAsString = `${newValue}`;
    if (labelTextWidgetValue === newValueAsString) return;

    dispatch(updateWidget({ widgetId: labelTextWidgetId, widgetData: { value: newValueAsString } }));

    // Update bounding box after state change
    setTimeout(() => boundingBox.updateRect(), 0);
  };

  return <ToolbarNumberInput value={chartValue} label={label} precision={2} suffix={'%'} onChange={updateChartValue} />;
};

const VerticalSpacingOption = () => {
  const { verticalSpacing, updateWidget } = useWidget<StatChartWidgetData>();
  const { boundingBox } = useEditor();
  const { t } = useTranslation('editor_widget_toolbar', {
    keyPrefix: 'statChartToolbar.verticalSpacing',
    useSuspense: false,
  });

  const label = t('label');

  const updateVerticalSpacing = (spacing: number) => {
    updateWidget({ verticalSpacing: spacing });

    // Update bb
    setTimeout(() => boundingBox.updateRect(), 0);
  };

  return (
    <SliderPopover
      value={verticalSpacing || 0}
      title={label}
      label={label}
      min={1}
      max={20}
      onChange={updateVerticalSpacing}
      icon={<VerticalSpacingIcon />}
      activeIconStyle={{ '& path': { fill: 'upgrade.blue.700' } }}
    />
  );
};

const ToggleMenu = () => {
  const { widgetId, componentWidgetIdMap } = useWidget<StatChartWidgetData>();
  const dispatch = useAppDispatch();
  const { t } = useTranslation('editor_widget_toolbar', {
    keyPrefix: 'statChartToolbar.toggleMenu',
    useSuspense: false,
  });

  const heading = t('title');
  const valueLabel = t('valueLabel');

  const labelTextWidgetId = componentWidgetIdMap[ComponentWidgetIdKeys.MetricText];
  const labelTextIsHidden = useAppSelector(
    (state) => (state.infograph.widgets[labelTextWidgetId] as LabelTextWidgetData).isHidden,
  );

  const onToggleMetricTextEnabled = () => {
    dispatch(updateWidget({ widgetId: labelTextWidgetId, widgetData: { isHidden: !labelTextIsHidden } }));
    // Have to reselect the base widget to update the reset the bounding box rect entirely
    // since one group member is removed/added
    setTimeout(() => dispatch(setActiveWidget(widgetId)), 0);
  };

  const switchId = 'icon-stat-label-switch';

  return (
    <Popover placement={'bottom-start'} closeOnEsc>
      {({ isOpen }) => (
        <>
          <PopoverTrigger>
            <Button size='sm' fontWeight='semibold' variant={'icon-btn-toolbar-option'} isActive={isOpen}>
              {heading}
            </Button>
          </PopoverTrigger>
          <PopoverContent w={'100%'} boxShadow='md'>
            <Flex justify='space-between' w='11rem' align='center' p={2} pt={3}>
              <Text fontSize='sm' as='label' htmlFor={switchId}>
                {valueLabel}
              </Text>
              <Switch id={switchId} isChecked={labelTextIsHidden} onChange={onToggleMetricTextEnabled} />
            </Flex>
          </PopoverContent>
        </>
      )}
    </Popover>
  );
};

const TotalItems = () => {
  const { componentWidgetIdMap } = useWidget<StatChartWidgetData>();
  const { boundingBox } = useEditor();
  const dispatch = useAppDispatch();
  const { t } = useTranslation('editor_widget_toolbar', {
    keyPrefix: 'statChartToolbar.totalItems',
    useSuspense: false,
  });

  const label = t('label');

  const iconGridWidgetId = componentWidgetIdMap[ComponentWidgetIdKeys.IconGrid];
  const numberOfIcons = useAppSelector(
    (state) => (state.infograph.widgets[iconGridWidgetId] as IconWidgetData).numberOfIcons,
  );

  const onChangeIconNumber = (e: React.FormEvent<HTMLSelectElement>) => {
    const target = e.target as HTMLSelectElement;
    const newNumberOfIcons = Number(target.value);
    if (!newNumberOfIcons || newNumberOfIcons === numberOfIcons) return;

    const heightPx = getHeightOfGrid(iconGridWidgetId, newNumberOfIcons);

    dispatch(updateWidget({ widgetId: iconGridWidgetId, widgetData: { numberOfIcons: newNumberOfIcons, heightPx } }));
    setTimeout(() => boundingBox.updateRect(), 0);
  };

  const selectId = 'icon-grid-select';

  return (
    <>
      <Text as='label' htmlFor={selectId} fontSize='sm'>
        {label}
      </Text>
      <Select
        width='65px'
        id={selectId}
        data-testid={selectId}
        data-allow-global-event
        value={numberOfIcons || DEFAULT_NR_ICONS}
        onChange={onChangeIconNumber}
        size='sm'
      >
        {NR_OF_ICONS.map((value) => (
          <option key={`number-of-icons-${value}`} value={value}>
            {value}
          </option>
        ))}
      </Select>
    </>
  );
};
