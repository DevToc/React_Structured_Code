import { store } from 'modules/Editor/store/store';
import { RootState } from 'modules/Editor/store';
import { selectZoom } from 'modules/Editor/store/selectEditorSettings';

// Get the editor zoom level on demand
// E.g. if the zoom level is required outside of a react component where a hook (useEditor / useAppSelector) cannot be used
const getEditorZoom = () => {
  const zoom = selectZoom(store.getState() as RootState);
  return zoom;
};

export { getEditorZoom };
