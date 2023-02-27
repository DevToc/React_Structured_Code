import { Flex, UseRadioGroupProps } from '@chakra-ui/react';
import { CustomPageOption, DownloadOption } from 'constants/download';
import { ComponentProps } from 'react';

enum DefaultTabNumber {
  Share = 0,
  Download = 1,
}

interface CustomPageOptionProps {
  customPageRangeOption: CustomPageOption;
  handleCustomPageRangeOption: UseRadioGroupProps['onChange'];
  handleCustomPageRangeInput: (customRange: string) => void;
  isValidRange: boolean;
  isFreeUser?: boolean;
  isPremiumUser?: boolean;
  handleClickUpgrade?: (event: React.MouseEvent<HTMLAnchorElement>) => void;
}

interface DownloadOptionProps {
  downloadOption: DownloadOption;
  handleDownloadOption: UseRadioGroupProps['onChange'];
  isFreeUser?: boolean;
  handleClickUpgrade?: (event: React.MouseEvent<HTMLAnchorElement>) => void;
}

enum ExportStatus {
  Default = 'Default',
  Pending = 'Pending',
}

export type DownloadButtonProps = {
  downloadOption: DownloadOption;
  shouldDisable: boolean;
  selectedPageNumbers: number[];
};

interface OptionTitleProps extends ComponentProps<typeof Flex> {
  upgradeDescription?: string;
  shouldUpgrade?: boolean;
  handleClickUpgrade?: (event: React.MouseEvent<HTMLAnchorElement>) => void;
}

export { DefaultTabNumber, ExportStatus };
export type { CustomPageOptionProps, DownloadOptionProps, OptionTitleProps };
