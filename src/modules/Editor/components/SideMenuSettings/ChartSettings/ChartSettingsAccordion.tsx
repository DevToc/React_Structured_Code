import {
  Accordion,
  AccordionItem,
  AccordionButton,
  Box,
  AccordionIcon,
  AccordionPanel,
  FormLabel,
  Switch,
  Flex,
  AccordionPanelProps,
} from '@chakra-ui/react';

export const SettingsAccordion = ({
  title,
  children,
  isDefaultOpen = false,
  accordionPanelProps,
}: {
  title: string;
  children: React.ReactNode;
  isDefaultOpen?: boolean;
  accordionPanelProps?: AccordionPanelProps;
}) => {
  return (
    <Accordion
      defaultIndex={isDefaultOpen ? [0] : [-1]}
      boxShadow='settingsAccordion'
      borderRadius='base'
      allowMultiple
    >
      <AccordionItem px={0} border='none'>
        <h2>
          <AccordionButton px={4} py={3}>
            <Box fontSize='sm' fontWeight='bold' flex='1' textAlign='left'>
              {title}
            </Box>
            <AccordionIcon />
          </AccordionButton>
        </h2>
        <AccordionPanel py={3} px={4} pt={0} {...accordionPanelProps}>
          {children}
        </AccordionPanel>
      </AccordionItem>
    </Accordion>
  );
};

export const SettingsAccordionToggle = ({
  title,
  isChecked,
  onToggle,
  children,
  accordionPanelProps,
}: {
  title: string;
  children: React.ReactNode;
  isChecked: boolean;
  onToggle: () => void;
  accordionPanelProps?: AccordionPanelProps;
}) => (
  <Accordion index={isChecked ? [0] : [-1]} boxShadow='settingsAccordion' borderRadius='base' allowMultiple>
    <AccordionItem border='none'>
      <h2>
        <AccordionButton onClick={onToggle} px={4} py={3}>
          <Box fontSize='sm' fontWeight='bold' flex='1' textAlign='left'>
            {title}
          </Box>
          {/* Stop click on switch to trigger onClick in AccordionButton */}
          {/* Clicking the accordion button or clicking the Switch should trigger onToggle */}
          <Flex onClick={(e) => e.stopPropagation()}>
            <FormLabel htmlFor={title + 'toggle'}></FormLabel>
            <Switch onChange={onToggle} isChecked={isChecked} id={title + 'toggle'} />
          </Flex>
        </AccordionButton>
      </h2>
      <AccordionPanel py={3} px={4} pt={0} {...accordionPanelProps}>
        {children}
      </AccordionPanel>
    </AccordionItem>
  </Accordion>
);
