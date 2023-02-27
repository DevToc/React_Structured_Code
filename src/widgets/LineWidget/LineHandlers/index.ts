import Straight from './Straight';

import { LineWidgetTypes } from '../LineWidget.types';

export const LINE_HANDLER_MAP = {
  [LineWidgetTypes.straight]: Straight,
  [LineWidgetTypes.curved]: null,
  [LineWidgetTypes.stepped]: null,
};
