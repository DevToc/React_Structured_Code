import { ReactElement, ChangeEvent } from 'react';
import { Tooltip, Select, VisuallyHidden } from '@chakra-ui/react';

import { useAppSelector, useAppDispatch } from '../../store/hooks';
import { setZoom } from '../../store/editorSettingsSlice';
import { selectZoom } from '../../store/selectEditorSettings';
import { ZOOM_OPTIONS, ZoomOption } from '../../Editor.config';

const ZOOM_SELECT_ID = 'editor-zoom-select';

// TODO: update to new zoom and move to page area
export const ZoomSelect = (): ReactElement => {
  const zoom = useAppSelector(selectZoom);
  const dispatch = useAppDispatch();

  const onChangeZoom = (e: ChangeEvent<HTMLSelectElement>) => dispatch(setZoom(+e.target.value));

  return (
    <>
      <VisuallyHidden>
        <label htmlFor={ZOOM_SELECT_ID}>Select Canvas Zoom</label>
      </VisuallyHidden>
      <Tooltip label='Zoom' aria-label='Set Canvas zoom'>
        <Select id={ZOOM_SELECT_ID} w='90px' size='sm' value={zoom} onChange={onChangeZoom}>
          {ZOOM_OPTIONS.map((option: ZoomOption, i) => {
            const { value, label } = option;

            return (
              <option aria-selected={value === zoom} key={value} value={value}>
                {label}
              </option>
            );
          })}
        </Select>
      </Tooltip>
    </>
  );
};
