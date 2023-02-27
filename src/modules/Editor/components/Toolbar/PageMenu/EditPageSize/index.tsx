import { ReactElement, useRef, ComponentProps } from 'react';
import {
  Button,
  Center,
  Flex,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverContent,
  PopoverHeader,
  PopoverTrigger,
  Text,
} from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import { PaperTypeSelect } from './PaperTypeSelect';
import { PapeSizeUnitSelect } from './PageSizeUnitSelect';
import { PageOrientation } from './PageOrientation';
import { PageHeightInput, PageWidthInput } from './PageSizeInput';
import { usePageSizeControl } from './hooks';
import { PAGE_SIZE_CONTENT_WIDTH } from './config';

const Separator = ({ symbol = 'x', ...props }: { symbol?: string } & ComponentProps<typeof Center>) => {
  return (
    <Center fontSize='lg' {...props}>
      {symbol}
    </Center>
  );
};

const EditPageSize = (): ReactElement => {
  const focusRef = useRef(null);
  const { t } = useTranslation('editor_toolbar_page_menu', { useSuspense: false });
  const {
    widthPx,
    heightPx,
    paperType,
    orientation,
    unit,
    handlePaperTypeChange,
    handleOriengtationChange,
    handleUnitChange,
  } = usePageSizeControl();

  return (
    <Popover initialFocusRef={focusRef} placement='bottom-start' closeOnBlur closeOnEsc>
      <PopoverTrigger>
        <Button size='sm' variant='ghost' fontWeight='semibold'>
          {t('pageSize.editButton')}
        </Button>
      </PopoverTrigger>
      <PopoverContent bg='white' w={PAGE_SIZE_CONTENT_WIDTH} p='1' data-testid='page-menu-resize-content'>
        <PopoverHeader fontSize='sm' fontWeight='600' border='0'>
          {t('pageSize.title')}
        </PopoverHeader>
        <PopoverArrow />
        <PopoverBody>
          <Flex direction='column' gap='3'>
            <PaperTypeSelect value={paperType} onChange={handlePaperTypeChange} />
            <Text fontSize='sm' fontWeight='600'>
              {t('pageSize.customTitle')}
            </Text>
            <Flex direction='row' gap='2'>
              <PageWidthInput value={widthPx} unit={unit} />
              <Separator mt='6' />
              <PageHeightInput value={heightPx} unit={unit} />
              <PapeSizeUnitSelect value={unit} onChange={handleUnitChange} />
            </Flex>
            <PageOrientation orientation={orientation} onChange={handleOriengtationChange} />
          </Flex>
        </PopoverBody>
      </PopoverContent>
    </Popover>
  );
};

export default EditPageSize;
