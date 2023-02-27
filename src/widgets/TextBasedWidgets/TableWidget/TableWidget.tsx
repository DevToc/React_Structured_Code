import '../common/prosemirror.css';
import { ReactElement, useCallback, useRef, useState, useEffect } from 'react';
import { Box } from '@chakra-ui/react';
import isEqual from 'lodash.isequal';
import { EditorView } from 'prosemirror-view';
import { useEditor, EditorContent } from '@tiptap/react';

import { useEditor as useInfographEditor, useWidget, WidgetBase, ReadOnlyWidgetBase, WidgetToolbar } from 'widgets/sdk';
import { WidgetState, TableWidgetData, TableEditorProps, EditorStateWithTableColumn } from './TableWidget.types';
import { useResizeObserver } from 'hooks/useResizeObserver';
import { extensions } from './TableWidget.config';
import { TableWidgetToolbarMenu } from './toolbar/TableWidgetToolbar';
import { Key } from 'constants/keyboard';
import { ensurePreviousMarks } from '../common/TextBasedWidgets.helpers';
import { TextWidgetTag } from '../common/TextBasedWidgets.types';
import { useTableBoundingBox } from './useTableBoundingBox';
import { usePageManager } from 'modules/Editor/components/PageManager/usePageManager';
import { handlePaste } from './TableWidget.helpers';

export const TableWidget = (): ReactElement => {
  const [widgetState, setNewWidgetState] = useState(WidgetState.Default);
  const { proseMirrorData, updateWidget } = useWidget<TableWidgetData>();

  const {
    isWidgetSelected,
    enableEditorKeyboardShortcuts,
    disableEditorKeyboardShortcuts,
    isWidgetFocused,
    setWidgetFocus,
    boundingBox,
  } = useInfographEditor();

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
      handleTextInput(view: EditorView, from: number, to: number, text: string) {
        return ensurePreviousMarks(view, TextWidgetTag.Paragraph, from, to, text);
      },
      handlePaste,
    },
    content: proseMirrorData,
  });

  const dispatchUpdateWidget = useCallback(
    (options?: Partial<TableWidgetData>) => {
      const newProseMirrorData = editor?.getJSON();
      if (!newProseMirrorData || isEqual(newProseMirrorData, proseMirrorData)) return;

      const editorHeight = editor?.view.dom.clientHeight ?? 0;
      const editorWidth = editor?.view.dom.clientWidth ?? 0;

      updateWidget({ proseMirrorData: newProseMirrorData, widthPx: editorWidth, heightPx: editorHeight, ...options });
      // update the bounding box rect since the height can be updated
      setTimeout(() => boundingBox.updateRect(), 0);
    },
    [editor, updateWidget, proseMirrorData, boundingBox],
  );

  const resetColumnResize = useCallback(() => {
    // if the column resize handle is active reset it
    const state = editor?.view.state as EditorStateWithTableColumn;
    if (state) {
      const columnResizeActive = state.tableColumnResizing$?.activeHandle !== -1;
      if (!columnResizeActive || !state.tableColumnResizing$) return;

      state.tableColumnResizing$.activeHandle = -1;
      editor?.view.updateState(state);
    }
  }, [editor]);

  const setWidgetState = useCallback(
    (newWidgetState: WidgetState) => {
      setNewWidgetState(newWidgetState);

      const isActive = newWidgetState === WidgetState.Active;
      const isDefault = newWidgetState === WidgetState.Default;
      const isEditable = newWidgetState === WidgetState.Edit;

      if (isActive || isDefault) {
        // enable keyboard shortcuts when the widget is in active state
        enableEditorKeyboardShortcuts();

        // reset the text editor state
        editor?.commands.blur();
        editor?.commands.setTextSelection(0);
        editor?.setEditable(false);
        resetColumnResize();
      }

      // When the widget is in edit state the editor is focused
      // Reset the focus to the widget when state changes from edit -> active for widget keyboard shortcuts to work
      if (isActive && !isWidgetFocused()) setWidgetFocus();

      if (isEditable) {
        // disable keyboard shortcuts when the widget is in edit state
        // The duplicate shortcut is still allowed
        disableEditorKeyboardShortcuts({ allowedKeyboardKeys: [Key.D] });

        // focus the editor if its not focused
        if (editor && !editor.isFocused) {
          editor.setEditable(true);
          editor.commands.focus();
        }
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [enableEditorKeyboardShortcuts, disableEditorKeyboardShortcuts, isWidgetFocused, setWidgetFocus, editor],
  );

  const onClick = useCallback(
    (e: React.MouseEvent<HTMLElement>) => {
      // If click target (target) matches widget container (currentTarget), keep it in active state
      // otherwise the text content was clicked so enter edit state
      if (widgetState === WidgetState.Active && e.target !== e.currentTarget) setWidgetState(WidgetState.Edit);
      if (widgetState === WidgetState.Default) setWidgetState(WidgetState.Active);
    },
    [setWidgetState, widgetState],
  );

  // if the widget is deleted ensure that the keyboard shortcuts are enabled again
  useEffect(() => () => enableEditorKeyboardShortcuts(), [enableEditorKeyboardShortcuts]);

  // If the widget is not selected anymore, reset the widget state to default
  useEffect(() => {
    if (!isWidgetSelected && widgetState !== WidgetState.Default) setWidgetState(WidgetState.Default);
    // a widget can be selected without going through onClick (e.g. keyboard tab, drag area)
    // a selected text widget should never be in default state
    if (isWidgetSelected && widgetState === WidgetState.Default) setWidgetState(WidgetState.Active);
  }, [isWidgetSelected, widgetState, setWidgetState]);

  // This effect updates tiptap editor content if there is change via external action like undo/redo
  // For large document, it may require more optimization later on
  useEffect(() => {
    if (editor && !isWidgetSelected && !editor.isFocused && !isEqual(editor.getJSON(), proseMirrorData)) {
      // if the column resize is active reset it
      // keeping it active will cause the editor to crash with setContent
      resetColumnResize();
      editor.commands.setContent(proseMirrorData);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editor, isWidgetSelected, proseMirrorData, boundingBox]);

  const { customOnResizeStart, customOnResize, customOnResizeEnd, customOnRotateStart, customOnDrag, customOnDragEnd } =
    useTableBoundingBox({
      setWidgetState,
      editor,
      isWidgetSelected,
      dispatchUpdateWidget,
    });

  return (
    <WidgetBase
      onClick={onClick}
      onResizeStart={customOnResizeStart}
      onResizeEnd={customOnResizeEnd}
      onResize={customOnResize}
      onRotateStart={customOnRotateStart}
      onDrag={customOnDrag}
      onDragEnd={customOnDragEnd}
    >
      <TableEditor widgetState={widgetState} editor={editor} dispatchUpdateWidget={dispatchUpdateWidget} />
    </WidgetBase>
  );
};

const TableEditor = ({ widgetState, editor, dispatchUpdateWidget }: TableEditorProps): ReactElement => {
  const tableWrapperRef = useRef<HTMLDivElement>(null);
  const { boundingBox, isWidgetSelected } = useInfographEditor();

  const isEditable = widgetState === WidgetState.Edit;
  const isActive = widgetState === WidgetState.Active;

  const onBlur = useCallback(() => {
    dispatchUpdateWidget();
    if (!isWidgetSelected) editor?.commands.blur();
  }, [editor, dispatchUpdateWidget, isWidgetSelected]);

  const fitBoundingBoxToTextWhileTyping = ({ height }: { height: number | undefined }) => {
    if ((isEditable || isActive) && typeof height === 'number') {
      boundingBox.updateRect();
    }
  };

  useResizeObserver({ ref: tableWrapperRef.current, onResize: fitBoundingBoxToTextWhileTyping });

  if (!editor) return <></>;

  const stopPropagation = (e: React.KeyboardEvent | React.MouseEvent) => {
    if (isEditable) e.stopPropagation();
  };

  return (
    <>
      <WidgetToolbar>
        <TableWidgetToolbarMenu dispatchUpdateWidget={dispatchUpdateWidget} editor={editor} widgetState={widgetState} />
      </WidgetToolbar>
      <Box
        _hover={{ cursor: isEditable ? 'text' : 'default' }}
        h='fit-content'
        w='100%'
        cursor={isEditable ? '' : 'move !important'}
        position='relative'
        onClick={stopPropagation}
        onMouseDown={stopPropagation}
        onBlur={onBlur}
        ref={tableWrapperRef}
        pointerEvents={widgetState !== WidgetState.Default ? 'auto' : 'none'}
      >
        <EditorContent editor={editor} />
      </Box>
    </>
  );
};

export const ReadOnlyTableWidget = (): ReactElement => {
  const { proseMirrorData } = useWidget<TableWidgetData>();
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

  /**
   * Note: There is possible tiptap bug that not update table column with editable flag set to false at initial load
   * @see https://github.com/ueberdosis/tiptap/blob/be4cde0e026a7668f99f85a9248e215873dbd9f0/packages/extension-table/src/table.ts#L233
   */
  const editor = useEditor({
    extensions: customExtensions,
    editorProps: {
      // To avoid `tabbability` on tables from the thumbnail in the page slide view
      // that interfere with the page tab order
      attributes: {
        tabindex: '-1',
      },
      handleDOMEvents: {
        // Prevent text drag and drop
        drop: (_, e: Event) => {
          e.preventDefault();
          return false;
        },
        mousedown: (_, e: Event) => {
          // Prevent all mouse click
          e.preventDefault();
          e.stopImmediatePropagation();
          return false;
        },
      },
    },
    content: proseMirrorData,
  });

  // Disable edit
  useEffect(() => editor?.setEditable(false), [editor]);

  const preventMouseEvent = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    return false;
  };

  return (
    <ReadOnlyWidgetBase disableSingleSelect>
      <Box h='fit-content' w='100%' position='relative' onMouseDown={preventMouseEvent}>
        <EditorContent editor={editor} />
      </Box>
    </ReadOnlyWidgetBase>
  );
};
