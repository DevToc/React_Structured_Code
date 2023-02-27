import { MUTATION_OBSERVER_CONFIG } from '../FlowCore.config';
import WidgetObserverManager from '../WidgetObserverManager';

describe('FlowCore/WidgetObserverManager', () => {
  let managerIntsance: WidgetObserverManager;

  beforeEach(() => {
    managerIntsance = new WidgetObserverManager(MUTATION_OBSERVER_CONFIG);
  });

  describe('constructor', () => {
    it('should create the instance of WidgetObserverManager', () => {
      expect(managerIntsance).not.toBeNull();
    });
  });

  describe('add', () => {
    it('should add the item of the mutation observer list', () => {
      const dummyElement = document.createElement('dummyElement');
      expect(managerIntsance.count()).toBe(0);
      managerIntsance.add('id1-0', dummyElement, () => {});
      expect(managerIntsance.count()).toBe(1);
      managerIntsance.add('id2-0', dummyElement, () => {});
      expect(managerIntsance.count()).toBe(2);

      managerIntsance.add('id4-0', dummyElement, () => {}, dummyElement, 'root-id-0');
      expect(managerIntsance.count()).toBe(3);
      managerIntsance.add('id4-0', dummyElement, () => {}, dummyElement, 'root-id-1');
      expect(managerIntsance.count()).toBe(3);
    });
  });

  describe('get', () => {
    it('should return the specific mutation observer data by ids', () => {
      managerIntsance.add('id1-0', document.createElement('div'), () => {});
      managerIntsance.add('id2-0', document.createElement('div'), () => {});
      expect(managerIntsance.get('id1-0')).not.toBeNull();
      expect(managerIntsance.get('wrong-first-id')).toBeNull();
    });
  });

  describe('getAllByParentWidgetId', () => {
    it('should return the observer data by the root widget id', () => {
      const rootId = 'root-id';
      const dummyElement = document.createElement('dummyElement');
      managerIntsance.add('id1-0', dummyElement, () => {}, dummyElement, rootId);
      managerIntsance.add('id2-0', dummyElement, () => {}, dummyElement, rootId);
      managerIntsance.add('id3-0', dummyElement, () => {});

      expect(managerIntsance.getAllByParentWidgetId('root-id')).not.toBeNull();
      expect(managerIntsance.getAllByParentWidgetId('root-id')).toHaveLength(2);
      expect(managerIntsance.getAllByParentWidgetId('wrong-root-id')).toEqual([]);
    });
  });

  describe('observe/setCallback', () => {
    it('should set callback to the exist data in the list', () => {
      const mockOldCallback = jest.fn();
      const mockNewCallback = jest.fn();
      const mockDiv = document.createElement('div');
      managerIntsance.add('id1-0', document.createElement('div'), mockOldCallback);
      managerIntsance.setCallback('id1-0', mockNewCallback);
      managerIntsance.observe('id1-0');

      mockDiv.style.width = '1px';

      // mutation observer is async so it's using the setTimeout
      setTimeout(() => {
        expect(mockOldCallback.mock.calls.length).toBe(0);
        expect(mockNewCallback.mock.calls.length).toBe(1);
      }, 0);
    });
  });

  describe('disconnect', () => {
    it('should disconnect specific mutation observer using widget id', () => {
      managerIntsance.add('id1-0', document.createElement('div'), () => {});
      managerIntsance.setCallback('id1-0', () => {});
      managerIntsance.observe('id1-0');

      expect(managerIntsance.isConnecting()).toBe(true);
      managerIntsance.disconnect('id1-0');
      expect(managerIntsance.isConnecting()).toBe(false);
    });
  });

  describe('disconnectAll', () => {
    it('should disconnect all of the connected mutation observer', () => {
      managerIntsance.add('id1-0', document.createElement('div'), () => {});
      managerIntsance.setCallback('id1-0', () => {});
      managerIntsance.observe('id1-0');

      expect(managerIntsance.isConnecting()).toBe(true);
      managerIntsance.disconnectAll();
      expect(managerIntsance.isConnecting()).toBe(false);
    });
  });

  describe('reset', () => {
    it('should reset the instance of WidgetObserverManager', () => {
      managerIntsance.add('id1-0', document.createElement('div'), () => {});
      managerIntsance.add('id1-0', document.createElement('div'), () => {});
      managerIntsance.add('id1-0', document.createElement('div'), () => {});

      expect(managerIntsance.count()).toBe(1);
      managerIntsance.reset();
      expect(managerIntsance.count()).toBe(0);
      expect(managerIntsance.isConnecting()).toBe(false);
    });
  });
});
