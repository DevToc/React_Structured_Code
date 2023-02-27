import { renderWithRedux } from '../../../../../utils/test-utils.test';
import { Spreadsheet } from '../Spreadsheet';

describe('Editor/components/Spreadsheet/Spreadsheet.tsx', () => {
  it('should render spreadsheet as expected', () => {
    const testData = [
      {
        id: 1,
        isPromoted: false,
        name: 'Alex',
        score: 10,
        color: 'green',
      },
      {
        id: 2,
        name: 'Adam',
        score: 55,
        isPromoted: false,
      },
      {
        id: 3,
        name: 'Kate',
        score: 61,
        isPromoted: true,
      },
      {
        id: 4,
        name: 'Max',
        score: 98,
        isPromoted: true,
      },
      {
        id: 5,
        name: 'Lucy',
        score: 59,
        isPromoted: false,
      },
    ];

    const { asFragment } = renderWithRedux(<Spreadsheet id={'sheet-1'} data={testData} />);
    expect(asFragment()).toMatchSnapshot();
  });
});
