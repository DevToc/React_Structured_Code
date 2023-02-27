import { colord, extend } from 'colord';
import namesPlugin from 'colord/plugins/names';
import { Color, RGBAParsed } from './ColorPicker.types';

extend([namesPlugin]);

export const toRgbString = (color: Color) => colord(color).toRgbString();
export const removeHexAlpha = (color: Color) => colord(color).alpha(1).toHex();
export const removeAlpha = (color: Color) => colord(color).alpha(1).toRgbString();
export const parseColorToRgba = (color: Color): RGBAParsed => colord(color).rgba;
export const toHex = (color: Color) => colord(color).toHex();
