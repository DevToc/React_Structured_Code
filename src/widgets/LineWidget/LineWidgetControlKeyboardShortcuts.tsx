import { Key } from '../../constants/keyboard';
import { useEventListener } from '../../hooks/useEventListener';
import { FocusArea } from '../../modules/Editor/store/editorSettingsSlice.types';
import { WidgetState } from './LineWidget.types';
import { LineWidgetControlKeyboardShortcutsProps } from './LineWidget.types';
import { useEditor } from 'widgets/sdk';

export const LineWidgetControlKeyboardShortcuts = ({
  setWidgetState,
  widgetState,
  setFocus,
  onKeyEvent,
}: LineWidgetControlKeyboardShortcutsProps) => {
  const { focusArea, isWidgetFocused } = useEditor();

  const isToolbarFocused = focusArea === FocusArea.Toolbar;
  const isEditable = widgetState === WidgetState.Edit;
  const isActive = widgetState === WidgetState.Active;
  const isDefault = widgetState === WidgetState.Default;

  const onKeyDown = (e: KeyboardEvent | Event) => {
    const event = e as KeyboardEvent;
    const key: Key = event.which || event.keyCode;
    const isMod: boolean = event.metaKey || event.ctrlKey;
    const isShift: boolean = event.shiftKey;

    if (isEditable && isMod) {
      setFocus({ isWidget: true });
      setWidgetState(WidgetState.Active);
      return;
    }

    switch (key) {
      case Key.Escape:
        if (isEditable) {
          setFocus({ isWidget: true });
          setWidgetState(WidgetState.Active);
        }
        break;
      case Key.Enter:
        if (isActive || isDefault) {
          if (isWidgetFocused()) {
            setWidgetState(WidgetState.Edit);
            setFocus({ index: 0 });
          }
        }
        break;
      case Key.Tab:
        if (isEditable && !isToolbarFocused) {
          e.preventDefault();
          if (isShift) return setFocus({ movePrev: true });
          return setFocus({ moveNext: true });
        }
        break;
      case Key.UpArrow:
      case Key.DownArrow:
      case Key.LeftArrow:
      case Key.RightArrow:
        if (isMod) return;
        if (isEditable && !isToolbarFocused) {
          e.preventDefault();
          onKeyEvent(key, isShift);
        }
        break;
    }
  };

  useEventListener('keydown', onKeyDown);

  return <></>;
};
