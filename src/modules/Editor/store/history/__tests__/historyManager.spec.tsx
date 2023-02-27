import { Provider } from 'react-redux';
import { render, screen, fireEvent } from '@testing-library/react';
import { act } from 'react-dom/test-utils';

import { store } from '../../store';
import { HistoryManagerProvider, useHistory } from '../historyManager';
import { renderWithRedux, mockAddBasicShapeWidget } from '../../../../../utils/test-utils.test';
import { EMPTY_INFOGRAPH } from '../../../../../utils/loadSampleInfograph';
import { Key } from '../../../../../constants/keyboard';
import { InfographLoader } from '../../../../InfographLoader';
import Editor from '../../../Editor';

describe('store/history/historyManager', () => {
  it('should render HistoryManagerProvider properly', () => {
    function Component() {
      return <div>Awesome</div>;
    }
    render(
      <Provider store={store}>
        <HistoryManagerProvider>
          <Component />
        </HistoryManagerProvider>
        ,
      </Provider>,
    );
    expect(screen.getByText(/^Awesome/)).toHaveTextContent('Awesome');
  });

  it('should be able to access history via useHistory hook', async () => {
    function Component() {
      const history = useHistory();
      return (
        <div>
          <button disabled={!history.canUndo}>undo</button>
        </div>
      );
    }
    render(
      <Provider store={store}>
        <HistoryManagerProvider>
          <Component />
        </HistoryManagerProvider>
        ,
      </Provider>,
    );

    expect(screen.getByText(/undo/).closest('button')).toBeDisabled();
  });

  it('should keep widget selection after undo / redo', async () => {
    renderWithRedux(
      <InfographLoader infographState={EMPTY_INFOGRAPH}>
        <Editor />
      </InfographLoader>,
    );

    mockAddBasicShapeWidget();
    expect(screen.queryAllByTestId(/widgetbase-/)).toHaveLength(1);
    expect(screen.queryAllByTestId('basic-shape-widget-toolbar')).toHaveLength(1);

    // lock widget
    const lockButton = screen.getByLabelText(/Lock/);
    // see https://github.com/testing-library/react-testing-library/issues/1051
    // eslint-disable-next-line testing-library/no-unnecessary-act
    await act(async () => {
      fireEvent.click(lockButton);
    });

    // undo widget should still be selected and the toolbar should still be visible
    fireEvent.keyDown(document.body, { which: Key.Z, metaKey: true });
    expect(screen.queryAllByTestId('basic-shape-widget-toolbar')).toHaveLength(1);

    // redo widget should still be selected and the toolbar should still be visible
    fireEvent.keyDown(document.body, { which: Key.Y, metaKey: true });
    expect(screen.queryAllByTestId('basic-shape-widget-toolbar')).toHaveLength(1);
  });
});
