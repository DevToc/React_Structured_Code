// For accessing the prosemirror element
/* eslint-disable testing-library/no-node-access */
/* eslint-disable testing-library/no-container */

import { fireEvent, screen, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { FocusProvider } from 'modules/Editor/components/Focus';
import { Key } from 'constants/keyboard';
import { renderWidget, mockSetActiveWidget, mockLoadWidgetToInfograph } from 'utils/test-utils.test';
import { KeyboardShortcut } from 'modules/Editor/components/KeyboardShortcut';
import { TextWidget } from '../TextWidget';
import { generateDefaultData } from '../TextWidget.helpers';
import { DefaultTextType } from '../TextWidget.types';
import { DEFAULT_TEXT } from '../TextWidget.config';

describe('widgets/TextWidget', () => {
  it('should render element tags correctly', () => {
    // TODO: Current text will generate console.warn, may need to rewrite the tests or update tiptap and prosemirror version
    // @link https://github.com/ueberdosis/tiptap/issues/2846
    // @link https://github.com/ProseMirror/prosemirror-state/blob/f1c2ff98a397aa05b9ccf5ee23642bb7e44f05a7/src/selection.ts#L221

    const widgetId = '003.widget-1';
    const TEXT_TYPES: DefaultTextType[] = [
      'paragraph',
      'subtitle',
      'title',
      'heading 1',
      'heading 2',
      'heading 3',
      'heading 4',
      'heading 5',
      'heading 6',
    ];

    TEXT_TYPES.forEach((type) => {
      const widget = { widgetId, ...generateDefaultData(type) };
      const { asFragment } = renderWidget(<TextWidget />, { widget });

      expect(asFragment()).toMatchSnapshot();
    });
  });

  it('Text in the text widget can be edited', async () => {
    const widgetId = '003.widget-1';
    const widget = { widgetId, ...generateDefaultData('paragraph', '') };
    const { container } = renderWidget(<TextWidget />, { widget });

    mockSetActiveWidget(widgetId);
    const textWidget = screen.getAllByTestId(/widgetbase/)[0];

    // 1st click => widget should be active
    // expect contenteditable to be false
    fireEvent.click(textWidget);
    const proseMirrorEditorEl = container.querySelector('.ProseMirror');
    expect(proseMirrorEditorEl).toHaveAttribute('contenteditable', 'false');

    // 2nd click => widget should be editable
    fireEvent.click(proseMirrorEditorEl);
    expect(proseMirrorEditorEl).toHaveAttribute('contenteditable', 'true');

    // manual focus here required
    // editor?.commands.focus('all') does not seem to work in the test environment
    proseMirrorEditorEl.focus();
    await userEvent.keyboard('{backspace}');
    await userEvent.keyboard('abc');

    expect(proseMirrorEditorEl).toHaveTextContent('abc');

    // widget should move back to non-editable state
    fireEvent.keyDown(document.body, { which: Key.Escape });
    expect(proseMirrorEditorEl).toHaveAttribute('contenteditable', 'false');
  });

  it('should set focus back from editor to widget when going from edit -> active', async () => {
    const widgetId = '003.widget-1';
    const widget = { widgetId, ...generateDefaultData('paragraph', '') };
    const { container } = renderWidget(
      <FocusProvider>
        <TextWidget />
      </FocusProvider>,
      { widget },
    );

    const textWidget = screen.getAllByTestId(/widgetbase/)[0];
    mockSetActiveWidget(widgetId);

    const proseMirrorEditorEl = container.querySelector('.ProseMirror');
    fireEvent.click(proseMirrorEditorEl);
    fireEvent.click(proseMirrorEditorEl);
    // manual focus here required
    // editor?.commands.focus('all') does not seem to work in the test environment
    proseMirrorEditorEl.focus();
    expect(proseMirrorEditorEl).toHaveFocus();

    fireEvent.keyDown(document.body, { which: Key.Escape });
    expect(textWidget).toHaveFocus();
  });

  it('should reset to default text if text is deleted when going away from edit', async () => {
    const widgetId = '003.widget-1';
    const widget = { widgetId, ...generateDefaultData('paragraph', 'hello') };
    const { container } = renderWidget(<TextWidget />, { widget });
    mockLoadWidgetToInfograph(widget);
    mockSetActiveWidget(widgetId);

    const proseMirrorEditorEl = container.querySelector('.ProseMirror');
    expect(proseMirrorEditorEl).toHaveTextContent('hello');
    fireEvent.click(proseMirrorEditorEl);
    fireEvent.click(proseMirrorEditorEl);
    // manual focus here required
    // editor?.commands.focus('all') does not seem to work in the test environment
    proseMirrorEditorEl.focus();
    await userEvent.keyboard('{backspace}');
    expect(proseMirrorEditorEl).toHaveTextContent('');

    fireEvent.keyDown(document.body, { which: Key.Escape });
    expect(proseMirrorEditorEl).toHaveTextContent(DEFAULT_TEXT);

    // should not set the text to empty after undoing
    // manual blur required
    act(() => proseMirrorEditorEl.blur());
    mockSetActiveWidget('');
    fireEvent.keyDown(document.body, { which: Key.Z, metaKey: true });
    expect(proseMirrorEditorEl).toHaveTextContent('hello');
  });

  it('Should update text widget while in active / default mode', async () => {
    const widgetId = '003.widget-1';
    const widget = { widgetId, ...generateDefaultData('paragraph', '') };
    const { container } = renderWidget(<TextWidget />, { widget });
    mockSetActiveWidget(widgetId);
    mockLoadWidgetToInfograph(widget);

    // Toggle bold:
    const boldButton = screen.getByLabelText('Bold Icon');
    fireEvent.click(boldButton);
    const proseMirrorEditor = container.querySelector('.ProseMirror');
    const boldTag = proseMirrorEditor.querySelector('strong');
    expect(boldTag).toBeInTheDocument();
    fireEvent.click(boldButton);
    expect(boldTag).not.toBeInTheDocument();
  });

  it('Undo redo should work while widget is in active/default mode', async () => {
    const widgetId = '003.widget-1';
    const widget = { widgetId, ...generateDefaultData('paragraph', '') };
    const { container } = renderWidget(
      <>
        <KeyboardShortcut />
        <TextWidget />
      </>,
      { widget },
    );
    mockLoadWidgetToInfograph(widget);
    mockSetActiveWidget(widgetId);

    const proseMirrorEditor = container.querySelector('.ProseMirror');

    // Style properties should undo/redo
    const boldButton = screen.getByLabelText('Bold Icon');
    fireEvent.click(boldButton);
    const boldTag = proseMirrorEditor.querySelector('strong');
    expect(boldTag).toBeInTheDocument();
    fireEvent.keyDown(document.body, { which: Key.Z, metaKey: true });
    expect(boldTag).not.toBeInTheDocument();

    mockSetActiveWidget(widgetId);
    fireEvent.click(proseMirrorEditor);
    fireEvent.click(proseMirrorEditor);
    // manual focus here required
    // editor?.commands.focus('all') does not seem to work in the test environment
    proseMirrorEditor.focus();

    await userEvent.keyboard('{backspace}');
    await userEvent.keyboard('abc');
    expect(proseMirrorEditor).toHaveTextContent('abc');

    // set the widget to active
    fireEvent.keyDown(document.body, { which: Key.Escape });
    // blur has to be manually triggered
    fireEvent.blur(proseMirrorEditor);

    fireEvent.keyDown(document.body, { which: Key.Z, metaKey: true });
    expect(proseMirrorEditor).toHaveTextContent(DEFAULT_TEXT);
  });
});
