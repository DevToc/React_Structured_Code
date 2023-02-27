import { ReactComponent as MoveToFrontIcon } from 'assets/icons/toolbar/layer/moveFront.svg';
import { ReactComponent as MoveForwardIcon } from 'assets/icons/toolbar/layer/moveForwards.svg';
import { ReactComponent as MoveBackwardsIcon } from 'assets/icons/toolbar/layer/moveBackwards.svg';
import { ReactComponent as MoveToBackIcon } from 'assets/icons/toolbar/layer/moveBack.svg';

import { WidgetDirection } from 'modules/Editor/store/infographSlice.types';

const moveToFront = 'Move to Front';
const moveForward = 'Move Forward';
const moveBackwards = 'Move Backwards';
const moveToBack = 'Move to Back';

export const layerOptions = [
  {
    direction: WidgetDirection.Front,
    icon: <MoveToFrontIcon />,
    label: moveToFront,
    shortcuts: {
      macOs: ['ctrl', '+', 'shift', '+', '>'],
      others: ['ctrl', '+', 'shift', '+', '>'],
    },
  },
  {
    direction: WidgetDirection.Up,
    icon: <MoveForwardIcon />,
    label: moveForward,
    shortcuts: {
      macOs: ['ctrl', '+', '>'],
      others: ['ctrl', '+', '>'],
    },
  },
  {
    direction: WidgetDirection.Down,
    icon: <MoveBackwardsIcon />,
    label: moveBackwards,
    shortcuts: {
      macOs: ['ctrl', '+', '<'],
      others: ['ctrl', '+', '<'],
    },
  },
  {
    direction: WidgetDirection.Back,
    icon: <MoveToBackIcon />,
    label: moveToBack,
    shortcuts: {
      macOs: ['ctrl', '+', 'shift', '+', '<'],
      others: ['ctrl', '+', 'shift', '+', '<'],
    },
  },
];
