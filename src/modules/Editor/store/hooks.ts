import { TypedUseSelectorHook, useDispatch, useSelector, useStore } from 'react-redux';
import type { RootState, AppDispatch } from './store';

// Use throughout your app instead of plain `useDispatch` and `useSelector`
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

// access store values on demand (e.g. in a function) without subscribing to the store
export const useAppStore = useStore;
