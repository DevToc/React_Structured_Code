import { ReactElement, useMemo, useCallback } from 'react';
import { Flex, IconButton, Button, Tooltip, Select, Text } from '@chakra-ui/react';
import { getNodeAttributes, Editor } from '@tiptap/core';
import { Node as ProseMirrorNode } from 'prosemirror-model';

import { useDebouncedCallback } from 'hooks/useDebounce';
import { TEXT_LINE_HEIGHT, TEXT_ALIGNMENT } from 'constants/fonts';
import { ColorPicker } from 'modules/Editor/components/ColorPicker';
import { ToolbarDivider } from 'modules/common/components/Toolbar/ToolbarDivider';
import { SingleColorContrastChecker } from 'modules/Editor/components/ColorPicker/SingleColorContrastChecker';
import { FontFamilySelect } from 'modules/common/components/FontFamilySelect';
import { FontSizeSelect } from 'modules/common/components/FontSizeSelect';
import { HeaderOption } from '../../common/toolbar/HeaderOption/HeaderOption';
import { VerticalAlignmentSelect } from './VerticalAlignmentSelect/VerticalAlignmentSelect';
import { TextWidgetTag, WidgetState } from '../../common/TextBasedWidgets.types';
import { TableWidgetData } from '../TableWidget.types';
import { getTableData, toggleList, isList } from '../TableWidget.helpers';
import { isValidUrl, withProtocol } from '../../../../utils/url';

import { ReactComponent as TrashIcon } from 'assets/icons/trash.svg';
import { ReactComponent as BoldIcon } from 'assets/icons/bold.svg';
import { ReactComponent as ItalicIcon } from 'assets/icons/italic.svg';
import { ReactComponent as UnderlineIcon } from 'assets/icons/underline.svg';
import { ReactComponent as OrderedListIcon } from 'assets/icons/number-list.svg';
import { ReactComponent as UnOrderedListIcon } from 'assets/icons/bullet-list.svg';
import { ReactComponent as LinkIcon } from '../../../../assets/icons/link.svg';
import { ReactComponent as InsertRowBelowIcon } from 'assets/icons/insert_row_below.svg';
import { ReactComponent as InsertRowAboveIcon } from 'assets/icons/insert_row_above.svg';
import { ReactComponent as InsertColumnRightIcon } from 'assets/icons/insert_column_right.svg';
import { ReactComponent as InsertColumnLeftIcon } from 'assets/icons/insert_column_left.svg';

const BORDER_WIDTHS = ['1px', '2px', '3px', '4px', '5px'];
interface TableWidgetToolbarMenuProps {
  editor: Editor;
  dispatchUpdateWidget: (options?: Partial<TableWidgetData>) => void;
  widgetState: string;
}

/**
 * Avoid losing focus after button click
 * @param e
 */
function handleMouseDown(e: React.MouseEvent) {
  e.preventDefault();
}

/**
 * Return selected dom node in the current selected table cells
 * This node uses for calculation of bounding box around selected text.
 *
 * @param editor - The editor instance
 * @returns
 */
const getSelectedNode = (editor: Editor): HTMLElement | undefined => {
  if (!editor || !editor.view.state.selection.ranges?.length) return undefined;

  const node = editor.view.domAtPos(editor.view.state.selection.anchor)?.node;

  if (!node) return undefined;

  // If it is a text leaf node, return its parent node
  if (node.nodeType === Node.TEXT_NODE) return node.parentElement ?? undefined;

  // Search first text node in giving selected node, fallback to itself if not found
  const targetNode = node.parentElement?.querySelector('span') ?? node;

  return targetNode as HTMLElement;
};

export const TableWidgetToolbarMenu = ({
  editor,
  dispatchUpdateWidget,
  widgetState,
}: TableWidgetToolbarMenuProps): ReactElement => {
  const debounceDispatchUpdateWidget = useDebouncedCallback(dispatchUpdateWidget, 200);
  const textStyle = editor?.getAttributes('textStyle');

  // Get node attributes based on tag type
  const nodeAttributes = editor?.state && getNodeAttributes(editor.state, TextWidgetTag.Paragraph);
  const cellAttributes = editor?.state && getNodeAttributes(editor.state, 'tableCell');
  const headerAttributes = editor?.state && getNodeAttributes(editor.state, 'tableHeader');
  const isBold = !!editor?.isActive('bold');
  const isItalic = !!editor?.isActive('italic');
  const isUnderline = !!editor?.isActive('underline');
  const fontFamily = textStyle?.fontFamily;
  const fontSize = String(parseInt(textStyle?.fontSize) ?? '');
  const fontColor = textStyle?.color;
  const textAlign = nodeAttributes?.textAlign;
  const verticalAlignment = cellAttributes?.verticalAlignment;
  const lineHeight = nodeAttributes?.lineHeight;
  const isLink = !!editor?.isActive('link');
  const link = editor?.getAttributes('link')?.href || '';

  const $from = editor.view.state.selection.$from;
  let parentList: ProseMirrorNode = $from.node($from.depth);
  for (let depth = $from.depth - 1; depth >= 1 && parentList && !isList(editor, parentList); depth--) {
    parentList = $from.node(depth);
  }

  const isOrderedList = parentList?.type === editor.schema.nodes.orderedList;
  const isUnOrderedList = parentList?.type === editor.schema.nodes.bulletList;
  const cellBorderColor = cellAttributes?.borderColor;
  const headerBorderColor = headerAttributes?.borderColor;
  const cellBorderWidth = cellAttributes?.borderWidth;
  const headerBorderWidth = headerAttributes?.borderWidth;
  const cellColor = cellAttributes?.backgroundColor;
  const headerColor = headerAttributes?.backgroundColor;
  const textStyleForColorChecker = useMemo(
    () => ({
      fontFamily: fontFamily ?? '',
      fontSize,
      fontWeight: isBold ? 'bold' : 'normal',
    }),
    [fontFamily, fontSize, isBold],
  );
  const node = getSelectedNode(editor);
  const targetRectForColorChecker = node?.getBoundingClientRect();

  const onSetBorderColor = useCallback(
    (color: string) => {
      const { cellPositions } = getTableData(editor.view.state.doc);
      // TODO: current color picker mousedown has side effect on text focus, need to improve later on
      editor
        .chain()
        .setCellSelection({ anchorCell: cellPositions[0], headCell: cellPositions[cellPositions.length - 1] })
        .setCellAttribute('borderColor', color)
        .updateAttributes('tableHeader', { borderColor: color })
        .run();
      dispatchUpdateWidget();
    },
    [editor, dispatchUpdateWidget],
  );

  const onSetBorderWidth = useCallback(
    (e: React.FormEvent<HTMLSelectElement>) => {
      const target = e.target as HTMLSelectElement;
      const width = target.value;
      const { cellPositions } = getTableData(editor.view.state.doc);
      // TODO: current color picker mousedown has side effect on text focus, need to improve later on
      editor
        .chain()
        .setCellSelection({ anchorCell: cellPositions[0], headCell: cellPositions[cellPositions.length - 1] })
        .setCellAttribute('borderWidth', width)
        .updateAttributes('tableHeader', { borderWidth: width })
        .run();
      dispatchUpdateWidget();
    },
    [editor, dispatchUpdateWidget],
  );

  const onSetCellColor = useCallback(
    (color: string) => {
      // TODO: current color picker mousedown has side effect on text focus, need to improve later on
      editor
        .chain()
        .setCellAttribute('backgroundColor', color)
        .updateAttributes('tableHeader', { backgroundColor: color })
        .run();
      dispatchUpdateWidget();
    },
    [editor, dispatchUpdateWidget],
  );

  const onSetBold = useCallback(() => {
    editor.chain().focus().toggleBold().run();
    dispatchUpdateWidget();
  }, [editor, dispatchUpdateWidget]);

  const onSetItalic = useCallback(() => {
    editor.chain().focus().toggleItalic().run();
    dispatchUpdateWidget();
  }, [editor, dispatchUpdateWidget]);

  const onSetUnderline = useCallback(() => {
    editor.chain().focus().toggleUnderline().run();
    dispatchUpdateWidget();
  }, [editor, dispatchUpdateWidget]);

  const onSetFontFamily = useCallback(
    (fontFamily: string) => {
      if (!fontFamily) return;
      editor.chain().focus().setFontFamily(fontFamily).run();
      dispatchUpdateWidget();
    },
    [editor, dispatchUpdateWidget],
  );

  const onSetFontColor = useCallback(
    (color: string) => {
      // TODO: current color picker mousedown has side effect on text focus, need to improve later on
      editor.chain().setColor(color).run();
      debounceDispatchUpdateWidget();
    },
    [editor, debounceDispatchUpdateWidget],
  );

  const onSetFontSize = useCallback(
    (e: React.FormEvent<HTMLSelectElement>) => {
      const target = e.target as HTMLSelectElement;
      const fontSize = target.value;
      if (!fontSize) return;

      editor.chain().focus().setFontSize(`${fontSize}px`).run();
      dispatchUpdateWidget();
    },
    [editor, dispatchUpdateWidget],
  );

  const onSetTextAlign = useCallback(
    (e: React.FormEvent<HTMLSelectElement>) => {
      const target = e.target as HTMLSelectElement;
      const textAlign = target.value;
      if (!textAlign) return;

      editor.chain().focus().updateAttributes('paragraph', { textAlign }).run();
      dispatchUpdateWidget();
    },
    [editor, dispatchUpdateWidget],
  );

  const onSetVerticalAlignment = useCallback(
    (e: React.FormEvent<HTMLSelectElement>) => {
      const { value: verticalAlignment } = e.target as HTMLSelectElement;

      if (!verticalAlignment) return;

      editor
        .chain()
        .setCellAttribute('verticalAlignment', verticalAlignment)
        .updateAttributes('tableHeader', { verticalAlignment })
        .run();
      dispatchUpdateWidget();
    },
    [editor, dispatchUpdateWidget],
  );

  const onSetLineHeight = useCallback(
    (e: React.FormEvent<HTMLSelectElement>) => {
      const target = e.target as HTMLSelectElement;
      const lineHeight = target.value;
      if (!lineHeight) return;

      editor.chain().focus().updateAttributes('paragraph', { lineHeight }).run();
      dispatchUpdateWidget();
    },
    [editor, dispatchUpdateWidget],
  );

  const onSetLink = useCallback(() => {
    const url = window.prompt('URL', link);
    if (url === null) return;

    if (url === '') {
      editor.chain().focus().extendMarkRange('link').unsetLink().run();
      return;
    }

    // Set link with protocol
    const fullUrl = withProtocol(url);
    if (isValidUrl(fullUrl)) {
      editor.chain().focus().extendMarkRange('link').setLink({ href: fullUrl }).run();
    }
  }, [editor, link]);

  const onToggleOrderedList = useCallback(() => {
    const NUMBERED_LIST_TYPE = editor.schema.nodes.orderedList;
    toggleList(editor, NUMBERED_LIST_TYPE);
    dispatchUpdateWidget();
  }, [editor, dispatchUpdateWidget]);

  const onToggleBulletedList = useCallback(() => {
    const BULLETED_LIST_TYPE = editor.schema.nodes.bulletList;
    toggleList(editor, BULLETED_LIST_TYPE);
    dispatchUpdateWidget();
  }, [editor, dispatchUpdateWidget]);

  const insertRowBelow = useCallback(() => {
    editor.chain().focus().addRowAfter().updateRowAttrsBelow().updateAllCellBorderStyle().run();
    dispatchUpdateWidget();
  }, [editor, dispatchUpdateWidget]);

  const insertRowAbove = useCallback(() => {
    editor.chain().focus().addRowBefore().updateRowAttrsAbove().updateAllCellBorderStyle().run();
    dispatchUpdateWidget();
  }, [editor, dispatchUpdateWidget]);

  const insertColumnRight = useCallback(() => {
    editor.chain().focus().addColumnAfter().updateColumnAttrsRight().updateAllCellBorderStyle().run();
    dispatchUpdateWidget();
  }, [editor, dispatchUpdateWidget]);

  const insertColumnLeft = useCallback(() => {
    editor.chain().focus().addColumnBefore().updateColumnAttrsLeft().updateAllCellBorderStyle().run();
    dispatchUpdateWidget();
  }, [editor, dispatchUpdateWidget]);

  const deleteRow = useCallback(() => {
    editor.chain().focus().deleteRow().run();
    dispatchUpdateWidget();
  }, [editor, dispatchUpdateWidget]);

  const deleteColumn = useCallback(() => {
    editor.chain().focus().deleteColumn().run();
    dispatchUpdateWidget();
  }, [editor, dispatchUpdateWidget]);

  // stop click events from propagation to the text widget itself
  const onClick = (e: React.MouseEvent<HTMLDivElement>) => e.stopPropagation();

  if (widgetState === WidgetState.Active)
    return (
      <Flex onClick={onClick} mr='8px' gap='8px' align='center'>
        <ColorPicker
          iconStyle='border'
          color={(cellBorderColor || headerBorderColor) ?? ''}
          label='Border color'
          onChange={onSetBorderColor}
          showNoColorOption={true}
          showNoColorChecker={true}
        />
        <Tooltip hasArrow placement='bottom' label='Border Width' bg='black'>
          <Select
            onChange={onSetBorderWidth}
            value={(cellBorderWidth || headerBorderWidth) ?? ''}
            data-testid='tablewidget-border-width'
            width='80px'
            size='sm'
            aria-label='Border Width'
            borderColor='outline.gray'
          >
            <option value=''>width</option>
            {BORDER_WIDTHS.map((v) => (
              <option key={`borderWidth-${v}`} value={v}>
                {v}
              </option>
            ))}
          </Select>
        </Tooltip>
        <ToolbarDivider />
        <HeaderOption editor={editor} onUpdate={dispatchUpdateWidget} />
      </Flex>
    );
  return (
    <Flex onClick={onClick} mr='8px' gap='8px' align='center'>
      <ColorPicker
        iconStyle='fill'
        color={(cellColor || headerColor) ?? ''}
        label='Cell color'
        onChange={onSetCellColor}
        showNoColorOption={true}
        showNoColorChecker={true}
      />
      <ColorPicker
        iconStyle='text'
        color={fontColor ?? ''}
        label='Font color'
        onChange={onSetFontColor}
        showNoColorOption={false}
        colorChecker={
          <SingleColorContrastChecker
            color={fontColor ?? ''}
            textStyle={textStyleForColorChecker}
            targetRect={targetRectForColorChecker}
          />
        }
      />
      <FontFamilySelect fontFamily={fontFamily} onChange={onSetFontFamily} borderRadius='sm' />
      <FontSizeSelect
        onChange={onSetFontSize}
        value={fontSize ?? ''}
        data-testid='textwidget-fontsize-select'
        aria-label='Font Size'
      />
      <ToolbarDivider />
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
      <ToolbarDivider />
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
      <VerticalAlignmentSelect verticalAlignment={verticalAlignment} onChange={onSetVerticalAlignment} />
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
      <Tooltip hasArrow placement='bottom' label='Bullet List' bg='black'>
        <IconButton
          isActive={isUnOrderedList}
          onClick={onToggleBulletedList}
          onMouseDown={handleMouseDown}
          size='sm'
          aria-label='Bullet List'
          icon={<UnOrderedListIcon />}
          variant='icon-btn-toolbar'
        />
      </Tooltip>
      <Tooltip hasArrow placement='bottom' label='Numbered List' bg='black'>
        <IconButton
          isActive={isOrderedList}
          onClick={onToggleOrderedList}
          onMouseDown={handleMouseDown}
          size='sm'
          aria-label='Numbered List'
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
      <ToolbarDivider />
      <Tooltip hasArrow placement='bottom' label='Insert Row Below' bg='black'>
        <IconButton
          isActive={false}
          onClick={insertRowBelow}
          onMouseDown={handleMouseDown}
          size='sm'
          aria-label='Insert Row Below'
          icon={<InsertRowBelowIcon />}
          variant='icon-btn-toolbar'
        />
      </Tooltip>
      <Tooltip hasArrow placement='bottom' label='Insert Row Above' bg='black'>
        <IconButton
          isActive={false}
          onClick={insertRowAbove}
          onMouseDown={handleMouseDown}
          size='sm'
          aria-label='Insert Row Above'
          icon={<InsertRowAboveIcon />}
          variant='icon-btn-toolbar'
        />
      </Tooltip>
      <Tooltip hasArrow placement='bottom' label='Insert Column Right' bg='black'>
        <IconButton
          isActive={false}
          onClick={insertColumnRight}
          onMouseDown={handleMouseDown}
          size='sm'
          aria-label='Insert Column Right'
          icon={<InsertColumnRightIcon />}
          variant='icon-btn-toolbar'
        />
      </Tooltip>
      <Tooltip hasArrow placement='bottom' label='Insert Column Left' bg='black'>
        <IconButton
          isActive={false}
          onClick={insertColumnLeft}
          onMouseDown={handleMouseDown}
          size='sm'
          aria-label='Insert Column Left'
          icon={<InsertColumnLeftIcon />}
          variant='icon-btn-toolbar'
        />
      </Tooltip>
      <ToolbarDivider />
      <Tooltip hasArrow placement='bottom' label='Delete Row' bg='black'>
        <Button
          isActive={false}
          onClick={deleteRow}
          onMouseDown={handleMouseDown}
          size='sm'
          aria-label='Delete Row'
          variant='icon-btn-toolbar-option'
          leftIcon={<TrashIcon />}
        >
          <Text as='span' fontWeight='normal' fontSize='14px' maxW='240' noOfLines={1}>
            Row
          </Text>
        </Button>
      </Tooltip>

      <Tooltip hasArrow placement='bottom' label='Delete Column' bg='black'>
        <Button
          isActive={false}
          onClick={deleteColumn}
          onMouseDown={handleMouseDown}
          size='sm'
          aria-label='Delete Column'
          leftIcon={<TrashIcon />}
          variant='icon-btn-toolbar-option'
        >
          <Text as='span' fontWeight='normal' fontSize='14px' maxW='240' noOfLines={1}>
            Column
          </Text>
        </Button>
      </Tooltip>
    </Flex>
  );
};
