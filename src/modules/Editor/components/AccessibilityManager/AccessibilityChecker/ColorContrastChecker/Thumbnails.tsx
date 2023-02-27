import { Box, Flex } from '@chakra-ui/react';

import { Page } from '../../../../../common/components/Page';
import { WidgetRenderer } from 'widgets/WidgetRenderer';
import { EmptyBoundingBoxProvider } from '../../../BoundingBox/useBoundingBox';
import { useAppSelector } from '../../../../store/hooks';
import { selectPageOrder, selectInfograph, selectInfographSize } from '../../../../store/infographSelector';
import { getScale } from '../../../../../../modules/Editor/components/PageManager/Slides/Slide.helpers';
import {
  THUMBNAIL_HEIGHT,
  THUMBNAIL_WIDTH,
} from '../../../../../../modules/Editor/components/PageManager/Slides/Slide.config';

interface ThumbnailsProps {
  setRefs: (index: number, el: HTMLDivElement | null) => void;
}
export const Thumbnails = ({ setRefs }: ThumbnailsProps) => {
  const pageIds = useAppSelector(selectPageOrder);
  const infograph = useAppSelector(selectInfograph);
  const pageSize = useAppSelector(selectInfographSize);

  return (
    <>
      <EmptyBoundingBoxProvider>
        {pageIds.map((pageId, index) => (
          <Flex
            key={index}
            align='center'
            justify='center'
            w={THUMBNAIL_WIDTH}
            h={THUMBNAIL_HEIGHT}
            mr='18px'
            overflow='hidden'
          >
            <Box maxHeight={THUMBNAIL_HEIGHT} overflow='hidden' ref={(el) => setRefs(index, el)}>
              <Page
                bg={infograph.pages[pageId].background}
                width={pageSize.widthPx}
                height={pageSize.heightPx}
                zoom={getScale(pageSize.heightPx, pageSize.widthPx)}
              >
                <WidgetRenderer pageId={pageId} isReadOnly />
              </Page>
            </Box>
          </Flex>
        ))}
      </EmptyBoundingBoxProvider>
    </>
  );
};
