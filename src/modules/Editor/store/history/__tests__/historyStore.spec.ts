import { historyStore, HistoryRecord, InfographicHistoryStore } from '../historyStore';
import { Patch } from 'immer';

describe('store/history/historyStore', () => {
  test('historyStore should not be empty', () => {
    expect(historyStore).toBeInstanceOf(InfographicHistoryStore);
  });

  test('historyStore should have expect record limit', () => {
    const patches: Patch[] = [{ op: 'add', path: [], value: '' }];
    const inversePatches: Patch[] = [{ op: 'replace', path: [], value: '' }];
    const record: HistoryRecord = { patches, inversePatches };
    const limit = 5;
    const store = new InfographicHistoryStore({ limit });

    expect(store.limit).toEqual(limit);

    // Add limit+1 record
    [...Array(limit + 1)].forEach((_) => store.addPast(record));
    expect(store.past.length).toEqual(limit);
  });
});
