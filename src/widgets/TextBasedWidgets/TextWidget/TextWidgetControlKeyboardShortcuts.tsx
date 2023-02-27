import { Key } from '../../../constants/keyboard';
import { useEventListener } from '../../../hooks/useEventListener';
import { FocusArea } from '../../../modules/Editor/store/editorSettingsSlice.types';
import { WidgetState } from '../common/TextBasedWidgets.types';
import { TextWidgetControlKeyboardShortcutsProps } from './TextWidget.types';
import { useEditor as useInfographEditor } from 'widgets/sdk';

// custom text widget keyboard shortcuts that are not related to WYSIWYG editing
export const TextWidgetControlKeyboardShortcuts = ({
  setWidgetState,
  widgetState,
  focusEditor,
}: TextWidgetControlKeyboardShortcutsProps) => {
  const { setWidgetToolbarFocus, isWidgetFocused, isCanvasFocused, focusArea, onSetNextActiveWidget } =
    useInfographEditor();

  const isToolbarFocused = focusArea === FocusArea.Toolbar;
  const isEditable = widgetState === WidgetState.Edit;
  const isActive = widgetState === WidgetState.Active;
  const isDefault = widgetState === WidgetState.Default;

  const onKeyDown = (e: KeyboardEvent | Event) => {
    const event = e as KeyboardEvent;
    const key: Key = event.which || event.keyCode;

    const isMod: boolean = event.metaKey || event.ctrlKey;
    const isAlt: boolean = event.altKey;

    switch (key) {
      case Key.Escape:
        if (isEditable) {
          if (isToolbarFocused) return focusEditor();
          else return setWidgetState(WidgetState.Active);
        }
        break;
      case Key.Enter:
        if (isActive || isDefault) {
          if (isWidgetFocused()) return setWidgetState(WidgetState.Edit);
          if (isCanvasFocused()) return onSetNextActiveWidget();
        }
        break;
      case Key.T:
        if (isMod && isAlt && isEditable) return setWidgetToolbarFocus();
        break;
      case Key.Tab:
        if (isEditable && !isToolbarFocused) {
          e.preventDefault();
          return;
        }
    }
  };

  useEventListener('keydown', onKeyDown);

  return <></>;
};
