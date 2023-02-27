# PieChartWidget Changelog

### Version 2

- Added generalOptions.innerSize: string for Donut Hole usage. This property is a number 0-100. At the moment of sending the data to HighCharts, it is internally maxed at 90 and the % symbol is added.
- Decreased maximum size of Border Width to 5px from 10px.

### Version 3

- Updated schema to add properties that can be used by other data table chart types, to prepare the schema for chart type change and keeping previous chart settings. (e.g. moving from Pie to Bar)

### Version 4

- Added support for Patterns

### Version 5

- Added font settings (size, family, styling, etc).

### Version 6

-- Added show/hide data label which is around the pie (dataLabels.enabled)

