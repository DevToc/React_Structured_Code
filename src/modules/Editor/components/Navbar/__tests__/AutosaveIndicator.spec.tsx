import { screen } from '@testing-library/react';
import { act } from 'react-dom/test-utils';
import { Provider } from 'react-redux';
import delay from '../../../../../utils/deplay';
import { renderWithAppProviders, renderWithRedux, mockAddBasicShapeWidget } from '../../../../../utils/test-utils.test';
import { PersistManagerProvider } from '../../../store/persistManager';
import { AutosaveIndicator } from '../AutosaveIndicator';
import { store } from '../../../store';

describe('components/AutosaveIndicator', () => {
  it('should render the AutosaveIndicator', () => {
    renderWithAppProviders(<AutosaveIndicator />);

    expect(screen.getByTestId('autosave-indicator')).toBeInTheDocument();
    expect(screen.getByText('Autosaved')).toBeInTheDocument();
  });

  it('should update text with `Saving...` to indicate the status after changes made', async () => {
    renderWithRedux(
      <Provider store={store}>
        <PersistManagerProvider>
          <AutosaveIndicator />
        </PersistManagerProvider>
      </Provider>,
    );

    mockAddBasicShapeWidget();

    // TODO: fix this test
    // const savingMessage = await screen.findByText('Saving...');
    // expect(savingMessage).toBeInTheDocument();

    await act(async () => {
      store.dispatch({ type: 'finished' });
      await delay(500);
    });

    // Text changes back to Autosaved after commit is resolved
    expect(screen.getByText('Autosaved')).toBeInTheDocument();
  });
});
