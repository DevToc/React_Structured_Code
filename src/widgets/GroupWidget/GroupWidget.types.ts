import { Widget } from '../../types/widget.types';
import { WidgetId } from '../../types/idTypes';

interface GroupWidgetData extends Widget {
  memberWidgetIds: WidgetId[];
}

export type { GroupWidgetData };
