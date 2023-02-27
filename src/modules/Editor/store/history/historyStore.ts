import { isEmpty } from './utils';
import type { InfographState } from '../../../../types/infographTypes';
import { HistoryStore, PresentState, HistoryRecord, HistoryStoreOptions } from './history.types';

const DEFAULT_LIMIT = 100;

export class InfographicHistoryStore<T> implements HistoryStore<T> {
  private _limit = DEFAULT_LIMIT;
  present: PresentState<T> = {};
  future: HistoryRecord[] = [];
  past: HistoryRecord[] = [];

  constructor({ limit }: HistoryStoreOptions) {
    this._limit = limit ?? DEFAULT_LIMIT;
  }

  /**
   * Check store whether is empty or not
   */
  isEmpty() {
    return isEmpty(this.present) && this.future.length === 0 && this.past.length === 0;
  }

  /**
   * Clear store
   */
  clear() {
    this.clearPresent();
    this.clearPast();
    this.clearFuture();
  }

  /**
   * Add history record to past history
   */
  addPast(record: HistoryRecord) {
    if (isEmpty(record)) return;
    this.verifyLimit();
    this.past.push(record);
  }

  /**
   * Add history record to future history
   */
  addFuture(record: HistoryRecord) {
    if (isEmpty(record)) return;
    this.future = [record, ...this.future];
  }

  /**
   * @returns {HistoryRecord} last past history
   */
  last(): HistoryRecord {
    return this.past[this.past.length - 1];
  }

  /**
   * Replace last history record
   * @param record
   */
  replaceLast(record: HistoryRecord) {
    if (this.past.length === 0) return;
    this.past[this.past.length - 1] = record;
  }

  /**
   * @returns {HistoryRecord} A history record
   */
  pop(): HistoryRecord | undefined {
    return this.past.pop();
  }

  /**
   * @returns {HistoryRecord} first future history record
   */
  next() {
    return this.future[0];
  }

  /**
   * Shift future history
   * @returns {HistoryRecord} A history entry
   */
  shift(): HistoryRecord | undefined {
    return this.future.shift();
  }

  /**
   * Remove most early hisotry
   */
  removeFirst() {
    this.past.shift();
  }

  /**
   * Clear future hisotry array
   */
  clearFuture() {
    this.future = [];
  }

  /**
   * Clear past history array
   */
  clearPast() {
    this.past = [];
  }

  /**
   * Clear present state
   */
  clearPresent() {
    this.present = {};
  }

  /**
   * If store has over giving limit size, remove early history
   */
  verifyLimit() {
    if (this.past.length >= this._limit) {
      this.removeFirst();
    }
  }

  get limit(): number {
    return this._limit;
  }
}

/**
 * Infographic singleton hisotry store
 */
export const historyStore: HistoryStore<InfographState> = new InfographicHistoryStore({});
