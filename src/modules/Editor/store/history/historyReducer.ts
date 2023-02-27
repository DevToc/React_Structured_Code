import { Reducer } from '@reduxjs/toolkit';
import { applyPatches, produceWithPatches, enablePatches, Draft } from 'immer';
import isEqual from 'lodash.isequal';
import type { InfographState } from '../../../../types/infographTypes';
import { HistoryRecord } from './history.types';
import { historyStore } from './historyStore';
import { undoActionRegistry } from './undoable';
import { undoAction, redoAction } from './history.actions';
import { isEmpty } from './utils';

enablePatches();

/**
 * Debounce time for adding next same action record
 * Note: this can be changed into configurable withHistoryReducer(reducer: Reducer, { debounce: DEBOUNCE_TIME });
 */
const DEBOUNCE_TIME = 500;

/**
 * Note: We only compare first two keys in the patch.path for similarity
 * This can be more simplify once we implement group action
 *
 * Example:
 * r1 => {op: 'replace': path: ['widgets', '003.widget-1', ...]}
 * r2 => {op: 'replace': path: ['widgets', '003.widget-1', ...]}
 *
 * @param r1 - A history record
 * @param r2 - A compare history record
 * @returns  True if both records have similar op and path
 */
const hasSimilarPatch = (r1: HistoryRecord, r2: HistoryRecord) => {
  for (const [i, patch] of r1?.patches?.entries()) {
    if (patch.op === r2?.patches?.[i]?.op && isEqual(patch.path?.slice(0, 2), r2?.patches?.[i]?.path?.slice(0, 2)))
      continue;
    return false;
  }

  return r1?.patches?.length === r2?.patches?.length;
};

/**
 * This is higher order history reducer that wraps redux slicer
 *
 * @param reducer - A redux reducer
 * @returns The wrap reducer with history manager
 */
export function withHistoryReducer(reducer: Reducer): Reducer {
  return (state, action, ...args) => {
    switch (action.type) {
      case undoAction.type: {
        const record = historyStore.last();
        // If there is no last record or present state = {}, return original state
        if (isEmpty(record) || isEmpty(historyStore.present)) {
          return state;
        }

        const newState = applyPatches(historyStore.present, record.inversePatches);
        historyStore.present = newState;
        historyStore.addFuture(historyStore.pop()!);

        return historyStore.present;
      }

      case redoAction.type: {
        const record = historyStore.next();
        if (isEmpty(record)) return state;

        const newState = applyPatches(historyStore.present, record.patches);
        historyStore.present = newState;
        historyStore.addPast(historyStore.shift()!);

        return historyStore.present;
      }

      default: {
        // If action not in the registry, fallback default reducer
        // We can implement undo before and after events with pub/sub later on
        if (!undoActionRegistry.has(action.type)) return reducer.apply(null, [state, action, ...args]);

        // Note: following logic can easily swap into snapshot implementation by storing entire nextState in the history
        // Example: historyStore.addPast({ state: nextState, action: action.type});

        /**
         * Use produceWithPatches to retrieve diff between two immer json object
         */
        const [nextState, patches, inversePatches] = produceWithPatches(state as Draft<InfographState>, (draft) =>
          reducer.apply(null, [draft, action, ...args]),
        );

        if (state === nextState) return nextState;

        const lastRecord = historyStore.last();
        const record = { patches, inversePatches, action: action.type, createdAt: new Date() };

        historyStore.present = nextState as Draft<InfographState>;
        historyStore.clearFuture();

        /**
         * Replace last history record if current action is same as last history record withing giving debounce threshold
         * Note: skip adding to history before produceWithPatches will result better performance. But it may lose tracking on last undo
         */
        if (
          lastRecord?.action === action.type &&
          hasSimilarPatch(record, lastRecord) &&
          record.createdAt.valueOf() - lastRecord.createdAt.valueOf() < DEBOUNCE_TIME
        ) {
          historyStore.replaceLast(record);
        } else {
          historyStore.addPast(record);
        }

        return nextState;
      }
    }
  };
}
