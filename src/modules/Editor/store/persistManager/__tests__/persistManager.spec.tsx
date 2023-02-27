import { useContext } from 'react';
import { Provider } from 'react-redux';
import { render, screen } from '@testing-library/react';
import { act } from 'react-dom/test-utils';
import { PersistManagerContext, PersistManagerProvider } from '../persistManager';
import { removeWidget } from '../../../store/infographSlice';
import { store } from '../../store';
import { loadInfograph } from '../../infographSlice';
import { SAMPLE_INFOGRAPH } from '../../../../../utils/loadSampleInfograph';
import delay from '../../../../../utils/deplay';

describe('store/persistence/persistManager', () => {
  it('should render PersistManagerProvider properly', () => {
    function Component() {
      return <div>Awesome</div>;
    }
    render(
      <Provider store={store}>
        <PersistManagerProvider>
          <Component />
        </PersistManagerProvider>
        ,
      </Provider>,
    );
    expect(screen.getByText(/^Awesome/)).toHaveTextContent('Awesome');
  });

  it('should updated last modified time after infographic state changes', async () => {
    let lastSave = '';
    const getLastModified = () => `lastSave:${lastSave}`;
    function Component() {
      const persistState = useContext(PersistManagerContext);
      lastSave = persistState.lastModified?.toString() || '';
      return <div>{getLastModified()}</div>;
    }
    render(
      <Provider store={store}>
        <PersistManagerProvider>
          <Component />
        </PersistManagerProvider>
        ,
      </Provider>,
    );

    expect(screen.getByText(/^lastSave/)).toHaveTextContent(getLastModified());

    /**
     * Simulate delete widget action
     */
    await act(async () => {
      store.dispatch(loadInfograph(SAMPLE_INFOGRAPH));
      const widgetId = Object.keys(SAMPLE_INFOGRAPH.widgets)[0];
      store.dispatch(removeWidget({ pageId: SAMPLE_INFOGRAPH.pageOrder[0], widgetId }));

      await delay(1000);
    });

    expect(screen.getByText(/^lastSave/)).toHaveTextContent(getLastModified());
  });

  it('should have saving state while save API in progress', async () => {
    // TODO:
  });

  it('will display error message if save API throws exception', async () => {
    // TODO:
  });
});
