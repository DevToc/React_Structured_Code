import '../common/prosemirror.css';
import { ReactElement, useCallback, useRef, useState, useEffect, Suspense, FC } from 'react';
import { Box, Spinner } from '@chakra-ui/react';
import isEqual from 'lodash.isequal';
import { EditorView } from 'prosemirror-view';
import { useEditor, EditorContent, Editor } from '@tiptap/react';

import { useResizeObserver } from 'hooks/useResizeObserver';
import { Key } from 'constants/keyboard';
import { useEditor as useInfographEditor, useWidget, WidgetBase, ReadOnlyWidgetBase, WidgetToolbar } from 'widgets/sdk';
import { usePageManager } from 'modules/Editor/components/PageManager/usePageManager';

import { ensurePreviousMarks } from '../common/TextBasedWidgets.helpers';
import { WidgetState } from '../common/TextBasedWidgets.types';
import { TextEditorProps, TextWidgetData } from './TextWidget.types';
import { TextWidgetControlKeyboardShortcuts } from './TextWidgetControlKeyboardShortcuts';
import { useTextBoundingBox } from './useTextBoundingBox';
import { DEFAULT_TEXT, extensions } from './TextWidget.config';
import { handlePaste } from './TextWidget.helpers';
import { useDynamicImport } from 'hooks/useDynamicImport';
import { WidgetComponentsMap } from 'widgets/components.lazy';

interface TextWidgetToolbarProps {
  widgetState: WidgetState;
  editor: Editor;
  dispatchUpdateWidget: (options?: Partial<TextWidgetData>) => void;
}

const TextWidgetToolbar: FC<TextWidgetToolbarProps> = (props): ReactElement => {
  const Component = useDynamicImport('textWidgetToolbar', WidgetComponentsMap);

  return (
    <Suspense fallback={<Spinner />}>
      <Component {...props} />
    </Suspense>
  );
};

export const TextWidget = (): ReactElement => {
  const [widgetState, setNewWidgetState] = useState(WidgetState.Default);
  const { textTag, proseMirrorData, updateWidget } = useWidget<TextWidgetData>();
  const {
    isWidgetSelected,
    enableEditorKeyboardShortcuts,
    disableEditorKeyboardShortcuts,
    isWidgetFocused,
    setWidgetFocus,
    boundingBox,
  } = useInfographEditor();

  const isWidgetHighlighted = useRef<boolean>(false);
  const isEditable = widgetState === WidgetState.Edit;
  const editor = useEditor({
    extensions,
    editorProps: {
      handleDOMEvents: {
        // Prevent text drag and drop
        drop: (_, e: Event) => {
          e.preventDefault();
          return false;
        },
      },
      handlePaste(this, view, _, slice) {
        return handlePaste(view, slice, textTag);
      },
      handleTextInput(view: EditorView, from: number, to: number, text: string) {
        return ensurePreviousMarks(view, textTag, from, to, text);
      },
    },
    content: proseMirrorData,
    editable: isEditable,
  });

  const dispatchUpdateWidget = useCallback(
    (options?: Partial<TextWidgetData>) => {
      const newProseMirrorData = editor?.getJSON();

      if (!newProseMirrorData) return;
      if (isEqual(newProseMirrorData, proseMirrorData)) {
        // the height can be updated even if the content is the same
        setTimeout(() => boundingBox.updateRect(), 0);
        return;
      }

      const editorHeight = editor?.view.dom.clientHeight ?? 0;
      const widgetHeight = editorHeight;

      updateWidget({ proseMirrorData: newProseMirrorData, heightPx: widgetHeight, ...options });
      // update the bounding box rect since the height can be updated
      setTimeout(() => boundingBox.updateRect(), 0);
    },
    [updateWidget, editor, proseMirrorData, boundingBox],
  );

  // update the widget state (default, active, edit)
  // Update the keyboard, focus, prosemirror editor as needed for each state change
  const setWidgetState = useCallback(
    (newWidgetState: WidgetState) => {
      setNewWidgetState(newWidgetState);

      const isActive = newWidgetState === WidgetState.Active;
      const isDefault = newWidgetState === WidgetState.Default;
      const isEditable = newWidgetState === WidgetState.Edit;

      // When the widget is in edit state the editor is focused
      // Reset the focus to the widget when state changes from edit -> active for widget keyboard shortcuts to work
      if (isActive && !isWidgetFocused()) setWidgetFocus();

      if (isActive || isDefault) {
        // The editor should never be editable when the widget is not in edit state
        if (editor?.isEditable) editor?.setEditable(false);

        // keyboard shortcuts should be enabled when the widget is not in edit state
        enableEditorKeyboardShortcuts();

        // if the text is empty, set it to the default text when exiting edit mode
        if (editor?.isEmpty) {
          editor.chain().applyEmptyTextStyle().insertContent(DEFAULT_TEXT).run();
          dispatchUpdateWidget();
        }
      }

      if (isEditable) {
        // focus the editor if its not focused
        if (editor && !editor.isFocused) {
          editor.setEditable(true);
          editor.commands.focus('all');
        }

        // disable keyboard shortcuts when the widget is in edit state
        // The duplicate shortcut is still allowed
        disableEditorKeyboardShortcuts({ allowedKeyboardKeys: [Key.D] });
      }
    },
    [
      isWidgetFocused,
      setWidgetFocus,
      editor,
      disableEditorKeyboardShortcuts,
      enableEditorKeyboardShortcuts,
      dispatchUpdateWidget,
    ],
  );

  const onClick = useCallback(
    (e: React.MouseEvent<HTMLElement>) => {
      // If click target (target) matches widget container (currentTarget), keep it in active state
      // otherwise the text content was clicked so enter edit state
      if (widgetState === WidgetState.Active && e.target !== e.currentTarget) setWidgetState(WidgetState.Edit);
      if (widgetState === WidgetState.Default) {
        if (!isWidgetHighlighted.current) return;
        setWidgetState(WidgetState.Active);
        isWidgetHighlighted.current = true;
      }
    },
    [widgetState, setWidgetState],
  );

  // If the widget is not selected anymore, reset the widget state to default
  useEffect(() => {
    if (!isWidgetSelected && widgetState !== WidgetState.Default) {
      setWidgetState(WidgetState.Default);
      isWidgetHighlighted.current = false;
    }
    // run this effect only when widgetState or isWidgetxSelected changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isWidgetSelected, widgetState]);

  // if the widget is deleted ensure that the keyboard shortcuts are enabled again
  useEffect(() => () => enableEditorKeyboardShortcuts(), [enableEditorKeyboardShortcuts]);

  // This effect updates tiptap editor content if there is change via external action like undo/redo
  // For large document, it may require more optimization later on
  useEffect(() => {
    const shouldResetEditorContent =
      editor &&
      !isWidgetSelected &&
      !editor.isFocused &&
      proseMirrorData &&
      !isEqual(editor.getJSON(), proseMirrorData);
    if (shouldResetEditorContent) {
      editor.commands.setContent(proseMirrorData);
    }
  }, [editor, isWidgetSelected, proseMirrorData]);

  const { customOnResizeStart, customOnResize, customOnResizeEnd, customOnRotateStart, customOnDragEnd } =
    useTextBoundingBox({ setWidgetState, editor, isWidgetSelected });

  return (
    <WidgetBase
      onClick={onClick}
      onResizeStart={customOnResizeStart}
      onResizeEnd={customOnResizeEnd}
      onResize={customOnResize}
      onRotateStart={customOnRotateStart}
      onDragEnd={customOnDragEnd}
    >
      <TextEditor
        dispatchUpdateWidget={dispatchUpdateWidget}
        isWidgetSelected={isWidgetSelected}
        setWidgetState={setWidgetState}
        widgetState={widgetState}
        editor={editor}
      />
    </WidgetBase>
  );
};

const TextEditor = ({
  widgetState,
  setWidgetState,
  isWidgetSelected,
  editor,
  dispatchUpdateWidget,
}: TextEditorProps): ReactElement => {
  const textWrapperRef = useRef<HTMLDivElement>(null);
  const { boundingBox } = useInfographEditor();

  const isEditable = widgetState === WidgetState.Edit;
  const focusEditor = () => editor?.chain().focus();

  const onBlur = useCallback(() => {
    editor?.chain().blur();
    // if the text is empty, set it to the default text when exiting edit mode in setWidgetState
    if (!editor?.isEmpty) dispatchUpdateWidget();
  }, [editor, dispatchUpdateWidget]);

  const fitBoundingBoxToTextWhileTyping = ({ height }: { height: number | undefined }) => {
    if (isEditable && editor && typeof height === 'number') boundingBox.updateRect();
  };

  useResizeObserver({ ref: textWrapperRef.current, onResize: fitBoundingBoxToTextWhileTyping });

  if (!editor) return <></>;

  const stopPropagation = (e: React.KeyboardEvent | React.MouseEvent) => {
    if (isEditable) e.stopPropagation();
  };

  return (
    <>
      <WidgetToolbar>
        <TextWidgetToolbar widgetState={widgetState} dispatchUpdateWidget={dispatchUpdateWidget} editor={editor} />
      </WidgetToolbar>
      {isWidgetSelected && (
        <TextWidgetControlKeyboardShortcuts
          focusEditor={focusEditor}
          setWidgetState={setWidgetState}
          widgetState={widgetState}
        />
      )}
      <Box
        _hover={{ cursor: isEditable ? 'text' : 'default' }}
        h='fit-content'
        w='100%'
        cursor={isEditable ? '' : 'move !important'}
        position='relative'
        onClick={stopPropagation}
        onMouseDown={stopPropagation}
        onBlur={onBlur}
        ref={textWrapperRef}
      >
        <EditorContent editor={editor} />
      </Box>
    </>
  );
};

export const ReadOnlyTextWidget = (): ReactElement => {
  const { proseMirrorData } = useWidget<TextWidgetData>();
  const [CustomLink, ...otherExtensions] = extensions;

  const { disableTabbability } = usePageManager();

  let customExtensions = [
    ...otherExtensions,
    // To fix the issue with links on /pl page not clickable
    // due to the global style on anchor tag from proseMirror
    CustomLink.configure({
      HTMLAttributes: {
        style: 'pointer-events: auto',
      },
    }),
  ];

  if (disableTabbability) {
    customExtensions = [
      ...otherExtensions,
      // To avoid `tabbability` on links from the thumbnail in the page slide view
      // that interfere with the page tab order
      CustomLink.configure({
        HTMLAttributes: {
          tabindex: -1,
        },
      }),
    ];
  }

  const editor = useEditor(
    {
      extensions: customExtensions,
      content: proseMirrorData,
      editable: false,
    },
    [proseMirrorData],
  );

  return (
    <ReadOnlyWidgetBase>
      <Box h='fit-content' w='100%' position='relative'>
        <EditorContent editor={editor} />
      </Box>
    </ReadOnlyWidgetBase>
  );
};
