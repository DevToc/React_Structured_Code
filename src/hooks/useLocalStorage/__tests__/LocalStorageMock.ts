export default class LocalStorageMock {
  private store = new Map<string, unknown>();

  clear() {
    this.store.clear();
  }

  getItem(key: string) {
    return this.store.get(key);
  }

  setItem(key: string, value: unknown) {
    this.store.set(key, value);
  }

  removeItem(key: string) {
    this.store.delete(key);
  }
}
