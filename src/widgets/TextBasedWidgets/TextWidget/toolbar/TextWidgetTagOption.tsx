import { Text, Flex, Link } from '@chakra-ui/react';
import styled from '@emotion/styled';

import { DropdownPopover } from '../../../../modules/common/components/ToolbarPopover';
import { Toggletip } from '../../../../modules/common/components/Toggletip';

import { ReactComponent as TagIcon } from '../../../../assets/icons/tag.svg';
import { ReactComponent as OutlineInfoIcon } from '../../../../assets/icons/outline_info.svg';

import { TextWidgetTag } from '../../common/TextBasedWidgets.types';
import { HEADINGS_HELP_LINK } from '../../../../constants/links';
import { Mixpanel } from '../../../../libs/third-party/Mixpanel/mixpanel';
import { HELP_OPENED } from '../../../../constants/mixpanel';

const TAG_OPTIONS = [
  {
    value: TextWidgetTag.Title,
    label: 'Title',
  },
  {
    value: TextWidgetTag.H1,
    label: 'H1',
  },
  {
    value: TextWidgetTag.H2,
    label: 'H2',
  },
  {
    value: TextWidgetTag.H3,
    label: 'H3',
  },
  {
    value: TextWidgetTag.H4,
    label: 'H4',
  },
  {
    value: TextWidgetTag.H5,
    label: 'H5',
  },
  {
    value: TextWidgetTag.H6,
    label: 'H6',
  },
  {
    value: TextWidgetTag.Paragraph,
    label: 'P',
  },
];

interface TextWidgetTagOptionProps {
  selectedTag: TextWidgetTag;
  onChange: (tag: TextWidgetTag) => void;
}

const StyledOutlineInfoIcon = styled(OutlineInfoIcon)`
  & path {
    stroke: var(--vg-colors-upgrade-blue-500) !important;
  }
`;

const handleClickHelpLink = () => {
  Mixpanel.track(HELP_OPENED, {
    from: 'Text Tag Menu',
    help_type: 'Text Tag',
  });
};

const TooltipContent = () => (
  <>
    <Text fontSize={'xs'} mb={2} textAlign={'left'}>
      Text tags are hidden properties that help screen reader users navigate your design. They do not impact the style
      of the text.
    </Text>
    <Link
      fontSize={'xs'}
      w={'fit-content'}
      variant={'inline-dark'}
      href={HEADINGS_HELP_LINK}
      isExternal
      target={'_blank'}
      onClick={handleClickHelpLink}
    >
      Learn more about tagging text.
    </Link>
  </>
);

const DropdownHeader = () => (
  <Flex justifyContent={'space-between'} alignItems={'center'}>
    <Text fontSize={'xs'} fontWeight={'bold'}>
      Text Tag
    </Text>
    <Toggletip
      label={''}
      hasArrow={true}
      placement={'right'}
      icon={<StyledOutlineInfoIcon />}
      buttonAriaLabel={'Text tag toolbar tooltip'}
    >
      <TooltipContent />
    </Toggletip>
  </Flex>
);

export const TextWidgetTagOption = ({ selectedTag, onChange }: TextWidgetTagOptionProps) => {
  const selectedIndex = TAG_OPTIONS.findIndex((opt) => opt.value === selectedTag);
  return (
    <DropdownPopover
      selectedIndex={selectedIndex}
      options={TAG_OPTIONS}
      toolbarIcon={<TagIcon />}
      label={'Text Tag'}
      onSelect={onChange}
      header={<DropdownHeader />}
      w={100}
      showSelectedIcon={true}
    />
  );
};
