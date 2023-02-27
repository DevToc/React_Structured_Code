import { FocusEvent, ReactElement, useState } from 'react';
import { Box, Tabs, TabList, Tab, TabPanels, TabPanel } from '@chakra-ui/react';

import { LineWidgetMenu } from '../LineWidgetMenu';
import { BasicShapeWidgetMenu } from '../BasicShapeWidgetMenu';

interface ShapesMenuProps {
  onComplete?: () => void;
}

export const ShapesMenu = ({ onComplete }: ShapesMenuProps): ReactElement => {
  const [focusTabPanel, setFocusTabPanel] = useState(false);
  const handleFocus = (e: FocusEvent<HTMLDivElement>): void => {
    if (e.target !== e.currentTarget) return;
    setFocusTabPanel(true);
  };

  const handleBlur = (e: FocusEvent<HTMLDivElement>) => {
    if (e.target !== e.currentTarget) return;
    setFocusTabPanel(false);
  };

  return (
    <Box>
      <Tabs>
        <TabList h='48px'>
          <Tab fontSize='sm' fontWeight='semibold' _focus={{ boxShadow: 'inset var(--vg-shadows-outline)' }}>
            Shapes
          </Tab>
          <Tab fontSize='sm' fontWeight='semibold' _focus={{ boxShadow: 'inset var(--vg-shadows-outline)' }}>
            Lines
          </Tab>
        </TabList>
        <TabPanels>
          <TabPanel
            onFocus={handleFocus}
            onBlur={handleBlur}
            style={{
              boxShadow: focusTabPanel ? 'inset var(--vg-shadows-outline)' : 'unset',
            }}
          >
            <BasicShapeWidgetMenu onComplete={onComplete} />
          </TabPanel>
          <TabPanel
            onFocus={handleFocus}
            onBlur={handleBlur}
            style={{
              boxShadow: focusTabPanel ? 'inset var(--vg-shadows-outline)' : 'unset',
            }}
          >
            <LineWidgetMenu onComplete={onComplete} />
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Box>
  );
};
