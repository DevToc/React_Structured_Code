import { JSONContent } from '@tiptap/core';
import { Editor } from '@tiptap/react';
import { EditorState } from 'prosemirror-state';
import { Widget } from 'types/widget.types';

interface TableWidgetData extends Widget {
  proseMirrorData: JSONContent | string;
}

export enum WidgetState {
  // widget is not selected
  Default = 'default',
  // widget is selected but not in text editable mode
  Active = 'active',
  // widget is selected and in text editable mode
  Edit = 'edit',
}

interface TableEditorProps {
  widgetState: WidgetState;
  editor: Editor | null;
  dispatchUpdateWidget: () => void;
}

export interface UseTableBoundingBoxProps {
  setWidgetState: (arg: WidgetState) => void;
  editor: Editor | null;
  isWidgetSelected: boolean;
  dispatchUpdateWidget: () => void;
}

type CellAttributes = {
  borderColor?: string;
  borderWidth?: string;
  backgroundColor?: string;
};

type EditorStateWithTableColumn = EditorState & {
  tableColumnResizing$?: { dragging: { startX: number; startWidth: number } | null; activeHandle: number };
};

export type { CellAttributes, TableWidgetData, TableEditorProps, EditorStateWithTableColumn };
