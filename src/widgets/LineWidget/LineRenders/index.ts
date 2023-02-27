import Straight from './Straight';

import { LineWidgetTypes } from '../LineWidget.types';

export const LINE_TYPE_MAP = {
  [LineWidgetTypes.straight]: Straight,
  [LineWidgetTypes.curved]: null,
  [LineWidgetTypes.stepped]: null,
};
