import { ReactElement, useMemo, useEffect, useCallback } from 'react';
import { Flex, IconButton, Tooltip, Select } from '@chakra-ui/react';
import { getNodeAttributes } from '@tiptap/core';
import { Editor } from '@tiptap/react';

import { Mixpanel } from 'libs/third-party/Mixpanel/mixpanel';
import { TEXT_TAG_EDITED } from 'constants/mixpanel';
import { TEXT_LINE_HEIGHT, TEXT_ALIGNMENT } from 'constants/fonts';
import { isValidUrl, withProtocol } from 'utils/url';
import { useDebouncedCallback } from 'hooks/useDebounce';
import { useWidget, useEditor } from 'widgets/sdk';
import { ColorPicker } from 'modules/Editor/components/ColorPicker';
import { TEXT_WIDGET_TAG_OPTIONS } from 'modules/Editor/components/AccessibilityManager/AccessibilityChecker/HeadingChecker/AutoCheckPanel/InvalidWidgetItem';
import { TextWidgetTagOption } from './TextWidgetTagOption';
import { TextWidgetTag, WidgetState } from '../../common/TextBasedWidgets.types';
import { TextWidgetData } from '../TextWidget.types';
import { FontFamilySelect } from 'modules/common/components/FontFamilySelect';
import { FontSizeSelect } from 'modules/common/components/FontSizeSelect';

import { ReactComponent as BoldIcon } from 'assets/icons/bold.svg';
import { ReactComponent as ItalicIcon } from 'assets/icons/italic.svg';
import { ReactComponent as UnderlineIcon } from 'assets/icons/underline.svg';
import { ReactComponent as LinkIcon } from 'assets/icons/link.svg';
import { ReactComponent as OrderedListIcon } from 'assets/icons/number-list.svg';
import { ReactComponent as UnOrderedListIcon } from 'assets/icons/bullet-list.svg';

interface TextWidgetToolbarMenuProps {
  editor: Editor;
  widgetState: WidgetState;
  dispatchUpdateWidget: (options?: Partial<TextWidgetData>) => void;
}

/**
 * Avoid losing focus after button click
 * @param e
 */
function handleMouseDown(e: React.MouseEvent) {
  e.preventDefault();
}

export const TextWidgetToolbarMenu = ({
  editor,
  dispatchUpdateWidget,
  widgetState,
}: TextWidgetToolbarMenuProps): ReactElement => {
  const { textTag } = useWidget<TextWidgetData>();
  const { setWidgetToolbarState } = useEditor();
  const debounceDispatchUpdateWidget = useDebouncedCallback(dispatchUpdateWidget, 200);
  const textStyle = editor?.getAttributes('textStyle');
  const isEditable = widgetState === WidgetState.Edit;

  // if the widget is active / default mode the editor has to be focused to update the style
  const handleEditorFocus = useCallback(() => {
    if (!isEditable) editor?.commands.focus('all');
  }, [editor, isEditable]);

  // Get node attributes based on tag type
  let nodeAttributes = editor?.state && getNodeAttributes(editor.state, editor.schema.nodes.heading);
  switch (textTag) {
    case TextWidgetTag.Title:
      nodeAttributes = editor?.state && getNodeAttributes(editor.state, editor.schema.nodes.title);
      break;
    case TextWidgetTag.Paragraph:
      nodeAttributes = editor?.state && getNodeAttributes(editor.state, editor.schema.nodes.paragraph);
      break;
    default:
      break;
  }
  const isBold = !!editor?.isActive('bold');
  const isItalic = !!editor?.isActive('italic');
  const isUnderline = !!editor?.isActive('underline');
  const isLink = !!editor?.isActive('link');
  const fontFamily = textStyle?.fontFamily;
  const fontSize = String(parseInt(textStyle?.fontSize) ?? '');
  const color = textStyle?.color;
  const textAlign = nodeAttributes?.textAlign;
  const lineHeight = nodeAttributes?.lineHeight;
  const isOrderedList = !!editor?.isActive('orderedList');
  const isUnOrderedList = !!editor?.isActive('bulletList');
  const link = editor?.getAttributes('link')?.href || '';

  const onSetTextTag = useCallback(
    (textTag: TextWidgetTag) => {
      let command = editor.chain().focus('all').clearNodes();

      switch (textTag) {
        case TextWidgetTag.Title:
          command = command.setTitle();
          break;
        case TextWidgetTag.Paragraph:
          command = command.setNode('paragraph');
          break;
        case TextWidgetTag.H1:
        case TextWidgetTag.H2:
        case TextWidgetTag.H3:
        case TextWidgetTag.H4:
        case TextWidgetTag.H5:
        case TextWidgetTag.H6: {
          const level = parseInt(textTag.charAt(textTag.length - 1)) as 1 | 2 | 3 | 4 | 5 | 6;
          command = command.toggleHeading({ level });
          break;
        }
        default:
          break;
      }

      command.setLineHeight(lineHeight).setTextAlign(textAlign).run();
      dispatchUpdateWidget({ textTag });

      const selectedTagIndex = TEXT_WIDGET_TAG_OPTIONS.findIndex((opt) => opt.value === textTag);
      Mixpanel.track(TEXT_TAG_EDITED, {
        from: 'Text Toolbar',
        text_tag: TEXT_WIDGET_TAG_OPTIONS[selectedTagIndex].label,
      });
    },
    [editor, dispatchUpdateWidget, lineHeight, textAlign],
  );

  const onSetBold = useCallback(() => {
    handleEditorFocus();
    editor.chain().focus().toggleBold().run();
    dispatchUpdateWidget();
  }, [editor, dispatchUpdateWidget, handleEditorFocus]);

  const onSetItalic = useCallback(() => {
    handleEditorFocus();
    editor.chain().focus().toggleItalic().run();
    dispatchUpdateWidget();
  }, [editor, dispatchUpdateWidget, handleEditorFocus]);

  const onSetUnderline = useCallback(() => {
    handleEditorFocus();
    editor.chain().focus().toggleUnderline().run();
    dispatchUpdateWidget();
  }, [editor, dispatchUpdateWidget, handleEditorFocus]);

  const onSetFontFamily = useCallback(
    (fontFamily: string) => {
      if (!fontFamily) return;
      handleEditorFocus();

      editor.chain().focus().setFontFamily(fontFamily).run();
      dispatchUpdateWidget();
    },
    [editor, dispatchUpdateWidget, handleEditorFocus],
  );

  const onSetFontColor = useCallback(
    (color: string) => {
      handleEditorFocus();
      // TODO: current color picker mousedown has side effect on text focus, need to improve later on
      editor.chain().setColor(color).run();
      debounceDispatchUpdateWidget();
    },
    [editor, debounceDispatchUpdateWidget, handleEditorFocus],
  );

  const onSetFontSize = useCallback(
    (e: React.FormEvent<HTMLSelectElement>) => {
      const target = e.target as HTMLSelectElement;
      const fontSize = target.value;
      if (!fontSize) return;

      handleEditorFocus();
      editor.chain().focus().setFontSize(`${fontSize}px`).run();
      dispatchUpdateWidget();
    },
    [editor, dispatchUpdateWidget, handleEditorFocus],
  );

  const onSetTextAlign = useCallback(
    (e: React.FormEvent<HTMLSelectElement>) => {
      const target = e.target as HTMLSelectElement;
      const textAlign = target.value;
      if (!textAlign) return;

      handleEditorFocus();
      editor.chain().focus().setTextAlign(textAlign).run();
      dispatchUpdateWidget();
    },
    [editor, dispatchUpdateWidget, handleEditorFocus],
  );

  const onSetLineHeight = useCallback(
    (e: React.FormEvent<HTMLSelectElement>) => {
      const target = e.target as HTMLSelectElement;
      const lineHeight = target.value;
      if (!lineHeight) return;

      handleEditorFocus();
      editor.chain().focus().setLineHeight(lineHeight).run();
      dispatchUpdateWidget();
    },
    [editor, dispatchUpdateWidget, handleEditorFocus],
  );

  const onSetOrderedList = useCallback(() => {
    handleEditorFocus();

    // Toggle list ON will convert widget to <p/>
    if (!editor.isActive('orderedList') && textTag !== TextWidgetTag.Paragraph) {
      onSetTextTag(TextWidgetTag.Paragraph);
    }

    editor.chain().focus().toggleOrderedList().run();
    dispatchUpdateWidget();
  }, [editor, dispatchUpdateWidget, onSetTextTag, textTag, handleEditorFocus]);

  const onSetUnorderedList = useCallback(() => {
    handleEditorFocus();

    // Toggle list ON will convert widget to <p/>
    if (!editor.isActive('bulletList') && textTag !== TextWidgetTag.Paragraph) {
      onSetTextTag(TextWidgetTag.Paragraph);
    }
    editor.chain().focus().toggleBulletList().run();
    dispatchUpdateWidget();
  }, [editor, dispatchUpdateWidget, onSetTextTag, textTag, handleEditorFocus]);

  const onSetLink = useCallback(() => {
    const url = window.prompt('URL', link);
    if (url === null) return;

    if (url === '') {
      if (!editor?.isFocused) editor?.commands.focus('all');
      handleEditorFocus();
      editor.chain().focus().extendMarkRange('link').unsetLink().run();
      return;
    }

    // Set link with protocol
    const fullUrl = withProtocol(url);
    if (isValidUrl(fullUrl)) {
      handleEditorFocus();
      editor.chain().focus().extendMarkRange('link').setLink({ href: fullUrl }).run();
    }
  }, [editor, link, handleEditorFocus]);

  const controlAction = useMemo(() => {
    const actions = { setTextTag: onSetTextTag };
    return actions;
  }, [onSetTextTag]);

  useEffect(() => {
    // TODO: unserializable control action, need to re think toolbar setup
    setWidgetToolbarState({ ...controlAction });
  }, [setWidgetToolbarState, controlAction]);

  // stop click events from propagation to the text widget itself
  const onClick = (e: React.MouseEvent<HTMLDivElement>) => e.stopPropagation();

  return (
    <Flex onClick={onClick} mr='8px' gap='8px' align='center'>
      <ColorPicker
        iconStyle='text'
        color={color ?? ''}
        label='Font color'
        onChange={onSetFontColor}
        showNoColorOption={false}
      />
      <FontFamilySelect fontFamily={fontFamily} onChange={onSetFontFamily} borderRadius='sm' />
      <FontSizeSelect
        onChange={onSetFontSize}
        value={fontSize ?? ''}
        data-testid='textwidget-fontsize-select'
        aria-label='Font Size'
      />
      <Tooltip hasArrow placement='bottom' label='Bold' bg='black'>
        <IconButton
          isActive={isBold}
          onClick={onSetBold}
          onMouseDown={handleMouseDown}
          size='sm'
          aria-label='Bold Icon'
          variant='icon-btn-toolbar'
          icon={<BoldIcon />}
        />
      </Tooltip>
      <Tooltip hasArrow placement='bottom' label='Italic' bg='black'>
        <IconButton
          isActive={isItalic}
          onClick={onSetItalic}
          onMouseDown={handleMouseDown}
          size='sm'
          aria-label='Italic Icon'
          variant='icon-btn-toolbar'
          icon={<ItalicIcon />}
        />
      </Tooltip>
      <Tooltip hasArrow placement='bottom' label='Underline' bg='black'>
        <IconButton
          isActive={isUnderline}
          onClick={onSetUnderline}
          onMouseDown={handleMouseDown}
          size='sm'
          aria-label='Underline Icon'
          variant='icon-btn-toolbar'
          icon={<UnderlineIcon />}
        />
      </Tooltip>
      <Tooltip hasArrow placement='bottom' label='Text Alignment' bg='black'>
        <Select
          onChange={onSetTextAlign}
          value={textAlign ?? TEXT_ALIGNMENT.left}
          width='90px'
          size='sm'
          aria-label='Text Alignment'
          borderColor='outline.gray'
        >
          {Object.values(TEXT_ALIGNMENT).map((v) => (
            <option key={`textAlign-${v}`} value={v}>
              {v}
            </option>
          ))}
        </Select>
      </Tooltip>
      <Tooltip hasArrow placement='bottom' label='Font Line Height' bg='black'>
        <Select
          onChange={onSetLineHeight}
          value={lineHeight}
          width='70px'
          size='sm'
          aria-label='Font Line Height'
          borderColor='outline.gray'
        >
          {TEXT_LINE_HEIGHT.map((v) => (
            <option key={`lineHeight-${v}`} value={v}>
              {v}
            </option>
          ))}
        </Select>
      </Tooltip>
      <Tooltip hasArrow placement='bottom' label='Bulleted List' bg='black'>
        <IconButton
          isActive={isUnOrderedList}
          onClick={onSetUnorderedList}
          onMouseDown={handleMouseDown}
          size='sm'
          aria-label='Unordered List'
          icon={<UnOrderedListIcon />}
          variant='icon-btn-toolbar'
        />
      </Tooltip>
      <Tooltip hasArrow placement='bottom' label='Numbered List' bg='black'>
        <IconButton
          isActive={isOrderedList}
          onClick={onSetOrderedList}
          onMouseDown={handleMouseDown}
          size='sm'
          aria-label='Order List'
          icon={<OrderedListIcon />}
          variant='icon-btn-toolbar'
        />
      </Tooltip>
      <Tooltip hasArrow placement='bottom' label='Link' bg='black'>
        <IconButton
          isActive={isLink}
          onClick={onSetLink}
          onMouseDown={handleMouseDown}
          size='sm'
          aria-label='Link'
          variant='icon-btn-toolbar'
          icon={<LinkIcon />}
        />
      </Tooltip>
      <TextWidgetTagOption selectedTag={textTag || TextWidgetTag.Paragraph} onChange={onSetTextTag} />
    </Flex>
  );
};
