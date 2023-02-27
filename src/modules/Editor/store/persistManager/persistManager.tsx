import { useEffect, useReducer, createContext, ReactNode } from 'react';
// import infographicApi from '../../../../api/infographic';
import { saveFullInfograph } from '../../../../libs/e2api/commit';
import { useAppSelector } from '../hooks';
import { selectInfograph } from '../infographSelector';
import { selectOriginalEditorId } from '../selectEditorSettings';
import { useDebouncedCallback } from '../../../../hooks/useDebounce';

/**
 * An interal state to keep tracking of current editor saving status
 */
interface PersistState {
  /**
   * A flag indicated PersistState in saving state
   */
  saving: boolean;

  /**
   * Last saving error
   */
  lastError: string;

  /**
   * Last modfied time
   */
  lastModified: Date | undefined;
}

interface PersistOptions {
  /**
   * Debounce time for persist call
   */
  delay: number;

  /**
   * An optional callback triggers after persists
   */
  callback?: () => void;
}

/**
 * Initial persist state
 */
const initState: PersistState = {
  saving: false,
  lastError: '',
  lastModified: undefined,
};

/**
 * Action type for persist reducer
 */
export enum ActionType {
  SAVING = 'saving',
  FINISHED = 'finished',
  ERROR = 'error',
}

/**
 * @typeParam T - Type of string in {@link ActionType}
 * @typeParam P - Type of generic object literal as payload
 */
type PersistAction<T extends string = string, P = any> = {
  type: T;
  payload?: P;
};

/**
 * This reducer is used of manipulated persist state
 *
 * @param state - The persist state
 * @param action - The reducer action
 * @returns The persist state
 */
function persistReducer(state: PersistState, action: PersistAction): PersistState {
  switch (action.type) {
    case ActionType.SAVING:
      return { ...state, saving: true, lastError: '' };
    case ActionType.FINISHED:
      return { ...state, saving: false, lastError: '', lastModified: new Date() };
    case ActionType.ERROR:
      return { ...state, saving: false, lastError: action.payload.error };
    default:
      throw new Error(`Invalid Persist Action [${action.type}]`);
  }
}

/**
 * A persist manager hook returns current persist state
 *
 * @see {@link https://github.com/microsoft/TypeScript/issues/27942} tsdoc has issued with destructured param
 *
 * @param options - Perist options
 * @param options.delay - Debounce save time
 * @returns The persist state
 */
export function usePersistManager({ delay }: PersistOptions): PersistState {
  const [state, dispatch] = useReducer(persistReducer, initState);
  const infographic = useAppSelector(selectInfograph);
  const debounceSave = useDebouncedCallback(saveInfographic, delay);

  const originalEditorId = useAppSelector(selectOriginalEditorId);

  async function saveInfographic(infographicData: typeof infographic, originalId: typeof originalEditorId) {
    try {
      // Note: will add logic to prevent initial save on first load later on
      dispatch({ type: ActionType.SAVING });
      await saveFullInfograph(infographicData, originalId);
      dispatch({ type: ActionType.FINISHED });
    } catch (err: any) {
      dispatch({ type: ActionType.ERROR, payload: { error: err?.message } });
    }
  }

  useEffect(() => {
    debounceSave(infographic, originalEditorId);
    return () => {
      debounceSave.cancel();
    };
  }, [infographic, debounceSave, originalEditorId]);

  return { ...state };
}

/**
 * A public persist manager context uses to keep tracking persist state
 */
export const PersistManagerContext = createContext<PersistState>(initState);

/**
 * Default debounce delay constant
 */
const DEFAULT_DEBOUNCE_DELAY = 1000;

/**
 * Return the persist manager provider component
 *
 * @param props - The provider props
 * @param props.children - A ReactNode
 * @returns The persist manager provider
 */
export const PersistManagerProvider = ({ children }: { children?: ReactNode }) => {
  const state = usePersistManager({ delay: DEFAULT_DEBOUNCE_DELAY });
  return <PersistManagerContext.Provider value={state}>{children}</PersistManagerContext.Provider>;
};
