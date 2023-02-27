import { useState } from 'react';
import { Flex, Text, Image, Spinner, VisuallyHidden } from '@chakra-ui/react';

import { loadFonts } from 'hooks/useFont';
import { FONT_FAMILIES } from './FontFamilySelect.config';
import { SelectMenu, SelectMenuSearch, SelectMenuList, SelectMenuOption, Option } from './SelectList';

interface FontOption extends Option {
  image_url: string;
  value: string;
}

interface FontFamilySelectMenuProps {
  onChange: (value: string) => void;
  fontFamily: string;
  onClose: () => void;
  heading: string;
  label: string;
}

const FontFamilySelectMenu = ({ onClose, onChange, fontFamily, heading, label }: FontFamilySelectMenuProps) => {
  const [fontFamilyOptions, setFontFamilyOptions] = useState<FontOption[]>(FONT_FAMILIES);
  const [fontIdLoading, setFontIdLoading] = useState<string>('');

  const labelId = 'search-label';

  const onSelectFont = async (fontFamily: string) => {
    if (fontIdLoading) return;

    setFontIdLoading(fontFamily);
    try {
      await loadFonts([fontFamily]);
    } catch (error) {
      // TODO: handle font loading error
    } finally {
      setFontIdLoading('');
    }

    onChange(fontFamily);
  };

  const onFilterFonts = (filteredList: Option[]) => setFontFamilyOptions(filteredList as FontOption[]);

  return (
    <SelectMenu value={fontFamily} options={fontFamilyOptions as Option[]} onChange={onSelectFont} onClose={onClose}>
      <SelectMenuSearch unfilteredOptions={FONT_FAMILIES} onFilter={onFilterFonts} />
      <SelectMenuList label={labelId} testId='font-select-menu-list'>
        <VisuallyHidden>
          <Text id={labelId}>{label}</Text>
        </VisuallyHidden>
        <Text px={2} fontSize='xs' color='font.300'>
          {heading}
        </Text>
        {fontFamilyOptions.map((option: FontOption) => {
          const { value, image_url } = option;
          const isSelected = value === fontFamily;
          const isLoading = value === fontIdLoading;

          return (
            <SelectMenuOption key={value} option={option as Option} isSelected={isSelected}>
              <Image w='100%' h='100%' objectFit='contain' src={image_url} alt={`Select ${value}`} />
              {isLoading && (
                <Flex data-testid={`loading-font-${value}`} right={2} h='100%' align='center' position='absolute'>
                  <Spinner size='xs' />
                </Flex>
              )}
            </SelectMenuOption>
          );
        })}
      </SelectMenuList>
    </SelectMenu>
  );
};

export default FontFamilySelectMenu;
