import { createAction } from '@reduxjs/toolkit';

const undoAction = createAction('history/UNDO');
const redoAction = createAction('history/REDO');

export { undoAction, redoAction };
