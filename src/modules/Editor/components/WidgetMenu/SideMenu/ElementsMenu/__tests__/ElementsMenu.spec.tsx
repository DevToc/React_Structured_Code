import { screen, fireEvent } from '@testing-library/react';
import { renderWithRedux } from 'utils/test-utils.test';
import { ElementsMenu } from '../ElementsMenu';
import { InfographLoader } from 'modules/InfographLoader';
import Editor from 'modules/Editor';
import { EMPTY_INFOGRAPH } from 'utils/loadSampleInfograph';

describe('ElementsMenu', () => {
  const disableWarnings = () => {
    // TODO figure out why this error is thrown for tests but not in browser
    // Suppress error 'Received NaN for data-rotation attribute'
    jest.spyOn(console, 'error').mockImplementation((message) => {
      if (message.includes('Received NaN')) return;
      else console.error(message);
    });
  };

  it('should render', () => {
    const { asFragment } = renderWithRedux(<ElementsMenu />);
    expect(asFragment()).toMatchSnapshot();
  });

  it('should block adding same widget if loading widget', async () => {
    disableWarnings();
    renderWithRedux(
      <InfographLoader infographState={EMPTY_INFOGRAPH}>
        <Editor />
      </InfographLoader>,
    );

    const elementMenu = screen.getByTestId('Elements');
    fireEvent.click(elementMenu);

    const addElementButton = screen.getByTestId('elementsmenu-0-btn');
    fireEvent.click(addElementButton);
    fireEvent.click(addElementButton);

    const allWidgetsAfter = await screen.findAllByTestId(/widgetbase/);

    // the element is a responsive widget and contains 3 widgets
    // only one element should be added
    expect(allWidgetsAfter.length).toBe(3);
  });
});
