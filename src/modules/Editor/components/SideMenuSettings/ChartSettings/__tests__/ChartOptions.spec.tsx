import { screen } from '@testing-library/react';
import { InfographLoader } from 'modules/InfographLoader';
import { renderWithRedux } from 'utils/test-utils.test';
import { EMPTY_INFOGRAPH } from 'utils/loadSampleInfograph';
import { DataPrefix, DataSuffix, NumberFormat, NumberFormatSwitch } from '../ChartOptions';
import SeriesColorPicker from '../SeriesColorPicker/SeriesColorPicker';
import { SideMenuSettingProvider } from 'widgets/sdk';

describe('ChartOptions.tsx', () => {
  global.window.scrollTo = jest.fn();

  it('should render SeriesColorPicker labels', () => {
    const { container } = renderWithRedux(
      <InfographLoader infographState={EMPTY_INFOGRAPH}>
        <SideMenuSettingProvider>
          <SeriesColorPicker
            label='SeriesColorPicker Label'
            series={[
              { color: '#fff', name: 'Apples' },
              { color: '#000', name: 'Oranges' },
            ]}
            onChange={() => {}}
          />
        </SideMenuSettingProvider>
      </InfographLoader>,
    );

    expect(container).toBeInTheDocument();
    expect(screen.getByText('SeriesColorPicker Label')).toBeInTheDocument();
    expect(screen.getByText('Apples')).toBeInTheDocument();
    expect(screen.getByText('Oranges')).toBeInTheDocument();
  });

  it('should render DataPrefix', () => {
    const { asFragment } = renderWithRedux(<DataPrefix value='Test' onChange={() => {}} />);
    expect(asFragment()).toMatchSnapshot();
  });

  it('should render DataSuffix', () => {
    const { asFragment } = renderWithRedux(<DataSuffix value='Test' onChange={() => {}} />);
    expect(asFragment()).toMatchSnapshot();
  });

  it('should render NumberFormat', () => {
    const { asFragment } = renderWithRedux(
      <NumberFormat>
        <DataPrefix value='Test' onChange={() => {}} />
      </NumberFormat>,
    );
    expect(asFragment()).toMatchSnapshot();
  });

  it('should render NumberFormatSwitch (percentage)', () => {
    const { asFragment } = renderWithRedux(<NumberFormatSwitch onChange={() => {}} value={'percentage'} />);
    expect(asFragment()).toMatchSnapshot();
  });

  it('should render NumberFormatSwitch (value)', () => {
    const { asFragment } = renderWithRedux(<NumberFormatSwitch onChange={() => {}} value={'percentage'} />);
    expect(asFragment()).toMatchSnapshot();
  });
});
