import { ReactElement, Suspense, useMemo, useEffect, useCallback } from 'react';
import {
  Box,
  Drawer,
  DrawerOverlay,
  DrawerContent,
  DrawerHeader,
  DrawerBody,
  Text,
  Flex,
  IconButton,
  useDisclosure,
} from '@chakra-ui/react';

import { getNodeAttributes } from '@tiptap/core';
import { Editor } from '@tiptap/react';

import { TEXT_TAG_EDITED } from 'constants/mixpanel';

import { useWindowSize } from 'hooks/useWindowSize';
import { useDebouncedCallback } from 'hooks/useDebounce';

import { Mixpanel } from 'libs/third-party/Mixpanel/mixpanel';

import { ColorPickerInContext } from 'modules/Editor/components/ColorPicker';
import { TEXT_WIDGET_TAG_OPTIONS } from 'modules/Editor/components/AccessibilityManager/AccessibilityChecker/HeadingChecker/AutoCheckPanel/InvalidWidgetItem';

import { isValidUrl, withProtocol } from 'utils/url';

import { useWidget, useEditor } from 'widgets/sdk';

import { TextWidgetTag } from '../../common/TextBasedWidgets.types';
// import FontFamilySelectMenu from '../../common/toolbar/FontFamilySelect/FontFamilySelectMenu';
import FontFamilySelectMenu from 'modules/common/components/FontFamilySelect/FontFamilySelectMenu';

import { TextWidgetData } from '../TextWidget.types';

import { TextWidgetTagOptionMobile } from './mobile/TextWidgetTagOptionMobile';
import { TextWidgetLineHeightOptionMobile } from './mobile/TextWidgetLineHeightOptionMobile';
import { TextWidgetAlignmentOptionMobile } from './mobile/TextWidgetAlignmentOptionMobile';
import { TextWidgetFontSizeOptionMobile } from './mobile/TextWidgetFontSizeOptionMobile';

import { ReactComponent as FontFamilyIcon } from 'assets/icons/a11ymenu_text.svg';
import { ReactComponent as FontColorPickerIcon } from 'assets/icons/text_color_picker.svg';
import { ReactComponent as BoldIcon } from 'assets/icons/bold.svg';
import { ReactComponent as ItalicIcon } from 'assets/icons/italic.svg';
import { ReactComponent as UnderlineIcon } from 'assets/icons/underline.svg';
import { ReactComponent as LinkIcon } from 'assets/icons/link.svg';
import { ReactComponent as TagIcon } from 'assets/icons/tag.svg';
import { ReactComponent as CloseIcon } from 'assets/icons/close_circle.svg';

interface TextWidgetToolbarMenuProps {
  editor: Editor;
  dispatchUpdateWidget: (options?: Partial<TextWidgetData>) => void;
}

/**
 * Avoid losing focus after button click
 * @param e
 */
function handleMouseDown(e: React.MouseEvent) {
  e.preventDefault();
}

export const TextWidgetToolbarMenuMobile = ({
  editor,
  dispatchUpdateWidget,
}: TextWidgetToolbarMenuProps): ReactElement => {
  const { textTag } = useWidget<TextWidgetData>();
  const { setWidgetToolbarState } = useEditor();
  const { deviceWidth } = useWindowSize();
  const debounceDispatchUpdateWidget = useDebouncedCallback(dispatchUpdateWidget, 200);

  const { isOpen: isSelectFontOpen, onToggle: toggleSelectFont } = useDisclosure();
  const { isOpen: isColorPickerOpen, onToggle: toggleColorPicker } = useDisclosure();
  const { isOpen: isTagPickerOpen, onToggle: toggleTagPicker } = useDisclosure();
  const { isOpen: isLineHeightOpen, onToggle: toggleLineHeight } = useDisclosure();
  const { isOpen: isTextAlignOpen, onToggle: toggleTextAlign } = useDisclosure();
  const { isOpen: isFontSizeOpen, onToggle: toggleFontSize } = useDisclosure();

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

  const textStyle = editor?.getAttributes('textStyle');
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
    (e: string) => {
      const fontSize = e;
      if (!fontSize) return;

      editor.chain().focus().setFontSize(`${fontSize}px`).run();
      dispatchUpdateWidget();
    },
    [editor, dispatchUpdateWidget],
  );

  const onSetTextAlign = useCallback(
    (e: string) => {
      const textAlign = e;
      if (!textAlign) return;

      editor.chain().focus().setTextAlign(textAlign).run();
      dispatchUpdateWidget();
    },
    [editor, dispatchUpdateWidget],
  );

  const onSetLineHeight = useCallback(
    (e: string) => {
      const lineHeight = e;
      if (!lineHeight) return;

      editor.chain().focus().setLineHeight(lineHeight).run();
      dispatchUpdateWidget();
    },
    [editor, dispatchUpdateWidget],
  );

  const onSetOrderedList = useCallback(() => {
    // Toggle list ON will convert widget to <p/>
    if (!editor.isActive('orderedList') && textTag !== TextWidgetTag.Paragraph) {
      onSetTextTag(TextWidgetTag.Paragraph);
    }
    editor.chain().focus().toggleOrderedList().run();

    dispatchUpdateWidget();
  }, [editor, dispatchUpdateWidget, onSetTextTag, textTag]);

  const onSetUnorderedList = useCallback(() => {
    // Toggle list ON will convert widget to <p/>
    if (!editor.isActive('bulletList') && textTag !== TextWidgetTag.Paragraph) {
      onSetTextTag(TextWidgetTag.Paragraph);
    }
    editor.chain().focus().toggleBulletList().run();

    dispatchUpdateWidget();
  }, [editor, dispatchUpdateWidget, onSetTextTag, textTag]);

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

  const renderBottomWidgetComponents = () => {
    return (
      <Flex justify='flex-start'>
        <Box
          onClick={toggleSelectFont}
          mr='5px'
          p='10px 10px'
          as='div'
          style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}
        >
          <IconButton mb='10px' size='sm' aria-label='Font Icon' icon={<FontFamilyIcon />} />
          <Box w='75px' as='div'>
            <Text fontSize={10} style={{ fontWeight: 700 }} align='center'>
              Font
            </Text>
          </Box>
        </Box>

        <Box //
          onClick={() => toggleFontSize()}
          mr='5px'
          p='10px 10px'
          as='div'
          style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}
        >
          <IconButton mb='10px' size='sm' aria-label='Font Size' icon={<BoldIcon />} />
          <Box w='75px' as='div'>
            <Text fontSize={10} style={{ fontWeight: 700 }} align='center'>
              Font Size
            </Text>
          </Box>
        </Box>

        <Box
          onClick={() => toggleColorPicker()}
          mr='5px'
          p='10px 10px'
          as='div'
          style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}
        >
          <IconButton mb='10px' size='sm' aria-label='Bold Icon' icon={<FontColorPickerIcon />} />
          <Box w='75px' as='div'>
            <Text fontSize={10} style={{ fontWeight: 700 }} align='center'>
              Color
            </Text>
          </Box>
        </Box>

        <Box mr='5px' p='10px 10px' as='div' style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <IconButton
            mb='10px'
            isActive={isBold}
            onClick={onSetBold}
            onMouseDown={handleMouseDown}
            size='sm'
            aria-label='Bold Icon'
            icon={<BoldIcon />}
          />
          <Box w='75px' as='div'>
            <Text fontSize={10} style={{ fontWeight: 700 }} align='center'>
              Font Weight
            </Text>
          </Box>
        </Box>

        <Box mr='5px' p='10px 10px' as='div' style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <IconButton
            mb='10px'
            isActive={isItalic}
            onClick={onSetItalic}
            onMouseDown={handleMouseDown}
            size='sm'
            aria-label='Italic Icon'
            icon={<ItalicIcon />}
          />
          <Box w='75px' as='div'>
            <Text fontSize={10} style={{ fontWeight: 700 }} align='center'>
              Font Italics
            </Text>
          </Box>
        </Box>

        <Box mr='5px' p='10px 10px' as='div' style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <IconButton
            mb='10px'
            isActive={isUnderline}
            onClick={onSetUnderline}
            onMouseDown={handleMouseDown}
            size='sm'
            aria-label='Underline Icon'
            icon={<UnderlineIcon />}
          />
          <Box w='75px' as='div'>
            <Text fontSize={10} style={{ fontWeight: 700 }} align='center'>
              Underline
            </Text>
          </Box>
        </Box>

        <Box //
          onClick={() => toggleTextAlign()}
          mr='5px'
          p='10px 10px'
          as='div'
          style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}
        >
          <IconButton mb='10px' size='sm' aria-label='Text Align' icon={<BoldIcon />} />
          <Box w='75px' as='div'>
            <Text fontSize={10} style={{ fontWeight: 700 }} align='center'>
              Alignment
            </Text>
          </Box>
        </Box>

        <Box //
          onClick={() => toggleLineHeight()}
          mr='5px'
          p='10px 10px'
          as='div'
          style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}
        >
          <IconButton
            mb='10px'
            isActive={isBold}
            onClick={onSetBold}
            onMouseDown={handleMouseDown}
            size='sm'
            aria-label='Bold Icon'
            icon={<BoldIcon />}
          />
          <Box w='75px' as='div'>
            <Text fontSize={10} style={{ fontWeight: 700 }} align='center'>
              Line Height
            </Text>
          </Box>
        </Box>

        <Box mr='5px' p='10px 10px' as='div' style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <IconButton
            mb='10px'
            isActive={isOrderedList}
            onClick={onSetOrderedList}
            onMouseDown={handleMouseDown}
            size='sm'
            aria-label='Order List'
            icon={<>OL</>}
          />
          <Box w='75px' as='div'>
            <Text fontSize={10} style={{ fontWeight: 700 }} align='center'>
              Num List
            </Text>
          </Box>
        </Box>

        <Box mr='5px' p='10px 10px' as='div' style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <IconButton
            mb='10px'
            isActive={isUnOrderedList}
            onClick={onSetUnorderedList}
            onMouseDown={handleMouseDown}
            size='sm'
            aria-label='Unordered List'
            icon={<>UL</>}
          />
          <Box w='75px' as='div'>
            <Text fontSize={10} style={{ fontWeight: 700 }} align='center'>
              Bull List
            </Text>
          </Box>
        </Box>

        <Box mr='5px' p='10px 10px' as='div' style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <IconButton
            mb='10px'
            isActive={isLink}
            onClick={onSetLink}
            onMouseDown={handleMouseDown}
            size='sm'
            aria-label='Link'
            icon={<LinkIcon />}
          />
          <Box w='75px' as='div'>
            <Text fontSize={10} style={{ fontWeight: 700 }} align='center'>
              Link
            </Text>
          </Box>
        </Box>

        <Box //
          onClick={() => toggleTagPicker()}
          mr='5px'
          p='10px 10px'
          as='div'
          style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}
        >
          <IconButton mb='10px' size='sm' aria-label='Tag Icon' icon={<TagIcon />} />
          <Box w='75px' as='div'>
            <Text fontSize={10} style={{ fontWeight: 700 }} align='center'>
              Text Tag
            </Text>
          </Box>
        </Box>
      </Flex>
    );
  };

  return (
    <>
      <Flex onClick={onClick} w={deviceWidth - 15} p='10px' gap='8px' align='center'>
        {renderBottomWidgetComponents()}
      </Flex>

      <Drawer placement='bottom' onClose={toggleSelectFont} isOpen={isSelectFontOpen}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerHeader borderBottomWidth='1px'>
            <Flex align='center' justify='space-between'>
              <p>Select Font</p>
              <CloseIcon onClick={toggleSelectFont} />
            </Flex>
          </DrawerHeader>
          <DrawerBody>
            <Suspense fallback={<Box />}>
              <FontFamilySelectMenu
                heading='Heading'
                label='Select Font'
                onClose={toggleSelectFont}
                onChange={onSetFontFamily}
                fontFamily={fontFamily}
              />
            </Suspense>
          </DrawerBody>
        </DrawerContent>
      </Drawer>

      <Drawer placement='bottom' onClose={toggleTagPicker} isOpen={isTagPickerOpen}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerHeader borderBottomWidth='1px'>
            <Flex align='center' justify='space-between'>
              <p>Text Tag</p>
              <CloseIcon onClick={toggleTagPicker} />
            </Flex>
          </DrawerHeader>
          <DrawerBody>
            <Suspense fallback={<Box />}>
              <TextWidgetTagOptionMobile selectedTag={textTag || TextWidgetTag.Paragraph} onChange={onSetTextTag} />
            </Suspense>
          </DrawerBody>
        </DrawerContent>
      </Drawer>

      <Drawer placement='bottom' onClose={toggleColorPicker} isOpen={isColorPickerOpen}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerHeader borderBottomWidth='1px'>
            <Flex align='center' justify='space-between'>
              <p>Font Color</p>
              <CloseIcon onClick={toggleColorPicker} />
            </Flex>
          </DrawerHeader>
          <DrawerBody>
            <Suspense fallback={<Box />}>
              <ColorPickerInContext
                iconStyle='text'
                color={color ?? ''}
                label='Font color'
                onChange={onSetFontColor}
                showNoColorOption={false}
              />
            </Suspense>
          </DrawerBody>
        </DrawerContent>
      </Drawer>

      <Drawer placement='bottom' onClose={toggleLineHeight} isOpen={isLineHeightOpen}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerHeader borderBottomWidth='1px'>
            <Flex align='center' justify='space-between'>
              <p>Line Height</p>
              <CloseIcon onClick={toggleLineHeight} />
            </Flex>
          </DrawerHeader>
          <DrawerBody h={'50%'}>
            <Suspense fallback={<Box />}>
              <TextWidgetLineHeightOptionMobile selectedTag={lineHeight} onChange={onSetLineHeight} />
            </Suspense>
          </DrawerBody>
        </DrawerContent>
      </Drawer>

      <Drawer placement='bottom' onClose={toggleTextAlign} isOpen={isTextAlignOpen}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerHeader borderBottomWidth='1px'>
            <Flex align='center' justify='space-between'>
              <p>Text Alignment</p>
              <CloseIcon onClick={toggleTextAlign} />
            </Flex>
          </DrawerHeader>
          <DrawerBody h={'50%'}>
            <Suspense fallback={<Box />}>
              <TextWidgetAlignmentOptionMobile selectedTag={textAlign} onChange={onSetTextAlign} />
            </Suspense>
          </DrawerBody>
        </DrawerContent>
      </Drawer>

      <Drawer placement='bottom' onClose={toggleFontSize} isOpen={isFontSizeOpen}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerHeader borderBottomWidth='1px'>
            <Flex align='center' justify='space-between'>
              <p>Font Size</p>
              <CloseIcon onClick={toggleFontSize} />
            </Flex>
          </DrawerHeader>
          <DrawerBody>
            <Suspense fallback={<Box />}>
              <TextWidgetFontSizeOptionMobile selectedTag={+fontSize} onChange={onSetFontSize} />
            </Suspense>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
};