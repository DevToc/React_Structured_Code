import { Patch } from 'immer';

interface HistoryManager<T> {
  /**
   * Undo history
   */
  undo: () => void;

  /**
   * Redo history
   */
  redo: () => void;

  /**
   * Check whether there is undo history
   */
  canUndo: boolean;

  /**
   * Check whether there is redo history
   */
  canRedo: boolean;

  /**
   * Return a HistoryStore object
   */
  getStore: () => HistoryStore<T> | undefined;
}

interface HistoryRecord {
  patches: Patch[];
  inversePatches: Patch[];
  action?: string;
  createdAt: Date;
}

type PresentState<T> = T | {};

interface HistoryStore<T> {
  present: PresentState<T>;
  future: HistoryRecord[];
  past: HistoryRecord[];

  clear: () => void;
  addPast: (record: HistoryRecord) => void;
  addFuture: (record: HistoryRecord) => void;
  last: () => HistoryRecord;
  next: () => HistoryRecord;
  pop: () => HistoryRecord | undefined;
  shift: () => HistoryRecord | undefined;
  get limit(): number;
  clearFuture: () => void;
  replaceLast: (record: HistoryRecord) => void;
}

interface HistoryStoreOptions {
  limit?: number;
}

export type { HistoryManager, HistoryRecord, HistoryStore, HistoryStoreOptions, PresentState };
