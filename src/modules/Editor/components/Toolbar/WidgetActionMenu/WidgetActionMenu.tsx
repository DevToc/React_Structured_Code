import { Box, Flex, IconButton, Popover, PopoverContent, PopoverTrigger } from '@chakra-ui/react';

import { ToolbarDivider } from 'modules/common/components/Toolbar/ToolbarDivider';
import { ReactComponent as MoreIcon } from 'assets/icons/more.svg';
import { GroupWidgetMenu } from './GroupWidgetMenu';
import { FlowModeToggleButton } from './FlowModeToggleButton';
import { LayerMenu } from './LayerMenu/LayerMenu';
import { LockMenu } from './LockMenu';
import { DeleteMenu } from './DeleteMenu';
import { DuplicateMenu } from './DuplicateMenu';
import { ForwardedRef, forwardRef } from 'react';

const moreOptionsLabel = 'More Options';

interface WidgetActionMenuProps {
  // Set to TRUE to render the options in a dropdown
  useDropdown: boolean;
}

export const WidgetActionMenu = forwardRef(
  ({ useDropdown }: WidgetActionMenuProps, ref: ForwardedRef<HTMLDivElement>) => {
    return (
      <Box ref={ref}>
        {useDropdown ? (
          <Flex gap={2} alignItems='center'>
            <ToolbarDivider />
            <Popover placement='bottom-end' closeOnBlur={true}>
              {({ isOpen }) => (
                <>
                  <PopoverTrigger>
                    <IconButton
                      aria-label={moreOptionsLabel}
                      isActive={isOpen}
                      icon={<MoreIcon />}
                      size='sm'
                      variant='icon-btn-toolbar-option'
                      outline='none'
                    />
                  </PopoverTrigger>
                  <PopoverContent w='fit-content' boxShadow='md' padding={2}>
                    <ActionMenuContent />
                  </PopoverContent>
                </>
              )}
            </Popover>
          </Flex>
        ) : (
          <ActionMenuContent />
        )}
      </Box>
    );
  },
);

WidgetActionMenu.displayName = 'WidgetActionMenu';

export const ActionMenuContent = () => (
  <Flex gap={2} alignItems='center' overflowX='auto'>
    <FlowModeToggleButton />
    <LayerMenu />
    <ToolbarDivider />
    <GroupWidgetMenu />
    <DuplicateMenu />
    <LockMenu />
    <DeleteMenu />
  </Flex>
);
