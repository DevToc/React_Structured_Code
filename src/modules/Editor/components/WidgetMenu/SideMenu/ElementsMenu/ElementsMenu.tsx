import { useRef } from 'react';
import { GridItem, Grid, Flex } from '@chakra-ui/react';
import { loadFonts } from 'hooks/useFont';
import { addNewWidget, useAppSelector, useAppDispatch } from 'modules/Editor/store';
import { selectZoom } from 'modules/Editor/store/selectEditorSettings';
import { selectInfographWidthPx } from 'modules/Editor/store/infographSelector';
import { STYLED_RESPONSIVE_TEXT_WIDGETS } from './ElementsMenu.config';
import { generateDefaultData } from 'widgets/ResponsiveWidgets/ResponsiveTextWidget/ResponsiveTextWidget.helpers';
import { ElementThumbnail } from './ElementThumbnail';
import { calculateInitialTopPx, INITIAL_LEFTPX_RATIO } from 'utils/calculateInitialWidgetPos';

interface ElementsMenuProps {
  onComplete?: () => void;
}

export const ElementsMenu = ({ onComplete }: ElementsMenuProps) => {
  // font loading is async, so we need to prevent multiple widgets being added at once if the user clicks quickly while the fonts are loading
  const widgetsBeingAddedMap = useRef<{ [index: number]: boolean }>({});
  const dispatch = useAppDispatch();

  const zoom = useAppSelector(selectZoom);
  const infographWidthPx = useAppSelector(selectInfographWidthPx);

  const doAddWidget = async (index: number) => {
    if (widgetsBeingAddedMap.current[index]) return;
    widgetsBeingAddedMap.current[index] = true;

    const styleData = STYLED_RESPONSIVE_TEXT_WIDGETS[index];
    const { widthPx, heightPx, fontsToLoad } = styleData;
    const initialTopPx = calculateInitialTopPx(zoom);
    const initialLeftPx = INITIAL_LEFTPX_RATIO * infographWidthPx;

    if (fontsToLoad && fontsToLoad.length > 0) {
      await loadFonts(fontsToLoad);
    }

    dispatch(
      addNewWidget(
        generateDefaultData({
          shapeDataOverride: { widthPx, heightPx, ...styleData.backgroundShapeData },
          textDataOverride: styleData.textWidgetData,
          parentDataOverride: { widthPx, heightPx, topPx: initialTopPx, leftPx: initialLeftPx },
        }),
      ),
    );

    widgetsBeingAddedMap.current[index] = false;

    if (typeof onComplete === 'function') onComplete();
  };

  return (
    <Flex direction={'column'} p={4}>
      <Grid templateColumns={'repeat(2, 1fr)'} columnGap={4} rowGap={4}>
        {STYLED_RESPONSIVE_TEXT_WIDGETS.map((_, index) => (
          <GridItem key={index} h={120}>
            <ElementThumbnail onClick={doAddWidget} index={index} />
          </GridItem>
        ))}
      </Grid>
    </Flex>
  );
};
