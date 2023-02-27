import { Suspense } from 'react';
import { Editor } from '@tiptap/core';
import {
  Box,
  Popover,
  PopoverTrigger,
  PopoverContent,
  Tooltip,
  Switch,
  useDisclosure,
  useBoolean,
  IconButton,
  Text,
} from '@chakra-ui/react';
import { ReactComponent as Headers } from '../../../../../assets/icons/headers.svg';
import { ReactComponent as HeaderRow } from '../../../../../assets/icons/header_row.svg';
import { ReactComponent as HeaderColumn } from '../../../../../assets/icons/header_column.svg';
import { getTableData } from '../../../TableWidget/TableWidget.helpers';
import { Mixpanel } from '../../../../../libs/third-party/Mixpanel/mixpanel';
import { TABLE_HEADER_EDITED } from '../../../../../constants/mixpanel';

type HeaderOptionProps = {
  editor: Editor;
  onUpdate: () => void;
};

/**
 * Avoid losing focus after button click
 * @param e
 */
function handleMouseDown(e: React.MouseEvent) {
  e.preventDefault();
}

const getHeaderInfo = (editor: Editor) => {
  const { cellPositions, numRows } = getTableData(editor.view.state.doc);
  const firstCell = editor.state.doc.nodeAt(cellPositions[0]);

  let isHeaderRow = false,
    isHeaderColumn = false;

  if (cellPositions.length > 1) {
    const secondCell = editor.state.doc.nodeAt(cellPositions[1]);

    if (numRows > 1) {
      const numCols = cellPositions.length / numRows;
      const firstCellSecondRow = editor.state.doc.nodeAt(cellPositions[numCols]);
      isHeaderColumn = firstCell?.type.name === 'tableHeader' && firstCellSecondRow?.type.name === 'tableHeader';
    } else {
      isHeaderColumn = firstCell?.type.name === 'tableHeader';
    }

    isHeaderRow = firstCell?.type.name === 'tableHeader' && secondCell?.type.name === 'tableHeader';
  }

  return {
    isHeaderRow,
    isHeaderColumn,
  };
};

export const HeaderOption = ({ editor, onUpdate }: HeaderOptionProps) => {
  const { isOpen, onToggle, onClose } = useDisclosure();
  const [isHover, setIsHover] = useBoolean();
  const [shouldReturnFocus, setShouldReturnFocus] = useBoolean(true);
  const stopPropagation = (e: React.KeyboardEvent) => e.stopPropagation();
  const onTriggerClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    setShouldReturnFocus.on();
    onToggle();
  };

  const { isHeaderRow, isHeaderColumn } = getHeaderInfo(editor);

  const toggleHeaderRow = () => {
    editor.chain().focus().toggleHeaderRow().run();
    onUpdate();

    Mixpanel.track(TABLE_HEADER_EDITED, {
      header_type: 'Row',
      number_of_headers: isHeaderRow ? 0 : 1,
    });
  };

  const toggleHeaderColumn = () => {
    editor.chain().focus().toggleHeaderColumn().run();
    onUpdate();

    Mixpanel.track(TABLE_HEADER_EDITED, {
      header_type: 'Column',
      number_of_headers: isHeaderColumn ? 0 : 1,
    });
  };

  return (
    <Tooltip isOpen={!isOpen && isHover} hasArrow placement='bottom' label='Headers' bg='black'>
      <Box onKeyDown={stopPropagation}>
        <Popover
          isOpen={isOpen}
          onClose={onClose}
          modifiers={[{ name: 'eventListeners', options: { scroll: false } }]}
          returnFocusOnClose={shouldReturnFocus}
          placement='bottom-start'
          isLazy
        >
          <PopoverTrigger>
            <IconButton
              onMouseEnter={setIsHover.on}
              onMouseLeave={setIsHover.off}
              onClick={onTriggerClick}
              isActive={false}
              onMouseDown={handleMouseDown}
              size='sm'
              aria-label='Toggle Header Option'
              icon={<Headers />}
              bg={'white'}
            />
          </PopoverTrigger>
          <Box zIndex={'var(--vg-zIndices-fontMenu)'}>
            <PopoverContent w='200px'>
              <Suspense fallback={<Box />}>
                <Box p={'16px'} gap={'8px'} display={'grid'} gridRowGap={'8px'}>
                  <Box display={'grid'} gridTemplateColumns={'auto 34px'}>
                    <Box p={'4px'} display={'grid'} gridTemplateColumns={'20px auto'}>
                      <HeaderRow style={{ alignSelf: 'center' }} />
                      <Text fontSize={'xs'} pl={'10px'}>
                        Header Row
                      </Text>
                    </Box>
                    <Switch
                      aria-label='Toggle Header Row'
                      alignSelf={'center'}
                      size='md'
                      isChecked={isHeaderRow}
                      onChange={toggleHeaderRow}
                    />
                  </Box>
                  <Box display={'grid'} gridTemplateColumns={'auto 34px'}>
                    <Box p={'4px'} display={'grid'} gridTemplateColumns={'20px auto'}>
                      <HeaderColumn style={{ alignSelf: 'center' }} />
                      <Text fontSize={'xs'} pl={'10px'}>
                        Header Column
                      </Text>
                    </Box>
                    <Switch
                      aria-label='Toggle Header Column'
                      alignSelf={'center'}
                      size='md'
                      isChecked={isHeaderColumn}
                      onChange={toggleHeaderColumn}
                    />
                  </Box>
                </Box>
              </Suspense>
            </PopoverContent>
          </Box>
        </Popover>
      </Box>
    </Tooltip>
  );
};
