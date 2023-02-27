import { ComponentProps, ReactElement, useRef } from 'react';
import { Box, Flex, Portal } from '@chakra-ui/react';
import { InfoContainer } from './InfoContainer';
import { ResultContainer } from './ResultContainer/ResultContainer';
import { useAccessibilityChecker } from './checker.hooks';
import { Thumbnails } from './ColorContrastChecker';
import { useScanDocument } from './common/hooks/useScanDocument';

const CheckAccessibilityTab = (props: ComponentProps<typeof Box>): ReactElement => {
  const { state } = useAccessibilityChecker();
  const { showChecker } = state;
  const refs = useRef<Array<HTMLDivElement>>([]);
  const { scanDocument } = useScanDocument(refs.current);

  const setRefs = (index: number, el: HTMLDivElement | null) => {
    if (!el) return;
    refs.current[index] = el;
  };

  return (
    <Flex alignContent='center' justifyContent='center' {...props}>
      {!showChecker && <InfoContainer scanDocument={scanDocument} />}
      {showChecker && <ResultContainer scanDocument={scanDocument} thumbnailsRefs={refs.current} />}

      {/*
        Hidden thumbnails component for calculating the color contrast score
        Append thumbnails dom to document.body to address duplicate gradient id in svg defs cause shape render incorrectly
      */}
      <Portal>
        <Box width='0px' height='0px' opacity='0' pointerEvents='none' position='absolute' overflow='hidden'>
          <Thumbnails setRefs={setRefs} />
        </Box>
      </Portal>
    </Flex>
  );
};

export default CheckAccessibilityTab;
