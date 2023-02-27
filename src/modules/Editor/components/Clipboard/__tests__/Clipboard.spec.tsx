import { screen, fireEvent } from '@testing-library/react';

import { Key } from '../../../../../constants/keyboard';
import { renderWithRedux, mockAddBasicShapeWidget } from '../../../../../utils/test-utils.test';
import Editor from '../../../Editor';
import { InfographLoader } from '../../../../InfographLoader';
import { EMPTY_INFOGRAPH } from '../../../../../utils/loadSampleInfograph';

const copyEvent = new Event('copy', {
  bubbles: true,
  cancelable: true,
});

const pasteEvent = new Event('paste', {
  bubbles: true,
  cancelable: true,
});

describe('components/Clipboard', () => {
  it('should copy and paste widgets', () => {
    renderWithRedux(
      <InfographLoader infographState={EMPTY_INFOGRAPH}>
        <Editor />
      </InfographLoader>,
    );

    mockAddBasicShapeWidget();

    // select all widgets
    const allWidgets = screen.getAllByTestId(/widgetbase/);
    fireEvent.keyDown(document.body, { which: Key.A, metaKey: true });

    fireEvent(window, copyEvent);
    fireEvent(window, pasteEvent);

    const allWidgetsAfter = screen.getAllByTestId(/widgetbase/);
    expect(allWidgetsAfter.length).toEqual(allWidgets.length * 2);

    fireEvent(window, pasteEvent);
    const allWidgetsAfterSecondPaste = screen.getAllByTestId(/widgetbase/);
    expect(allWidgetsAfterSecondPaste.length).toEqual(allWidgets.length * 3);
  });

  it('should add pasted text as text widget', () => {
    renderWithRedux(
      <InfographLoader infographState={EMPTY_INFOGRAPH}>
        <Editor />
      </InfographLoader>,
    );

    const clipboardEvent = new Event('paste', {
      bubbles: true,
      cancelable: true,
    });
    clipboardEvent.clipboardData = {
      getData: () => 'Pasted text',
    };
    fireEvent(window, clipboardEvent);

    const pastedTextWidgets = screen.getAllByText(/Pasted text/);
    const textWidget = pastedTextWidgets.find((x) => !x.id.endsWith('-description'));
    expect(textWidget).toBeInTheDocument();
  });

  // Warning this test still runs on react 17
  // See: https://github.com/testing-library/react-testing-library/issues/1051
  it('should copy and paste pages in slideview', async () => {
    // TODO: remove this once it has been updated to React 18
    // hide legacy error
    jest.spyOn(global.console, 'error').mockImplementationOnce((message) => {
      if (!message.includes('ReactDOM.render')) {
        global.console.warn(message);
      }
    });

    renderWithRedux(
      <InfographLoader infographState={EMPTY_INFOGRAPH}>
        <Editor />
      </InfographLoader>,
      // React 17
      { legacyRoot: true },
    );

    // open page slide view
    fireEvent.keyDown(document.body, { which: Key.ForwardSlash, ctrlKey: true });

    // page slide list is lazy loaded - wait for it to appear
    const firstSlideActive = await screen.findByTestId(/slide-idx-1-active/i);
    expect(firstSlideActive).toBeInTheDocument();

    fireEvent(window, copyEvent);
    fireEvent(window, pasteEvent);

    const firstPastedPageActive = screen.getByTestId(/slide-idx-2-active/i);
    expect(firstPastedPageActive).toBeInTheDocument();

    fireEvent(window, pasteEvent);
    const secondPastedPage = screen.getByTestId(/slide-idx-3-active/i);
    expect(secondPastedPage).toBeInTheDocument();
  });
});
