import { memo, lazy, Suspense } from 'react';
import {
  Box,
  Button,
  Popover,
  PopoverTrigger,
  PopoverContent,
  useDisclosure,
  useBoolean,
  Tooltip,
  ButtonProps,
} from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';

import { ReactComponent as ChevronDown } from 'assets/icons/chevron_down.svg';

// Font images in the dropdown are kept as base64 strings in memory
// -> code split to keep separate from the main bundle
const FontFamilySelectMenu = lazy(
  () =>
    import(
      /* webpackChunkName: "FontFamilySelectMenu" */
      /* webpackPrefetch: true */
      './FontFamilySelectMenu'
    ),
);

type FontFamilySelectProps = {
  fontFamily: string;
  onChange: (fontFamily: string) => void;
  borderRadius?: string | number;
  width?: string;
  buttonProps?: ButtonProps;
};

export const FontFamilySelect = memo(
  ({ onChange, fontFamily, borderRadius = 'base', width = '6rem', buttonProps }: FontFamilySelectProps) => {
    const { isOpen, onToggle, onClose } = useDisclosure();
    const [shouldReturnFocus, setShouldReturnFocus] = useBoolean(true);
    const [isHover, setIsHover] = useBoolean();

    const { t } = useTranslation('editor_toolbar');

    const heading = t('fontFamily.heading');
    const label = t('fontFamily.label');
    const testId = 'font-family-dropdown-trigger';

    const onSetFont = (fontFamily: string) => {
      setShouldReturnFocus.off();
      onChange(fontFamily);
      onClose();
    };

    const onTriggerClick = (e: React.MouseEvent<HTMLButtonElement>) => {
      setShouldReturnFocus.on();
      onToggle();
    };

    // prevent widget / global keyboard events
    const stopPropagation = (e: React.KeyboardEvent) => e.stopPropagation();

    return (
      <Tooltip isOpen={!isOpen && isHover} hasArrow placement='bottom' label='Font family' bg='black'>
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
              <Button
                onMouseEnter={setIsHover.on}
                onMouseLeave={setIsHover.off}
                onClick={onTriggerClick}
                data-testid={testId}
                rightIcon={<ChevronDown />}
                variant='ghost'
                size='sm'
                w={width}
                justifyContent='space-between'
                border='1px solid'
                borderColor='outline.gray'
                borderRadius={borderRadius}
                fontWeight='normal'
                _hover={{ bg: 'none' }}
                {...buttonProps}
              >
                <Box as='span' textOverflow='ellipsis' overflow='hidden' whiteSpace='nowrap'>
                  {fontFamily}
                </Box>
              </Button>
            </PopoverTrigger>
            <Box zIndex={'var(--vg-zIndices-fontMenu)'}>
              <PopoverContent w='192px'>
                <Suspense fallback={<Box />}>
                  <FontFamilySelectMenu
                    heading={heading}
                    label={label}
                    onClose={onClose}
                    onChange={onSetFont}
                    fontFamily={fontFamily}
                  />
                </Suspense>
              </PopoverContent>
            </Box>
          </Popover>
        </Box>
      </Tooltip>
    );
  },
);
