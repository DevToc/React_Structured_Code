interface UndoActionRegistryInterface {
  /**
   * Add list of actions into registry
   *
   * @param actions - List of actions
   */
  add: (actions: string[]) => void;

  /**
   * @param action - An undoable slice action
   * @returns true if registry has action
   */
  has: (action: string) => void;
}

/**
 * An action registry uses for storing all undoable refux slice action.
 */
export class UndoActionRegistry implements UndoActionRegistryInterface {
  private set = new Set<string>();

  add(actions: string[]) {
    actions.forEach((action) => typeof action === 'string' && this.set.add(action));
  }

  has(action: string): boolean {
    return this.set.has(action);
  }
}

/**
 * An singleton registry to store all undoable actions
 */
export const undoActionRegistry = new UndoActionRegistry();
