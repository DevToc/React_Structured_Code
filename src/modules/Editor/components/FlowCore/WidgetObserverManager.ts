import { WidgetId } from 'types/idTypes';

type WidgetObserverData = {
  widgetId: WidgetId;
  element: HTMLElement;
  observer: MutationObserver;
  mutationCallback: MutationCallback;
  isConnected: boolean;
  isResponsive: boolean;
  parentResponsiveElement?: HTMLElement | undefined;
  parentResponsiveWidgetId?: WidgetId | undefined;
};

class WidgetObserverManager {
  private targetList: WidgetObserverData[];
  private config: MutationObserverInit;
  private removedObserverList: MutationObserver[];

  constructor(config: MutationObserverInit) {
    this.targetList = [];
    this.removedObserverList = [];
    this.config = config;
  }

  add(
    widgetId: WidgetId,
    element: HTMLElement,
    callback: MutationCallback,
    parentResponsiveElement: HTMLElement | undefined = undefined,
    parentResponsiveWidgetId: WidgetId | undefined = undefined,
  ) {
    // Cleanup the removeList before adding new observer.
    this.cleanRemoveList();

    const target = this.get(widgetId);
    if (target) {
      target.element = element;
      this.setCallback(widgetId, callback);
    } else {
      this.targetList.push({
        widgetId,
        element: element,
        observer: new MutationObserver(callback),
        mutationCallback: callback,
        isConnected: false,
        isResponsive: !!parentResponsiveElement,
        parentResponsiveElement,
        parentResponsiveWidgetId,
      });
    }
  }

  get(widgetId: WidgetId): WidgetObserverData | null {
    return this.targetList.find((x) => x.widgetId === widgetId) || null;
  }

  getAllByParentWidgetId(widgetId: WidgetId): WidgetObserverData[] {
    return this.targetList.filter((x) => x.parentResponsiveWidgetId === widgetId || x.widgetId === widgetId);
  }

  count() {
    return this.targetList.length;
  }

  setCallback(widgetId: WidgetId, callback: MutationCallback): void {
    const target = this.get(widgetId);
    if (target) {
      // Store the old to observer into the list to avoid disconnecting timing issue
      this.removedObserverList.push(target.observer);

      target.mutationCallback = callback;
      target.observer = new MutationObserver(callback);
    }
  }

  observe(widgetId: WidgetId, config: MutationObserverInit = this.config) {
    const target = this.get(widgetId);
    if (target) {
      target.isConnected = true;

      const targetElement = target.isResponsive ? (target.parentResponsiveElement as HTMLElement) : target.element;
      target.observer.observe(targetElement, config);
    }
  }

  // Since it operates asynchronously, so old observer is stored in this list without disconnecting immediately
  // And, disconnect the removedObserverList from here at once.
  cleanRemoveList() {
    this.removedObserverList.forEach((observer) => observer.disconnect());
    this.removedObserverList = [];
  }

  disconnect(widgetId: WidgetId) {
    const target = this.get(widgetId);
    if (target) {
      target.isConnected = false;
      target.observer.disconnect();
    }
  }

  disconnectAll() {
    this.cleanRemoveList();

    if (this.isConnecting()) {
      this.targetList
        .filter((target) => target.isConnected === true)
        .forEach((target) => {
          target.observer.disconnect();
          target.isConnected = false;
        });
    }
  }

  reset() {
    this.disconnectAll();
    this.targetList = [];
  }

  isConnecting() {
    return this.targetList.some((target) => target.isConnected === true);
  }
}

export default WidgetObserverManager;
